const { rpc } = require('./_db');
const { getUser, send } = require('./_auth');
const { PERMISSOES, pode } = require('./_perm');
const seed = require('./_seed');

function semRestrito(conteudo) {
  const out = {};
  for (const [k, v] of Object.entries(conteudo)) out[k] = Array.isArray(v) ? v.filter(i => !(i && i.restrito)) : v;
  return out;
}

module.exports = async (req, res) => {
  try {
    const me = await getUser(req);
    if (!me) return send(res, 401, { ok: false });
    const area = (req.query && req.query.area) === 'admin' ? 'admin' : 'equipe';
    if (area === 'admin' && !pode(me, 'acesso_gestao')) return send(res, 403, { ok: false, erro: 'Sem acesso ao painel de gestão.' });

    let d = await rpc('dump');
    if (!d.seeded) { await rpc('seed', seed); d = await rpc('dump'); }

    const conteudo = pode(me, 'ver_restrito') ? d.conteudo : semRestrito(d.conteudo);
    const verTodas = pode(me, 'ver_tarefas_equipe') || pode(me, 'gerenciar_tarefas');
    const tarefas = verTodas ? d.tarefas : d.tarefas.filter(t => t.membro_id === me.id);
    // Eventos sem participantes valem para a equipe toda
    const eventos = (d.eventos || []).filter(e => verTodas || pode(me, 'gerenciar_calendario') || !(e.participantes || []).length || e.participantes.includes(me.id));
    const membros = pode(me, 'gerenciar_equipe') && area === 'admin'
      ? d.membros
      : d.membros.map(m => ({ id: m.id, nome: m.nome, funcao: m.funcao, ordem: m.ordem }));

    const perms = PERMISSOES.map(p => p.k).filter(k => pode(me, k));
    send(res, 200, {
      ok: true, area,
      me: { id: me.id, nome: me.nome, funcao: me.funcao, usuario: me.usuario, email: me.email || '', dono: me.dono, perms },
      permissoes: area === 'admin' ? PERMISSOES : [],
      clientes: d.clientes, conteudo, tarefas, publicacoes: d.publicacoes, membros,
      eventos, notas: d.notas || [], arquivos: d.arquivos || []
    });
  } catch (e) {
    send(res, 500, { ok: false, erro: 'Erro ao carregar. Tente de novo.' });
  }
};
