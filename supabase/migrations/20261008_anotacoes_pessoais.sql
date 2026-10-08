-- Anotações pessoais sobre clientes: cada pessoa vê só as próprias; o dono vê todas.
create table if not exists public.eq_anotacoes (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null,
  cliente_id uuid not null,
  texto text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  removido boolean not null default false
);
create index if not exists eq_anotacoes_membro on public.eq_anotacoes (membro_id, cliente_id);
alter table public.eq_anotacoes enable row level security;
revoke all on public.eq_anotacoes from anon, authenticated;

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
              from public.eq_avisos where membro_id = v_membro and not removido);

  elsif p_op = 'acessos_listar' then
    return coalesce((select jsonb_agg(to_jsonb(x) order by x.inicio desc) from public.eq_acessos x
                      where x.inicio > now() - make_interval(days => least(greatest(coalesce((p_args->>'dias')::int, 30), 1), 90))), '[]'::jsonb);

  -- membro_id nulo = todas (só o servidor decide isso, e só para o dono)
  elsif p_op = 'anotacoes_listar' then
    return coalesce((select jsonb_agg(to_jsonb(x) order by x.atualizado_em desc) from public.eq_anotacoes x
                      where not x.removido and (v_membro is null or x.membro_id = v_membro)), '[]'::jsonb);

  elsif p_op = 'anotacao_salvar' then
    if nullif(p_args->>'id','') is null then
      insert into public.eq_anotacoes (membro_id, cliente_id, texto)
        values (v_membro, (p_args->>'cliente_id')::uuid, p_args->>'texto') returning to_jsonb(eq_anotacoes.*) into r;
    else
      update public.eq_anotacoes set texto = p_args->>'texto', atualizado_em = now()
       where id = (p_args->>'id')::uuid and membro_id = v_membro and not removido returning to_jsonb(eq_anotacoes.*) into r;
    end if;
    return r;

  elsif p_op = 'anotacao_excluir' then
    update public.eq_anotacoes set removido = true where id = (p_args->>'id')::uuid and membro_id = v_membro;
    return jsonb_build_object('ok', found);
  end if;

  raise exception 'operacao invalida';
end $function$;
