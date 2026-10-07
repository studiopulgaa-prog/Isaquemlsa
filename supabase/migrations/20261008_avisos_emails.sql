-- Caixa de entrada no site (avisos e recados), contatos de e-mail, fila de e-mails
-- (preparada para quando um serviço de envio for ligado) e funções fixas da equipe.

alter table public.eq_tarefas
  add column if not exists notificar boolean not null default false,
  add column if not exists emails text[] not null default '{}';

create table if not exists public.eq_avisos (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null,            -- quem recebe
  de_id uuid,                         -- quem enviou (null = sistema)
  tipo text not null default 'recado', -- recado | nova_tarefa | concluida
  titulo text not null default '',
  texto text not null default '',
  urgente boolean not null default false,
  tarefa_id uuid,
  lido_em timestamptz,
  criado_em timestamptz not null default now(),
  removido boolean not null default false
);
create index if not exists eq_avisos_membro on public.eq_avisos (membro_id, criado_em desc);

create table if not exists public.eq_contatos (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text not null default '',
  criado_por uuid,
  criado_em timestamptz not null default now(),
  removido boolean not null default false
);

-- Cada e-mail a enviar entra aqui; "chave" evita mandar o mesmo aviso duas vezes.
create table if not exists public.eq_emails_fila (
  id uuid primary key default gen_random_uuid(),
  chave text unique,
  para text not null,
  assunto text not null,
  corpo text not null,
  tipo text not null,
  tarefa_id uuid,
  status text not null default 'pendente', -- pendente | enviado | erro
  tentativas integer not null default 0,
  erro text,
  criado_em timestamptz not null default now(),
  enviado_em timestamptz
);

alter table public.eq_avisos enable row level security;
alter table public.eq_contatos enable row level security;
alter table public.eq_emails_fila enable row level security;
revoke all on public.eq_avisos, public.eq_contatos, public.eq_emails_fila from anon, authenticated;

-- Funções da equipe: só Social media, Video maker e Design
update public.eq_membros set funcao = 'Social media' where usuario = 'victoria';
update public.eq_membros set funcao = '' where funcao not in ('Social media', 'Video maker', 'Design');

-- Avisos de prazo por e-mail (perto de vencer e atrasada), uma vez por tarefa.
-- Fica pronto para ser agendado (pg_cron ou cron da Vercel) quando o envio for ligado.
create or replace function public.eq_enfileirar_avisos_prazo()
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare n integer := 0; t record; e text; tipo text;
begin
  for t in select x.*, m.nome as resp from public.eq_tarefas x left join public.eq_membros m on m.id = x.membro_id
           where not x.removido and x.notificar and x.status <> 'feito' and x.prazo is not null and x.prazo <= current_date + 2 loop
    tipo := case when t.prazo < current_date then 'atrasada' else 'perto' end;
    foreach e in array t.emails loop
      insert into public.eq_emails_fila (chave, para, assunto, corpo, tipo, tarefa_id)
      values (tipo || ':' || t.id || ':' || lower(e), lower(e),
              case when tipo = 'atrasada' then 'Tarefa atrasada: ' else 'Prazo chegando: ' end || t.titulo,
              'A tarefa "' || t.titulo || '" (' || coalesce(t.resp, '') || ') ' ||
              case when tipo = 'atrasada' then 'passou do prazo em ' else 'vence em ' end || to_char(t.prazo, 'DD/MM') || '.',
              tipo, t.id)
      on conflict (chave) do nothing;
      if found then n := n + 1; end if;
    end loop;
  end loop;
  return n;
end $function$;
revoke all on function public.eq_enfileirar_avisos_prazo() from anon, authenticated, public;

CREATE OR REPLACE FUNCTION public.eq_rpc(p_secret text, p_op text, p_args jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare
  r jsonb; t text; cols text; m public.eq_membros%rowtype; v_row jsonb; v_id uuid; v_off int; v_len int;
  tabelas constant text[] := array['eq_membros','eq_clientes','eq_tarefas','eq_publicacoes','eq_eventos','eq_notas','eq_arquivos','eq_avisos','eq_contatos'];
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
      'avisos', coalesce((select jsonb_agg(to_jsonb(x) order by x.criado_em desc) from public.eq_avisos x
                  where not x.removido and (x.lido_em is null or x.criado_em > now() - interval '45 days')), '[]'::jsonb),
      'contatos', coalesce((select jsonb_agg(to_jsonb(x) order by x.email) from public.eq_contatos x where not x.removido), '[]'::jsonb),
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
    elsif t = 'eq_contatos' then
      delete from public.eq_contatos where id = v_id;
    elsif t in ('eq_tarefas','eq_publicacoes','eq_eventos','eq_notas','eq_avisos') then
      execute format('update public.%I set removido = true where id = $1', t) using v_id;
    else
      raise exception 'tabela invalida';
    end if;
    return jsonb_build_object('ok', true);

  elsif p_op = 'avisos_lidos' then
    update public.eq_avisos set lido_em = now()
     where membro_id = (p_args->>'membro_id')::uuid and lido_em is null
       and (p_args->>'id' is null or id = (p_args->>'id')::uuid);
    return jsonb_build_object('ok', true);

  elsif p_op = 'contato_add' then
    insert into public.eq_contatos (email, nome, criado_por)
      values (lower(p_args->>'email'), coalesce(p_args->>'nome',''), nullif(p_args->>'criado_por','')::uuid)
      on conflict (email) do update set removido = false, nome = case when excluded.nome <> '' then excluded.nome else eq_contatos.nome end
      returning to_jsonb(eq_contatos.*) into r;
    return r;

  elsif p_op = 'email_enfileirar' then
    insert into public.eq_emails_fila (chave, para, assunto, corpo, tipo, tarefa_id)
      values (nullif(p_args->>'chave',''), lower(p_args->>'para'), p_args->>'assunto', p_args->>'corpo', p_args->>'tipo', nullif(p_args->>'tarefa_id','')::uuid)
      on conflict (chave) do nothing;
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
