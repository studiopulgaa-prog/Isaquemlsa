const { rpc } = require('./_db');
const { getUser, send } = require('./_auth');

// Chamado a cada ~20s enquanto o painel está aberto e visível:
// registra o tempo de uso (aba oculta do dono) e diz se chegou algo novo na caixa de entrada.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { ok: false });
  try {
    const me = await getUser(req);
    if (!me) return send(res, 401, { ok: false });
    const b = req.body || {};
    const sessao = String(b.sessao || '');
    if (!/^[a-z0-9-]{8,64}$/i.test(sessao)) return send(res, 400, { ok: false });
    const ua = String(req.headers['user-agent'] || '');
    const dispositivo = /iphone|ipad/i.test(ua) ? 'iPhone/iPad' : /android/i.test(ua) ? 'Android' : /mac os/i.test(ua) ? 'Mac' : /windows/i.test(ua) ? 'Windows' : 'Outro';
    const r = await rpc('acesso_ping', {
      membro_id: me.id, sessao, dispositivo: dispositivo + (b.app ? ' (app)' : ''),
      area: b.area === 'admin' ? 'admin' : 'equipe'
    });
    send(res, 200, { ok: true, nao_lidos: (r && r.nao_lidos) || 0, ultimo: (r && r.ultimo) || null });
  } catch (e) {
    send(res, 500, { ok: false });
  }
};
