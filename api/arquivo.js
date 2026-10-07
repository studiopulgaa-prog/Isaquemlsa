const { rpc } = require('./_db');
const { getUser, send } = require('./_auth');

const uuid = v => (/^[0-9a-f-]{36}$/.test(String(v || '')) ? v : null);

// Entrega o PDF em partes (base64) só para quem está logado; o navegador desenha as páginas sem oferecer download
module.exports = async (req, res) => {
  try {
    const me = await getUser(req);
    if (!me) return send(res, 401, { ok: false, erro: 'Sessão expirada. Entre de novo.' });
    const q = req.query || {};
    const id = uuid(q.id);
    if (!id) return send(res, 400, { ok: false });
    const r = await rpc('arquivo_ler', { id, offset: Math.max(0, parseInt(q.offset, 10) || 0), length: 2097152 });
    if (!r) return send(res, 404, { ok: false, erro: 'Arquivo não encontrado.' });
    send(res, 200, { ok: true, parte: r.parte, total: r.total, nome: r.nome });
  } catch (e) {
    send(res, 500, { ok: false, erro: 'Erro ao abrir o arquivo.' });
  }
};
