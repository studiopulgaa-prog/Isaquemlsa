// Acesso ao banco (Supabase) — só pelo servidor, com segredo que nunca vai ao navegador
// Operações que moram na função eq_rpc_extra
const EXTRA = new Set(['acesso_ping', 'acessos_listar', 'anotacoes_listar', 'anotacao_salvar', 'anotacao_excluir', 'comunicados_listar', 'comunicado_salvar', 'comunicado_encerrar', 'comunicado_ler']);

async function rpc(op, args = {}) {
  if (global.__EQ_MOCK__) return global.__EQ_MOCK__(op, args);
  const fn = EXTRA.has(op) ? 'eq_rpc_extra' : 'eq_rpc';
  const url = process.env.SUPABASE_URL + '/rest/v1/rpc/' + fn;
  const key = process.env.SUPABASE_ANON;
  const r = await fetch(url, {
    method: 'POST',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_secret: process.env.EQ_DB_SECRET, p_op: op, p_args: args })
  });
  const t = await r.text();
  if (!r.ok) throw new Error('db ' + r.status + ' ' + t.slice(0, 200));
  return t ? JSON.parse(t) : null;
}
module.exports = { rpc };
