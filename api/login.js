const { rpc } = require('./_db');
const { makeToken, setCookie, send, TTL } = require('./_auth');
const { pode } = require('./_perm');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { ok: false });
  try {
    const b = req.body || {};
    const usuario = String(b.usuario || '').trim().slice(0, 60);
    const senha = String(b.senha || '').slice(0, 200);
    const me = usuario && senha ? await rpc('login', { usuario, senha }) : null;
    if (!me) {
      await new Promise(r => setTimeout(r, 900));
      return send(res, 401, { ok: false, erro: 'Usuário ou senha incorretos.' });
    }
    if (b.area === 'admin' && !pode(me, 'acesso_gestao')) {
      return send(res, 403, { ok: false, erro: 'Seu login não tem acesso ao painel de gestão.' });
    }
    setCookie(res, makeToken(me.id), TTL);
    send(res, 200, { ok: true });
  } catch (e) {
    send(res, 500, { ok: false, erro: 'Erro no servidor. Tente de novo.' });
  }
};
