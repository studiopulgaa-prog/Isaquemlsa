-- Anotações: opção "visível para a equipe" e anotações pessoais sem cliente (diário/relatório da semana).
-- Comunicados de abertura: tela que bloqueia o painel até a pessoa confirmar a leitura.
alter table public.eq_anotacoes add column if not exists publica boolean not null default false;
alter table public.eq_anotacoes alter column cliente_id drop not null;

create table if not exists public.eq_comunicados (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text not null,
  para uuid[] not null default '{}',   -- vazio = equipe toda
  criado_por uuid,
  criado_em timestamptz not null default now(),
  ativo boolean not null default true
);
create table if not exists public.eq_comunicado_leituras (
  comunicado_id uuid not null,
  membro_id uuid not null,
  lido_em timestamptz not null default now(),
  primary key (comunicado_id, membro_id)
);
alter table public.eq_comunicados enable row level security;
alter table public.eq_comunicado_leituras enable row level security;
revoke all on public.eq_comunicados, public.eq_comunicado_leituras from anon, authenticated;

create or replace function public.eq_rpc_extra(p_secret text, p_op text, p_args jsonb default '{}'::jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_membro uuid := nullif(p_args->>'membro_id','')::uuid; r jsonb;
begin
  if p_secret is null or p_secret is distinct from (select v from public.eq_config where k = 'secret') then
    raise exception 'nao autorizado';
  end if;

  if p_op = 'acesso_ping' then
    insert into public.eq_acessos (membro_id, sessao, area, dispositivo)
      values (v_membro, p_args->>'sessao', coalesce(p_args->>'area','equipe'), left(coalesce(p_args->>'dispositivo',''), 120))
      on conflict (sessao) do update set ultimo = now()
      where eq_acessos.membro_id = excluded.membro_id;
    return (select jsonb_build_object('nao_lidos', count(*) filter (where lido_em is null), 'ultimo', max(criado_em))
              from public.eq_avisos where membro_id = v_membro and not removido)
      || jsonb_build_object(
        'conteudo', (select max(atualizado_em) from public.eq_conteudo),
        'comunicados', (select count(*) from public.eq_comunicados c where c.ativo
                          and (cardinality(c.para) = 0 or v_membro = any(c.para))
                          and not exists (select 1 from public.eq_comunicado_leituras l where l.comunicado_id = c.id and l.membro_id = v_membro)));

  elsif p_op = 'acessos_listar' then
    return coalesce((select jsonb_agg(to_jsonb(x) order by x.inicio desc) from public.eq_acessos x
                      where x.inicio > now() - make_interval(days => least(greatest(coalesce((p_args->>'dias')::int, 30), 1), 90))), '[]'::jsonb);

  -- todas=true só quando o servidor decide (dono); senão: as minhas + as públicas
  elsif p_op = 'anotacoes_listar' then
    return coalesce((select jsonb_agg(to_jsonb(x) order by x.atualizado_em desc) from public.eq_anotacoes x
                      where not x.removido and (coalesce((p_args->>'todas')::boolean, false) or x.membro_id = v_membro or x.publica)), '[]'::jsonb);

  elsif p_op = 'anotacao_salvar' then
    if nullif(p_args->>'id','') is null then
      insert into public.eq_anotacoes (membro_id, cliente_id, texto, publica)
        values (v_membro, nullif(p_args->>'cliente_id','')::uuid, p_args->>'texto', coalesce((p_args->>'publica')::boolean, false))
        returning to_jsonb(eq_anotacoes.*) into r;
    else
      update public.eq_anotacoes set texto = p_args->>'texto', publica = coalesce((p_args->>'publica')::boolean, publica), atualizado_em = now()
       where id = (p_args->>'id')::uuid and membro_id = v_membro and not removido returning to_jsonb(eq_anotacoes.*) into r;
    end if;
    return r;

  elsif p_op = 'anotacao_excluir' then
    update public.eq_anotacoes set removido = true where id = (p_args->>'id')::uuid and membro_id = v_membro;
    return jsonb_build_object('ok', found);

  elsif p_op = 'comunicados_listar' then
    return coalesce((select jsonb_agg(to_jsonb(c) || jsonb_build_object('leituras',
              coalesce((select jsonb_agg(jsonb_build_object('membro_id', l.membro_id, 'lido_em', l.lido_em)) from public.eq_comunicado_leituras l where l.comunicado_id = c.id), '[]'::jsonb))
              order by c.criado_em desc)
            from public.eq_comunicados c where c.criado_em > now() - interval '120 days'), '[]'::jsonb);

  elsif p_op = 'comunicado_salvar' then
    insert into public.eq_comunicados (titulo, texto, para, criado_por)
      values (p_args->>'titulo', p_args->>'texto',
              coalesce((select array_agg(x::uuid) from jsonb_array_elements_text(coalesce(p_args->'para','[]'::jsonb)) x), '{}'), v_membro)
      returning to_jsonb(eq_comunicados.*) into r;
    return r;

  elsif p_op = 'comunicado_encerrar' then
    update public.eq_comunicados set ativo = false where id = (p_args->>'id')::uuid;
    return jsonb_build_object('ok', found);

  elsif p_op = 'comunicado_ler' then
    insert into public.eq_comunicado_leituras (comunicado_id, membro_id) values ((p_args->>'id')::uuid, v_membro)
      on conflict do nothing;
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'operacao invalida';
end $function$;
