const crypto = require('crypto');
const { rpc } = require('./_db');

const COOKIE = 'sp_eq2';
const TTL = 60 * 60 * 12; // 12h

const sign = s => crypto.createHmac('sha256', process.env.EQUIPE_SECRET || 'dev').update(s).digest('base64url');

function makeToken(id) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const base = id + '.' + exp;
  return base + '.' + sign(base);
}

function safeEq(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function readCookie(req) {
  const m = (req.headers.cookie || '').split(/;\s*/).find(p => p.startsWith(COOKIE + '='));
  return m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : '';
}

// Retorna o membro logado (sempre lido do banco, para refletir permissões e desligamentos na hora)
async function getUser(req) {
  const [id, exp, sig] = readCookie(req).split('.');
  if (!id || !exp || !sig) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  if (!safeEq(sig, sign(id + '.' + exp))) return null;
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return await rpc('membro', { id });
}

function setCookie(res, value, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
}

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

module.exports = { makeToken, getUser, setCookie, send, TTL };
