-- Registro de acessos (só o dono vê), solicitações de atendimento, links nos clientes,
-- tutorial de primeiro acesso e consulta rápida de novidades (caixa de entrada).

alter table public.eq_membros add column if not exists tutorial_versao integer not null default 0;

alter table public.eq_avisos
  add column if not exists prazo_em timestamptz,
  add column if not exists atendido_em timestamptz,
  add column if not exists resposta text not null default '';

alter table public.eq_clientes add column if not exists links jsonb not null default '[]'::jsonb;

create table if not exists public.eq_acessos (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null,
  sessao text not null unique,
  area text not null default 'equipe',
  dispositivo text not null default '',
  inicio timestamptz not null default now(),
  ultimo timestamptz not null default now()
);
create index if not exists eq_acessos_membro on public.eq_acessos (membro_id, inicio desc);
alter table public.eq_acessos enable row level security;
revoke all on public.eq_acessos from anon, authenticated;

-- Operações novas ficam numa função separada (mesmo segredo do eq_rpc)
create or replace function public.eq_rpc_extra(p_secret text, p_op text, p_args jsonb default '{}'::jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_membro uuid := nullif(p_args->>'membro_id','')::uuid;
begin
  if p_secret is null or p_secret is distinct from (select v from public.eq_config where k = 'secret') then
    raise exception 'nao autorizado';
  end if;

  if p_op = 'acesso_ping' then
    insert into public.eq_acessos (membro_id, sessao, area, dispositivo)
      values (v_membro, p_args->>'sessao', coalesce(p_args->>'area','equipe'), left(coalesce(p_args->>'dispositivo',''), 120))
      on conflict (sessao) do update set ultimo = now()
      where eq_acessos.membro_id = excluded.membro_id;
    -- devolve o que a caixa de entrada precisa saber, sem baixar tudo de novo
    return (select jsonb_build_object('nao_lidos', count(*) filter (where lido_em is null), 'ultimo', max(criado_em))
              from public.eq_avisos where membro_id = v_membro and not removido);

  elsif p_op = 'acessos_listar' then
    return coalesce((select jsonb_agg(to_jsonb(x) order by x.inicio desc) from public.eq_acessos x
                      where x.inicio > now() - make_interval(days => least(greatest(coalesce((p_args->>'dias')::int, 30), 1), 90))), '[]'::jsonb);
  end if;

  raise exception 'operacao invalida';
end $function$;
