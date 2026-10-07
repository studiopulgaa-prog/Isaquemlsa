-- Painel da Equipe v2: calendário, notas semanais, arquivos (PDF), identidade do cliente,
-- métricas de execução das tarefas e e-mail dos membros.

alter table public.eq_membros add column if not exists email text not null default '';

alter table public.eq_tarefas
  add column if not exists iniciado_em timestamptz,
  add column if not exists erros jsonb not null default '[]'::jsonb;

alter table public.eq_clientes
  add column if not exists paleta text not null default '',
  add column if not exists musica text not null default '',
  add column if not exists tipografia_feed text not null default '',
  add column if not exists tipografia_story text not null default '',
  add column if not exists tipografia_muda text not null default '',
  add column if not exists observacoes text not null default '';

create table if not exists public.eq_eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  tipo text not null default 'reuniao',
  data date not null,
  hora text not null default '',
  descricao text not null default '',
  cliente_id uuid,
  participantes uuid[] not null default '{}',
  criado_por uuid,
  concluido boolean not null default false,
  concluido_em timestamptz,
  criado_em timestamptz not null default now(),
  removido boolean not null default false
);

create table if not exists public.eq_notas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null,
  membro_id uuid,
  tipo text not null default 'observacao',
  texto text not null,
  criado_em timestamptz not null default now(),
  removido boolean not null default false
);

create table if not exists public.eq_arquivos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null,
  tipo text not null default 'onboarding',
  nome text not null default '',
  mime text not null default 'application/pdf',
  tamanho integer not null default 0,
  dados bytea not null default ''::bytea,
  completo boolean not null default false,
  enviado_por uuid,
  criado_em timestamptz not null default now(),
  removido boolean not null default false
);

-- Mesmo modelo das outras tabelas: RLS ligado e nenhuma policy; só eq_rpc (security definer) acessa.
alter table public.eq_eventos enable row level security;
alter table public.eq_notas enable row level security;
alter table public.eq_arquivos enable row level security;
revoke all on public.eq_eventos, public.eq_notas, public.eq_arquivos from anon, authenticated;

-- Quem já gerencia tarefas passa a gerenciar o calendário também.
update public.eq_membros set permissoes = array_append(permissoes, 'gerenciar_calendario')
 where 'gerenciar_tarefas' = any(permissoes) and not ('gerenciar_calendario' = any(permissoes));

insert into public.eq_conteudo (chave, valor) values ('planos', '[
  {"titulo":"P1","texto":"Descreva aqui o que o plano P1 inclui (quantidade de posts, stories, vídeos, reuniões…)."},
  {"titulo":"P2","texto":"Descreva aqui o que o plano P2 inclui."},
  {"titulo":"P3","texto":"Descreva aqui o que o plano P3 inclui."}
]'::jsonb) on conflict (chave) do nothing;

CREATE OR REPLACE FUNCTION public.eq_rpc(p_secret text, p_op text, p_args jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare
  r jsonb; t text; cols text; m public.eq_membros%rowtype; v_row jsonb; v_id uuid; v_off int; v_len int;
  tabelas constant text[] := array['eq_membros','eq_clientes','eq_tarefas','eq_publicacoes','eq_eventos','eq_notas','eq_arquivos'];
begin
  if p_secret is null or p_secret is distinct from (select v from public.eq_config where k = 'secret') then
    raise exception 'nao autorizado';
  end if;

  if p_op = 'login' then
    select * into m from public.eq_membros where lower(usuario) = lower(p_args->>'usuario') and ativo;
    if m.id is null or m.senha_hash is null or m.senha_hash <> crypt(coalesce(p_args->>'senha',''), m.senha_hash) then
      return null;
    end if;
    return to_jsonb(m) - 'senha_hash';

  elsif p_op = 'membro' then
    return (select to_jsonb(x) - 'senha_hash' from public.eq_membros x where x.id = (p_args->>'id')::uuid and x.ativo);

  elsif p_op = 'dump' then
    return jsonb_build_object(
      'membros', coalesce((select jsonb_agg(to_jsonb(x) - 'senha_hash' order by x.ordem, x.nome) from public.eq_membros x where x.ativo), '[]'::jsonb),
      'clientes', coalesce((select jsonb_agg(to_jsonb(x) order by x.ordem, x.nome) from public.eq_clientes x where not x.removido), '[]'::jsonb),
      'conteudo', coalesce((select jsonb_object_agg(chave, valor) from public.eq_conteudo), '{}'::jsonb),
      'tarefas', coalesce((select jsonb_agg(to_jsonb(x) order by x.prazo nulls last, x.criado_em) from public.eq_tarefas x
                  where not x.removido and (x.status <> 'feito' or x.concluido_em > now() - interval '90 days')), '[]'::jsonb),
      'publicacoes', coalesce((select jsonb_agg(to_jsonb(x) order by x.data, x.hora) from public.eq_publicacoes x
                  where not x.removido and x.data >= current_date - 60), '[]'::jsonb),
      'eventos', coalesce((select jsonb_agg(to_jsonb(x) order by x.data, x.hora) from public.eq_eventos x
                  where not x.removido and x.data >= current_date - 90), '[]'::jsonb),
      'notas', coalesce((select jsonb_agg(to_jsonb(x) order by x.criado_em desc) from public.eq_notas x
                  where not x.removido and x.criado_em > now() - interval '180 days'), '[]'::jsonb),
      'arquivos', coalesce((select jsonb_agg(to_jsonb(x) - 'dados' order by x.criado_em desc) from public.eq_arquivos x
                  where not x.removido and x.completo), '[]'::jsonb),
      'seeded', (select v from public.eq_config where k = 'seeded'));

  elsif p_op = 'get' then
    t := p_args->>'tabela';
    if not (t = any(tabelas)) then raise exception 'tabela invalida'; end if;
    execute format('select to_jsonb(x) - ''senha_hash'' - ''dados'' from public.%I x where x.id = $1', t) into r using (p_args->>'id')::uuid;
    return r;

  elsif p_op = 'upsert' then
    t := p_args->>'tabela';
    v_row := p_args->'row';
    if not (t = any(tabelas)) or t = 'eq_arquivos' then raise exception 'tabela invalida'; end if;
    select string_agg(format('%I', c.column_name), ',' order by c.ordinal_position) into cols
      from information_schema.columns c
     where c.table_schema = 'public' and c.table_name = t
       and c.column_name not in ('id','senha_hash','removido','dados') and v_row ? c.column_name;
    v_id := nullif(v_row->>'id','')::uuid;
    if v_id is not null and cols is not null then
      execute format('update public.%I x set (%s) = (select %s from jsonb_populate_record(null::public.%I, $1)) where x.id = $2 returning to_jsonb(x.*)',
                     t, cols, cols, t) into r using v_row, v_id;
    elsif v_id is null then
      execute format('insert into public.%I (%s) select %s from jsonb_populate_record(null::public.%I, $1) returning to_jsonb(%I.*)',
                     t, cols, cols, t, t) into r using v_row;
    end if;
    return r - 'senha_hash';

  elsif p_op = 'remover' then
    t := p_args->>'tabela';
    v_id := (p_args->>'id')::uuid;
    if t = 'eq_membros' then
      update public.eq_membros set ativo = false, usuario = usuario || '~' || left(id::text, 8) where id = v_id and not dono;
    elsif t = 'eq_clientes' then
      update public.eq_clientes set removido = true, slug = slug || '~' || left(id::text, 8) where id = v_id;
    elsif t = 'eq_arquivos' then
      update public.eq_arquivos set removido = true, dados = ''::bytea where id = v_id;
    elsif t in ('eq_tarefas','eq_publicacoes','eq_eventos','eq_notas') then
      execute format('update public.%I set removido = true where id = $1', t) using v_id;
    else
      raise exception 'tabela invalida';
    end if;
    return jsonb_build_object('ok', true);

  elsif p_op = 'arquivo_novo' then
    insert into public.eq_arquivos (cliente_id, tipo, nome, mime, enviado_por, dados)
      values ((p_args->>'cliente_id')::uuid, coalesce(p_args->>'tipo','onboarding'), coalesce(p_args->>'nome',''),
              coalesce(p_args->>'mime','application/pdf'), nullif(p_args->>'enviado_por','')::uuid,
              decode(coalesce(p_args->>'parte',''), 'base64'))
      returning id into v_id;
    return jsonb_build_object('id', v_id);

  elsif p_op = 'arquivo_parte' then
    update public.eq_arquivos set dados = dados || decode(p_args->>'parte', 'base64')
     where id = (p_args->>'id')::uuid and not completo and not removido;
    return jsonb_build_object('ok', found);

  elsif p_op = 'arquivo_fim' then
    update public.eq_arquivos set completo = true, tamanho = octet_length(dados)
     where id = (p_args->>'id')::uuid and not removido returning to_jsonb(eq_arquivos.*) - 'dados' into r;
    return r;

  elsif p_op = 'arquivo_ler' then
    v_off := greatest(coalesce((p_args->>'offset')::int, 0), 0);
    v_len := least(greatest(coalesce((p_args->>'length')::int, 2097152), 1), 2097152);
    return (select jsonb_build_object('parte', encode(substring(x.dados from v_off + 1 for v_len), 'base64'),
                                      'total', octet_length(x.dados), 'mime', x.mime, 'nome', x.nome)
              from public.eq_arquivos x where x.id = (p_args->>'id')::uuid and x.completo and not x.removido);

  elsif p_op = 'conteudo_set' then
    insert into public.eq_conteudo(chave, valor, atualizado_em) values (p_args->>'chave', p_args->'valor', now())
      on conflict (chave) do update set valor = excluded.valor, atualizado_em = now();
    return jsonb_build_object('ok', true);

  elsif p_op = 'senha' then
    update public.eq_membros set senha_hash = crypt(p_args->>'senha', gen_salt('bf')) where id = (p_args->>'id')::uuid;
    return jsonb_build_object('ok', true);

  elsif p_op = 'seed' then
    if exists (select 1 from public.eq_config where k = 'seeded') then return jsonb_build_object('ok', false); end if;
    insert into public.eq_clientes (slug, nome, nicho, servico, status, plano, saude, resumo, rede, instagram, aprovacao, aparecem, desde,
                                    sobre, objetivo, posicionamento, ideias, atencao, como_agir, ordem)
      select slug, nome, nicho, servico, status, plano, saude, resumo, rede, instagram, aprovacao, aparecem, desde,
             sobre, objetivo, posicionamento, ideias, atencao, como_agir, ordem
        from jsonb_populate_recordset(null::public.eq_clientes, p_args->'clientes')
      on conflict (slug) do nothing;
    insert into public.eq_conteudo (chave, valor)
      select key, value from jsonb_each(p_args->'conteudo')
      on conflict (chave) do nothing;
    insert into public.eq_config(k, v) values ('seeded', now()::text);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'operacao invalida';
end $function$;
