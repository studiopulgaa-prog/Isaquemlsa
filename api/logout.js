const { setCookie, send } = require('./_auth');

module.exports = (req, res) => {
  setCookie(res, '', 0);
  send(res, 200, { ok: true });
};
