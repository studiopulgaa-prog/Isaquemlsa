/* Studio Pulga — Painel da Equipe + Painel de Gestão */
(() => {
  const AREA = window.AREA === 'admin' ? 'admin' : 'equipe';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    task: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    month: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    clients: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    flow: '<rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><path d="M6.5 9v3.5a2 2 0 0 0 2 2H17.5V15"/>',
    process: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    plan: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    team: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16 7l3 3M19 4l2 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    up: '<path d="M18 15l-6-6-6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    note: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    collapse: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M16 15l-3-3 3-3"/>',
    expand: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M14 9l3 3-3 3"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    board: '<rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="11" rx="1.5"/>'
  };
  const ic = (n, s) => `<svg viewBox="0 0 24 24"${s ? ` width="${s}" height="${s}"` : ''} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  let D = null; // dados vindos de /api/dados
  const S = { semanaT: 0, semanaP: 0, mes: 0, diaSel: null, area: '', pessoa: '', modo: 'semana', periodo: 30 };
  try { const m = localStorage.getItem('sp_modo_tarefas'); if (m === 'quadro' || m === 'semana') S.modo = m; } catch {}

  const can = p => !!D && D.me.perms.includes(p);
  // Quem é da gestão edita em qualquer lugar (site, /admin ou app no celular), conforme as permissões
  const gestao = () => can('acesso_gestao');
  const edita = p => gestao() && can(p);
  const verTodas = () => can('ver_tarefas_equipe') || can('gerenciar_tarefas');

  /* ---------------- datas ---------------- */
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hoje = () => ymd(new Date());
  const parseYmd = s => { const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
  const diasAte = s => Math.round((parseYmd(s) - parseYmd(hoje())) / 864e5);
  const dataBr = s => (s ? s.slice(8, 10) + '/' + s.slice(5, 7) : '');
  const dataHoraBr = iso => { if (!iso) return ''; const d = new Date(iso); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const segunda = (offset = 0) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7); return d; };
  const somaDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const duracao = ms => {
    if (!(ms > 0)) return '—';
    const h = ms / 36e5;
    if (h < 1) return Math.max(1, Math.round(ms / 6e4)) + ' min';
    if (h < 48) return (Math.round(h * 10) / 10).toString().replace('.', ',') + ' h';
    return (Math.round(h / 24 * 10) / 10).toString().replace('.', ',') + ' dias';
  };

  /* ---------------- utilidades ---------------- */
  const iniciais = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const membro = id => (D.membros || []).find(m => m.id === id);
  const cliente = id => (D.clientes || []).find(c => c.id === id);
  const nomeMembro = id => (membro(id) || {}).nome || '—';
  const nomeCliente = id => (cliente(id) || {}).nome || '';
  const primeiroNome = n => String(n || '').split(' ')[0];
  const conteudo = k => (D.conteudo && Array.isArray(D.conteudo[k]) ? D.conteudo[k] : []);
  // A equipe tem só três funções; quem não tem função (gestão) não aparece nos filtros
  const FUNCOES = ['Social media', 'Video maker', 'Design'];
  const funcoes = () => FUNCOES;
  const porNome = (a, b) => a.nome.localeCompare(b.nome);

  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  async function api(path, body) {
    const opt = body === undefined
      ? { credentials: 'same-origin', cache: 'no-store' }
      : { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
    let r, j = {};
    try { r = await fetch(path, opt); } catch { return { status: 0, j: { ok: false, erro: 'Sem conexão. Verifique a internet.' } }; }
    try { j = await r.json(); } catch {}
    return { status: r.status, j };
  }

  async function acao(op, extra) {
    const { status, j } = await api('/api/acao', Object.assign({ op }, extra));
    if (status === 401) { mostrarLogin('Sua sessão expirou. Entre de novo.'); throw new Error('sessao'); }
    if (!j.ok) throw new Error(j.erro || 'Não foi possível concluir.');
    return j;
  }

  // Aplica a linha devolvida pelo servidor na hora (sem esperar recarregar tudo)
  function aplicar(colecao, row, remover) {
    if (!D || !row) return;
    const arr = D[colecao] || (D[colecao] = []);
    const i = arr.findIndex(x => x.id === row.id);
    if (remover) { if (i >= 0) arr.splice(i, 1); }
    else if (i >= 0) arr[i] = Object.assign({}, arr[i], row);
    else arr.push(row);
  }

  /* ---------------- caixa de entrada ---------------- */
  const meusAvisos = () => (D.avisos || []).filter(a => a.membro_id === D.me.id);
  const naoLidos = () => meusAvisos().filter(a => !a.lido_em);
  const eventoNovo = e => naoLidos().some(a => a.tipo === 'novo_evento' && a.tarefa_id === e.id) || (e.criado_por === D.me.id && Date.now() - new Date(e.criado_em) < 6 * 36e5);
  const tarefaNova = t => naoLidos().some(a => a.tipo === 'nova_tarefa' && a.tarefa_id === t.id);
  async function marcarLido(filtro) {
    const alvo = naoLidos().filter(filtro);
    if (!alvo.length) return;
    const agora = new Date().toISOString();
    alvo.forEach(a => { a.lido_em = agora; });
    atualizarInbox();
    try { for (const a of alvo) await acao('aviso_lido', { id: a.id }); } catch (e) {}
  }
  function atualizarInbox() {
    const b = $('#inboxBtn');
    if (!b) return;
    const n = naoLidos().length;
    b.innerHTML = ic('inbox') + (n ? `<b class="ibadge">${n > 9 ? '9+' : n}</b>` : '');
    b.classList.toggle('tem', !!n);
    document.title = (n ? `(${n}) ` : '') + document.title.replace(/^\(\d+\) /, '');
    try { if (n && navigator.setAppBadge) navigator.setAppBadge(n); else if (navigator.clearAppBadge) navigator.clearAppBadge(); } catch {}
  }
  const TIPO_AVISO = {
    nova_tarefa: ['Nova tarefa', 'task', 'info'], concluida: ['Concluída', 'check', 'ok'], recado: ['Recado', 'megaphone', 'warn'],
    solicitacao: ['Solicitação', 'hand', 'danger'], atendida: ['Solicitação atendida', 'check', 'ok'], novo_evento: ['Novo no calendário', 'month', 'info']
  };
  function abrirInbox() {
    const lista = meusAvisos().slice(0, 60);
    const ov = modal('Caixa de entrada', lista.length ? `<div class="inbox">${lista.map(a => {
      const t = TIPO_AVISO[a.tipo] || TIPO_AVISO.recado;
      return `<button type="button" class="ib-item${a.lido_em ? '' : ' unread'}${a.urgente ? ' urg' : ''}${a.tipo === 'solicitacao' && !a.atendido_em ? ' pend' : ''}" data-aviso="${a.id}">
        <span class="ib-ic ${t[2]}">${ic(t[1], 16)}</span>
        <span class="ib-b"><span class="ib-t"><b>${esc(a.tipo === 'recado' ? (a.urgente ? 'Recado urgente' : 'Recado') : t[0])}</b> · ${esc(a.de_id ? primeiroNome(nomeMembro(a.de_id)) : 'Sistema')} <small>${dataHoraBr(a.criado_em)}</small></span>
        <span class="ib-s">${esc(['recado', 'solicitacao'].includes(a.tipo) ? a.texto : a.titulo)}</span>${!['recado', 'solicitacao'].includes(a.tipo) && a.texto ? `<span class="ib-x">${esc(a.texto)}</span>` : ''}
        ${a.tipo === 'solicitacao' ? `<span class="ib-x">${a.atendido_em ? '✓ Atendida ' + dataHoraBr(a.atendido_em) : `Pendente${a.prazo_em ? ' · até ' + dataHoraBr(a.prazo_em) : ''}`}</span>` : ''}</span>
        ${a.lido_em ? '' : '<span class="ib-dot"></span>'}</button>`;
    }).join('')}</div>` : '<div class="empty">Nada por aqui ainda. Quando alguém criar uma tarefa para você ou mandar um recado, chega aqui.</div>', null, {
      semFoco: true,
      extra: naoLidos().length ? '<button type="button" class="btn btn-ghost" data-todos>Marcar tudo como lido</button>' : '',
      setup: (form, { fechar }) => {
        form.querySelectorAll('[data-aviso]').forEach(el => el.addEventListener('click', () => {
          const a = meusAvisos().find(x => x.id === el.dataset.aviso);
          marcarLido(x => x.id === a.id || (a.tarefa_id && x.tarefa_id === a.tarefa_id));
          fechar();
          render(true);
          if (a.tipo === 'solicitacao' && !a.atendido_em) atenderSolicitacao(a);
          else if (a.tipo === 'novo_evento') { const e = (D.eventos || []).find(x => x.id === a.tarefa_id); if (e) { S.diaSel = e.data; location.hash = '#/calendario'; setTimeout(() => abrirEvento(e), 60); } else location.hash = '#/calendario'; }
          else if (a.tarefa_id) { const t = D.tarefas.find(x => x.id === a.tarefa_id); if (t) abrirTarefa(t); else toast('Esta tarefa não está mais disponível.'); }
        }));
        const bt = form.querySelector('[data-todos]');
        if (bt) bt.addEventListener('click', () => { marcarLido(() => true); fechar(); render(true); });
      }
    });
    return ov;
  }

  /* ---------------- situação (bolinhas) ---------------- */
  // vermelho = atrasada · amarelo = perto do prazo (até 2 dias) · verde = nova ou no prazo · cinza = feita
  const SIT = { atrasada: ['red', 'Atrasada'], perto: ['yellow', 'Perto do prazo'], ok: ['green', 'No prazo'], feito: ['gray', 'Feita'] };
  function situacao(prazo, feito) {
    if (feito) return 'feito';
    if (!prazo) return 'ok';
    const d = diasAte(prazo);
    return d < 0 ? 'atrasada' : d <= 2 ? 'perto' : 'ok';
  }
  const sitTarefa = t => situacao(t.prazo, t.status === 'feito');
  const sitEvento = e => (e.tipo === 'reuniao' ? (diasAte(e.data) < 0 || e.concluido ? 'feito' : situacao(e.data, false)) : situacao(e.data, e.concluido));
  const dot = (sit, title) => `<span class="dot ${SIT[sit][0]}" title="${esc(title || SIT[sit][1])}"></span>`;
  const quando = prazo => {
    if (!prazo) return 'Sem prazo';
    const d = diasAte(prazo);
    if (d === 0) return 'Hoje';
    if (d === 1) return 'Amanhã';
    if (d === -1) return 'Ontem';
    if (d < 0) return `${-d} dias atrás`;
    if (d < 7) return `Em ${d} dias`;
    return dataBr(prazo);
  };

  /* ---------------- tema ---------------- */
  function temaAtual() {
    const t = document.documentElement.dataset.theme;
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function aplicarTema(t) {
    if (t) document.documentElement.dataset.theme = t;
    $('#themeBtn').innerHTML = ic(temaAtual() === 'dark' ? 'sun' : 'moon');
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = temaAtual() === 'dark' ? '#21170F' : '#FFFDF9';
  }
  try { const t = localStorage.getItem('sp_tema'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch {}
  try { if (localStorage.getItem('sp_menu') === 'mini') document.body.classList.add('side-mini'); } catch {}

  /* ---------------- login ---------------- */
  function mostrarLogin(msg) {
    D = null;
    $('#app').classList.add('hidden');
    $('#login').classList.remove('hidden');
    $('#err').innerHTML = msg || '';
    setTimeout(() => $('#usuario').focus(), 50);
  }

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    $('#err').textContent = '';
    const { j } = await api('/api/login', { usuario: $('#usuario').value, senha: $('#senha').value, area: AREA });
    btn.disabled = false;
    if (!j.ok) {
      $('#err').innerHTML = esc(j.erro || 'Não foi possível entrar.') + (AREA === 'admin' && /gestão/.test(j.erro || '') ? '<br><a href="/">Ir para o site da equipe</a>' : '');
      return;
    }
    $('#senha').value = '';
    carregar(true);
  });

  /* ---------------- carga ---------------- */
  async function carregar(aposLogin, tentativa = 0) {
    const { status, j } = await api('/api/dados?area=' + AREA);
    // Logo depois do login o navegador às vezes ainda não gravou o cookie da sessão: tenta de novo antes de desistir
    if ((status === 401 || status === 0) && aposLogin && tentativa < 3) { await new Promise(r => setTimeout(r, 350 * (tentativa + 1))); return carregar(true, tentativa + 1); }
    if (status === 401) return mostrarLogin(aposLogin ? 'Não foi possível abrir o painel. Tente entrar de novo.' : '');
    if (status === 403) return mostrarLogin('Seu login não tem acesso ao painel de gestão.<br><a href="/">Ir para o site da equipe</a>');
    if (!j.ok) return mostrarLogin(esc(j.erro || 'Erro ao carregar. Tente de novo.'));
    D = j;
    protegerConteudo();
    const ult = (D.avisos || []).filter(a => a.membro_id === D.me.id).map(a => a.criado_em).sort().pop();
    ultimoAviso = ult || null;
    $('#login').classList.add('hidden');
    $('#app').classList.remove('hidden');
    montarTopo();
    render();
    // Primeiro acesso: tutorial completo. Depois de uma atualização grande: só "o que mudou".
    const visto = Number(D.me.tutorial_versao) || 0;
    if (visto < 1) setTimeout(iniciarTutorial, 500);
    else if (visto < VERSAO_TUTORIAL) setTimeout(() => mostrarNovidades(visto), 500);
  }

  let recarregando = null;
  async function recarregar() {
    if (recarregando) return recarregando;
    recarregando = (async () => {
      const { status, j } = await api('/api/dados?area=' + AREA);
      if (status === 401) return mostrarLogin('Sua sessão expirou. Entre de novo.');
      if (j.ok) {
        const antes = D ? naoLidos().map(a => a.id) : [];
        D = j; atualizarInbox();
        const novos = naoLidos().filter(a => !antes.includes(a.id));
        if (novos.length) {
          tocarAviso();
          const a = novos[0];
          toast(novos.length > 1 ? `${novos.length} novidades na sua caixa de entrada` : a.tipo === 'recado' ? `Novo recado de ${primeiroNome(nomeMembro(a.de_id))}` : a.tipo === 'solicitacao' ? `Nova solicitação de ${primeiroNome(nomeMembro(a.de_id))}` : `Novidade: ${a.titulo}`);
        }
        if (!document.querySelector('.overlay')) render(true);
      }
    })();
    try { await recarregando; } finally { recarregando = null; }
  }
  // Mantém os dados frescos quando a pessoa volta para a aba
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && D) recarregar(); });
  // A cada 20s (com o painel visível): registra o tempo de uso e vê se chegou algo na caixa de entrada.
  // Só baixa tudo de novo quando há novidade — por isso o aviso chega em até ~20s sem pesar.
  const novaSessao = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  let sessao = novaSessao(), ultimoVisto = Date.now(), ultimoAviso = null;
  async function ping() {
    if (!D || document.visibilityState !== 'visible') return;
    if (Date.now() - ultimoVisto > 5 * 60e3) sessao = novaSessao(); // voltou depois de 5 min: conta como novo acesso
    ultimoVisto = Date.now();
    const app = matchMedia('(display-mode: standalone)').matches || !!navigator.standalone;
    const { status, j } = await api('/api/ping', { sessao, area: AREA, app });
    if (status === 401) return mostrarLogin('Sua sessão expirou. Entre de novo.');
    if (!j.ok) return;
    if (j.nao_lidos !== naoLidos().length || (j.ultimo && ultimoAviso && j.ultimo > ultimoAviso)) recarregar();
    if (j.ultimo) ultimoAviso = j.ultimo;
  }
  setInterval(ping, 20000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ping(); });

  // Som curtinho de notificação (o navegador só libera som depois do primeiro toque na tela)
  let audio = null;
  const AC = window.AudioContext || window.webkitAudioContext;
  const somLigado = () => { try { return localStorage.getItem('sp_som') !== 'off'; } catch { return true; } };
  addEventListener('pointerdown', () => { try { audio = audio || (AC && new AC()); if (audio && audio.state === 'suspended') audio.resume(); } catch {} }, { passive: true });
  function tocarAviso() {
    if (!somLigado() || !audio) return;
    try {
      const t = audio.currentTime;
      [[880, 0], [1318.5, .13]].forEach(([f, d]) => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + d);
        g.gain.exponentialRampToValueAtTime(0.22, t + d + .02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d + .38);
        o.connect(g); g.connect(audio.destination); o.start(t + d); o.stop(t + d + .42);
      });
    } catch {}
    if (navigator.vibrate) navigator.vibrate(60);
  }

  /* ---------------- topo e menu ---------------- */
  function montarTopo() {
    $('#menuBtn').innerHTML = ic('menu');
    $('#senhaBtn').innerHTML = ic('user');
    $('#senhaBtn').title = 'Minha conta';
    $('#senhaBtn').setAttribute('aria-label', 'Minha conta');
    $('#logoutBtn').innerHTML = ic('logout');
    aplicarTema();
    if (!$('#inboxBtn')) {
      const ib = document.createElement('button');
      ib.className = 'icon-btn inbox-btn'; ib.id = 'inboxBtn'; ib.title = 'Caixa de entrada'; ib.setAttribute('aria-label', 'Caixa de entrada');
      ib.addEventListener('click', abrirInbox);
      $('#themeBtn').before(ib);
    }
    atualizarInbox();
    $('#av').textContent = iniciais(D.me.nome);
    $('#who').textContent = primeiroNome(D.me.nome);
    $('#switch').innerHTML = AREA === 'admin'
      ? '<a href="/">Ver site da equipe →</a>'
      : (can('acesso_gestao') ? '<a href="/admin">Painel de gestão →</a>' : '');
    if (!document.querySelector('.scrim')) {
      const s = document.createElement('div');
      s.className = 'scrim';
      s.addEventListener('click', () => document.body.classList.remove('nav-open'));
      document.body.appendChild(s);
    }
  }

  function menu() {
    const minhas = D.tarefas.filter(t => t.membro_id === D.me.id && t.status !== 'feito');
    const atrasadas = minhas.filter(t => sitTarefa(t) === 'atrasada').length;
    const itens = [
      ['inicio', 'home', 'Início'],
      ...(gestao() ? [['solicitacoes', 'hand', 'Solicitações de atendimento', solicPend()]] : []),
      ['tarefas', 'task', 'Tarefas', atrasadas],
      ['calendario', 'month', 'Calendário'],
      ['agenda', 'cal', 'Publicações'],
      ['clientes', 'clients', 'Clientes'],
      ['g', 'Conteúdo'],
      ['fluxograma', 'flow', 'Fluxograma'],
      ['processos', 'process', 'Processos'],
      ['planos', 'plan', 'Planos'],
      ['praticas', 'star', 'Boas práticas'],
      ['g', 'Pessoas'],
      ['equipe', 'team', can('gerenciar_equipe') ? 'Equipe e acessos' : 'Equipe']
    ];
    if (can('gerenciar_tarefas')) itens.push(['desempenho', 'chart', 'Desempenho']);
    if (D.me.dono) itens.push(['acessos', 'eye', 'Acessos']);
    const atual = rota()[0];
    let h = itens.map(i => i[0] === 'g'
      ? `<div class="grp">${i[1]}</div>`
      : `<a href="#/${i[0]}" title="${esc(i[2])}" class="${atual === i[0] || (atual === 'cliente' && i[0] === 'clientes') ? 'on' : ''}">${ic(i[1])}<span>${i[2]}</span>${i[3] ? `<b class="badge" title="Pendentes">${i[3]}</b>` : ''}</a>`).join('');
    h += `<button class="side-toggle" data-recolher title="${document.body.classList.contains('side-mini') ? 'Expandir menu' : 'Recolher menu'}">${ic(document.body.classList.contains('side-mini') ? 'expand' : 'collapse')}<span>Recolher menu</span></button>`;
    const sw = $('#switch').innerHTML;
    if (sw) h += `<div class="side-mobile-switch"><div class="grp">Outro painel</div>${sw.replace('<a ', '<a style="padding-left:.75rem" ')}</div>`;
    if (instalar.disponivel()) h += `<div class="install"><button class="btn btn-ghost btn-sm" data-instalar>${ic('phone')}Instalar app no celular</button></div>`;
    $('#side').innerHTML = h;
    $('#side [data-recolher]').addEventListener('click', () => {
      const mini = document.body.classList.toggle('side-mini');
      try { localStorage.setItem('sp_menu', mini ? 'mini' : 'cheio'); } catch {}
      menu(); setTimeout(() => desenharFluxos(document), 220);
    });
    const bi = $('#side [data-instalar]');
    if (bi) bi.addEventListener('click', instalar.abrir);
  }

  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('#side').addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });
  $('#themeBtn').addEventListener('click', () => {
    const t = temaAtual() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('sp_tema', t); } catch {}
    aplicarTema(t);
  });
  $('#logoutBtn').addEventListener('click', async () => { await api('/api/logout', {}); mostrarLogin(); });
  $('#senhaBtn').addEventListener('click', () => {
    modal('Minha conta', `
      <label>E-mail <span class="hint">(para receber avisos de prazos)</span><input type="email" name="email" value="${esc(D.me.email || '')}" placeholder="voce@gmail.com"></label>
      <label class="inline"><input type="checkbox" name="_som"${somLigado() ? ' checked' : ''}> Tocar som quando chegar recado, solicitação ou tarefa</label>
      <button type="button" class="btn btn-ghost btn-sm" data-tutorial style="justify-self:start">${ic('help', 14)}<span>Ver o tutorial de novo</span></button>
      <div class="sep">Trocar senha <span class="hint">(deixe em branco para manter)</span></div>
      <label>Senha atual<input type="password" name="atual" autocomplete="current-password"></label>
      <div class="two">
        <label>Nova senha<input type="password" name="nova" autocomplete="new-password" minlength="6"></label>
        <label>Repita a nova senha<input type="password" name="nova2" autocomplete="new-password"></label>
      </div>`,
    async f => {
      try { localStorage.setItem('sp_som', f._som ? 'on' : 'off'); } catch {}
      if (f._som) tocarAviso();
      if ((f.email || '') !== (D.me.email || '')) { await acao('meu_email', { email: f.email }); D.me.email = f.email; }
      if (f.nova || f.atual) {
        if (f.nova !== f.nova2) throw new Error('As senhas novas não são iguais.');
        await acao('minha_senha', { atual: f.atual, nova: f.nova });
      }
      toast('Conta atualizada.');
    }, { setup: (form, { fechar }) => form.querySelector('[data-tutorial]').addEventListener('click', () => { fechar(); iniciarTutorial(); }) });
  });

  /* ---------------- instalar como app (PWA) ---------------- */
  const instalar = (() => {
    let evento = null;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const instalado = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    addEventListener('beforeinstallprompt', e => { e.preventDefault(); evento = e; if (D) menu(); });
    addEventListener('appinstalled', () => { evento = null; if (D) menu(); toast('App instalado!'); });
    return {
      disponivel: () => !instalado() && (!!evento || ios),
      abrir: async () => {
        if (evento) { evento.prompt(); await evento.userChoice; evento = null; if (D) menu(); return; }
        modal('Instalar no iPhone', `<p>1. Toque em <b>Compartilhar</b> (o quadrado com a seta) na barra do Safari.</p><p>2. Escolha <b>Adicionar à Tela de Início</b>.</p><p class="muted small">O painel abre como um app, em tela cheia.</p>`, null);
      }
    };
  })();
  if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));

  /* ---------------- modal ---------------- */
  function modal(titulo, corpo, onSave, opts = {}) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="modal${opts.wide ? ' wide' : ''}" role="dialog" aria-modal="true"><h2>${esc(titulo)}</h2>
      <form class="form" novalidate>${corpo}<div class="err"></div>
      <div class="foot">${opts.onDelete ? `<button type="button" class="btn btn-danger" data-del>${ic('trash')} ${esc(opts.delLabel || 'Excluir')}</button>` : ''}${opts.extra || ''}
      <div class="r"><button type="button" class="btn btn-ghost" data-close>${onSave ? 'Cancelar' : 'Fechar'}</button>${onSave ? `<button type="submit" class="btn btn-primary">${esc(opts.saveLabel || 'Salvar')}</button>` : ''}</div></div>
      </form></div>`;
    const fechar = () => { ov.remove(); document.removeEventListener('keydown', tecla); if (!document.querySelector('.overlay')) document.documentElement.classList.remove('modal-aberto'); if (opts.onClose) opts.onClose(); };
    const tecla = e => { if (e.key === 'Escape') fechar(); };
    document.addEventListener('keydown', tecla);
    ov.addEventListener('mousedown', e => { if (e.target === ov) fechar(); });
    ov.querySelector('[data-close]').addEventListener('click', fechar);
    const form = ov.querySelector('form');
    const errEl = ov.querySelector('.err');
    const rodar = async fn => {
      errEl.textContent = '';
      form.querySelectorAll('button').forEach(b => (b.disabled = true));
      try { const r = await fn(); fechar(); if (r !== false) { render(true); recarregar(); } }
      catch (e) { if (e.message !== 'sessao') errEl.textContent = e.message; }
      finally { form.querySelectorAll('button').forEach(b => (b.disabled = false)); }
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!onSave) return fechar();
      const inval = form.querySelector(':invalid');
      if (inval) { errEl.textContent = inval.validationMessage ? `${(inval.closest('label') || {}).firstChild?.textContent?.trim() || 'Campo'}: ${inval.validationMessage}` : 'Confira os campos.'; inval.focus(); return; }
      const f = {};
      new FormData(form).forEach((v, k) => { f[k] = v; });
      form.querySelectorAll('input[type=checkbox][name]').forEach(c => { if (!c.dataset.multi) f[c.name] = c.checked; });
      rodar(() => onSave(f, form));
    });
    if (opts.onDelete) ov.querySelector('[data-del]').addEventListener('click', () => {
      if (confirm(opts.confirmDel || 'Tem certeza que quer excluir?')) rodar(opts.onDelete);
    });
    document.body.appendChild(ov);
    document.documentElement.classList.add('modal-aberto');
    if (opts.setup) opts.setup(form, { fechar, rodar });
    const first = form.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=file]),textarea,select');
    if (first && !opts.semFoco) first.focus();
    return form;
  }

  const opcoes = (lista, sel, vazio) => (vazio !== undefined ? `<option value="">${esc(vazio)}</option>` : '') +
    lista.map(([v, t]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('');
  const optMembros = (sel, vazio, area) => opcoes([...D.membros].filter(m => !area || m.funcao === area).sort(porNome).map(m => [m.id, m.nome + (area ? '' : m.funcao ? ' · ' + m.funcao : '')]), sel, vazio);
  const optClientes = (sel, vazio) => opcoes([...D.clientes].sort(porNome).map(c => [c.id, c.nome]), sel, vazio);
  const optAreas = (sel, vazio = 'Todas as funções') => opcoes(funcoes().map(f => [f, f]), sel, vazio);

  // Select de função que filtra o select de pessoas logo abaixo
  function ligarArea(form, selArea, selPessoa) {
    const a = form.querySelector(selArea), p = form.querySelector(selPessoa);
    if (!a || !p) return;
    a.addEventListener('change', () => {
      const atual = p.value;
      const vazio = p.querySelector('option[value=""]');
      p.innerHTML = optMembros(atual, vazio ? vazio.textContent : undefined, a.value);
      if (![...p.options].some(o => o.value === atual)) p.value = p.options[0] ? p.options[0].value : '';
    });
  }

  /* ---------------- rotas ---------------- */
  const rota = () => (location.hash.replace(/^#\/?/, '') || 'inicio').split('/');
  window.addEventListener('hashchange', () => {
    if (!D) return;
    const go = () => { render(); scrollTo(0, 0); };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(go);
    else go();
  });

  let posRender = [];
  function render(manterScroll) {
    if (!D) return;
    const y = scrollY;
    menu();
    const [r, a1, a2] = rota();
    const v = $('#view');
    posRender = [];
    const telas = { inicio, tarefas, calendario, agenda, clientes, cliente: () => fichaCliente(a1, a2), fluxograma, processos, planos, praticas, equipe, desempenho, solicitacoes, acessos };
    v.innerHTML = (telas[r] || inicio)();
    ligar(v);
    posRender.forEach(fn => fn(v));
    if (manterScroll) scrollTo(0, y);
  }

  function ligar(v) {
    v.querySelectorAll('[data-act]').forEach(el => el.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const fn = ACOES[el.dataset.act];
      if (fn) fn(el.dataset.id, el);
    }));
    v.querySelectorAll('[data-set]').forEach(el => el.addEventListener('change', () => {
      S[el.dataset.set] = el.value;
      if (el.dataset.set === 'diasAcesso') acessosCache = null;
      if (el.dataset.set === 'area') S.pessoa = '';
      render(true);
    }));
  }

  const cab = (titulo, sub, acts = '') => `<div class="ph"><div><h1>${esc(titulo)}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
  const btn = (act, label, icon, cls = '', id = '', extra = '') => `<button class="btn ${cls}" data-act="${act}"${id ? ` data-id="${esc(id)}"` : ''}${extra}>${icon ? ic(icon) : ''}${label ? `<span>${esc(label)}</span>` : ''}</button>`;
  const vazio = msg => `<div class="empty">${msg}</div>`;
  const lock = it => (it && it.restrito ? `<span class="tag lock" title="Visível só para quem tem acesso a conteúdo restrito">${ic('lock', 11)}Restrito</span>` : '');

  /* ---------------- tarefas: helpers ---------------- */
  const PRIOR = { alta: ['Alta', 'danger'], media: ['Média', 'warn'], baixa: ['Baixa', 'info'] };
  const STATUS_T = { pendente: 'A fazer', fazendo: 'Fazendo', feito: 'Feito' };
  const PROX = { pendente: ['fazendo', 'Começar'], fazendo: ['feito', 'Concluir'], feito: ['pendente', 'Reabrir'] };
  const podeStatus = t => t.membro_id === D.me.id || edita('gerenciar_tarefas');
  const podeEditarTarefa = t => edita('gerenciar_tarefas') || (t.membro_id === D.me.id && t.criado_por === D.me.id);

  function tarefasFiltradas() {
    let l = D.tarefas;
    if (!verTodas()) return l.filter(t => t.membro_id === D.me.id);
    if (S.pessoa === 'minhas') return l.filter(t => t.membro_id === D.me.id);
    if (S.pessoa) return l.filter(t => t.membro_id === S.pessoa);
    if (S.area) l = l.filter(t => (membro(t.membro_id) || {}).funcao === S.area);
    return l;
  }
  const ordemPrazo = (a, b) => (a.prazo || '9999').localeCompare(b.prazo || '9999') || ({ alta: 0, media: 1, baixa: 2 }[a.prioridade] ?? 1) - ({ alta: 0, media: 1, baixa: 2 }[b.prioridade] ?? 1);

  function chipTarefa(t, mostrarPessoa) {
    const sit = sitTarefa(t);
    return `<div class="tchip ${sit}${t.status === 'fazendo' ? ' doing' : ''}" data-act="tarefaAbrir" data-id="${t.id}" role="button" tabindex="0">
      ${dot(sit)}<div class="tc-body"><div class="tc-t">${tarefaNova(t) ? '<span class="nova">Nova</span>' : ''}${esc(t.titulo)}</div>
      <div class="tc-m">${t.cliente_id && nomeCliente(t.cliente_id) ? esc(nomeCliente(t.cliente_id)) : ''}${mostrarPessoa ? `${t.cliente_id ? ' · ' : ''}${esc(primeiroNome(nomeMembro(t.membro_id)))}` : ''}${t.status === 'fazendo' ? `<span class="tag info">Fazendo</span>` : ''}</div></div>
      ${podeStatus(t) && t.status !== 'feito' ? `<button class="tc-ok" data-act="tarefaStatus" data-id="${t.id}" data-status="feito" title="Marcar como feita">${ic('check', 14)}</button>` : ''}
    </div>`;
  }

  function cartaoTarefa(t) {
    const p = PRIOR[t.prioridade] || PRIOR.media;
    const sit = sitTarefa(t);
    const prox = PROX[t.status] || PROX.pendente;
    return `<div class="task ${sit}" data-act="tarefaAbrir" data-id="${t.id}" role="button" tabindex="0">
      <div class="t">${dot(sit)}<span>${tarefaNova(t) ? '<span class="nova">Nova</span>' : ''}${esc(t.titulo)}</span></div>
      <div class="meta">
        <span class="tag ${p[1]}">${p[0]}</span>
        <span class="tag ${sit === 'atrasada' ? 'danger' : sit === 'perto' ? 'warn' : ''}">${t.prazo ? quando(t.prazo) : 'Sem prazo'}</span>
        ${t.cliente_id && nomeCliente(t.cliente_id) ? `<span class="tag">${esc(nomeCliente(t.cliente_id))}</span>` : ''}
        ${t.membro_id !== D.me.id ? `<span class="tag info">${esc(primeiroNome(nomeMembro(t.membro_id)))}</span>` : ''}
        ${(t.erros || []).length ? `<span class="tag danger" title="Erros registrados">${ic('alert', 11)}${t.erros.length}</span>` : ''}
      </div>
      ${podeStatus(t) ? `<div class="row"><button class="btn btn-sm" data-act="tarefaStatus" data-id="${t.id}" data-status="${prox[0]}">${prox[1]}</button></div>` : ''}
    </div>`;
  }

  // Painel lateral: atrasadas e perto do prazo
  function painelAtencao(lista, titulo = 'Atenção') {
    const abertas = lista.filter(t => t.status !== 'feito');
    const atr = abertas.filter(t => sitTarefa(t) === 'atrasada').sort(ordemPrazo);
    const perto = abertas.filter(t => sitTarefa(t) === 'perto').sort(ordemPrazo);
    const evs = (D.eventos || []).filter(e => e.tipo !== 'reuniao' && ['atrasada', 'perto'].includes(sitEvento(e)) && (!(e.participantes || []).length || e.participantes.includes(D.me.id) || verTodas()));
    const linha = t => `<button class="pl" data-act="tarefaAbrir" data-id="${t.id}">${dot(sitTarefa(t))}<span class="pl-t">${esc(t.titulo)}</span><span class="pl-d">${quando(t.prazo)}</span></button>`;
    const linhaEv = e => `<button class="pl" data-act="eventoAbrir" data-id="${e.id}">${dot(sitEvento(e))}<span class="pl-t">${esc(e.titulo)}</span><span class="pl-d">${quando(e.data)}</span></button>`;
    return `<aside class="panel">
      <h3>${esc(titulo)}</h3>
      <div class="pl-sec"><div class="pl-h red">${ic('alert', 14)}Atrasadas <b>${atr.length}</b></div>${atr.map(linha).join('') || '<div class="pl-vazio">Nada atrasado 👏</div>'}</div>
      <div class="pl-sec"><div class="pl-h yellow">${ic('clock', 14)}Perto do prazo <b>${perto.length}</b></div>${perto.map(linha).join('') || '<div class="pl-vazio">Nada vencendo nos próximos 2 dias</div>'}</div>
      ${evs.length ? `<div class="pl-sec"><div class="pl-h">${ic('month', 14)}Entregas e prazos</div>${evs.map(linhaEv).join('')}</div>` : ''}
      <div class="legend">${dot('atrasada')}Atrasada ${dot('perto')}Até 2 dias ${dot('ok')}No prazo</div>
    </aside>`;
  }

  /* ---------------- INÍCIO ---------------- */
  function inicio() {
    const minhas = D.tarefas.filter(t => t.membro_id === D.me.id);
    const abertas = minhas.filter(t => t.status !== 'feito');
    const h = hoje();
    const pubsHoje = D.publicacoes.filter(p => p.data === h);
    const evHoje = (D.eventos || []).filter(e => e.data === h);
    const hora = new Date().getHours();
    const saud = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
    const rituais = conteudo('rituais'), links = conteudo('links'), rede = conteudo('redeConceito');
    const ed = edita('editar_inicio');
    const seg = segunda(0);
    const semana = [...Array(7)].map((_, i) => somaDias(seg, i));
    const cont = s => abertas.filter(t => sitTarefa(t) === s).length;
    const podeRecado = gestao();
    return `<div class="with-panel"><div>` +
      cab(`${saud}, ${primeiroNome(D.me.nome)}!`, [D.me.funcao, gestao() ? 'Gestão' : ''].filter(Boolean).map(esc).join(' · '),
        (podeRecado ? btn('recadoNovo', 'Enviar recado', 'megaphone', 'btn-ghost') : '') + btn('tarefaNova', 'Nova tarefa', 'plus', 'btn-primary')) +
      blocoRecados() + (podeRecado ? recadosEnviados() : '') +
      `<div class="stats">
        <a class="card stat" href="#/tarefas"><div class="n">${abertas.length}</div><div class="l">tarefas abertas</div></a>
        <a class="card stat" href="#/tarefas"><div class="n red-t">${cont('atrasada')}</div><div class="l">${dot('atrasada')}atrasadas</div></a>
        <a class="card stat" href="#/tarefas"><div class="n yellow-t">${cont('perto')}</div><div class="l">${dot('perto')}perto do prazo</div></a>
        <a class="card stat" href="#/calendario"><div class="n">${evHoje.length + pubsHoje.length}</div><div class="l">compromissos hoje</div></a>
      </div>` +
      `<h2 class="sec">Minha semana <a href="#/tarefas" class="small">abrir tarefas</a></h2>
      <div class="strip">${semana.map(d => {
        const s = ymd(d);
        const ts = minhas.filter(t => t.prazo === s);
        const es = (D.eventos || []).filter(e => e.data === s);
        return `<a class="sday${s === h ? ' today' : ''}" href="#/tarefas"><div class="sd-h">${DIAS[d.getDay()]} <b>${d.getDate()}</b></div>
          <div class="sd-dots">${ts.map(t => dot(sitTarefa(t), t.titulo)).join('')}${es.map(e => `<span class="dot ev ${SIT[sitEvento(e)][0]}" title="${esc(e.titulo)}"></span>`).join('')}</div>
          <div class="sd-n">${ts.length ? ts.length + (ts.length === 1 ? ' tarefa' : ' tarefas') : '—'}</div></a>`;
      }).join('')}</div>` +
      (evHoje.length || pubsHoje.length ? `<h2 class="sec">Hoje</h2><div class="grid">${evHoje.map(cartaoEvento).join('')}${pubsHoje.map(cartaoPub).join('')}</div>` : '') +
      `<h2 class="sec">Atalhos ${ed ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', 'links') : ''}</h2>` +
      (links.length ? `<div class="links">${links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${ic('link')}${esc(l.titulo)}${l.restrito ? ' ' + ic('lock', 12) : ''}</a>`).join('')}</div>` : vazio('Nenhum atalho cadastrado.')) +
      `<h2 class="sec">Rituais da semana ${ed ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', 'rituais') : ''}</h2>` +
      (rituais.length ? `<div class="grid">${rituais.map(r => `<div class="card"><div class="over">${esc(r.quando || '')}</div><div class="ct">${esc(r.titulo)}</div><div class="muted small pre">${esc(r.texto || '')}</div></div>`).join('')}</div>` : vazio('Nenhum ritual cadastrado.')) +
      `<h2 class="sec">Rede Conceito ${ed ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', 'redeConceito') : ''}</h2>` +
      (rede.length ? `<div class="items">${rede.map(itemHtml).join('')}</div>` : vazio('Sem texto cadastrado.')) +
      `</div>${painelAtencao(minhas, 'Minhas pendências')}</div>`;
  }

  // Recados da gestão para mim: ficam no topo até eu marcar como lido
  function blocoRecados() {
    const l = meusAvisos().filter(a => a.tipo === 'recado' && !a.lido_em);
    const sol = minhasSolic();
    if (!l.length && !sol.length) return '';
    return `<div class="recados">${sol.map(a => `<div class="recado sol-card${a.urgente ? ' urg' : ''}" data-act="atenderSolic" data-id="${a.id}" role="button" tabindex="0">
      <div class="rc-ic">${ic('hand', 20)}</div>
      <div class="rc-b"><div class="rc-h"><span class="tag ${a.urgente ? 'danger' : 'warn'}">Solicitação pendente</span><b>${esc(primeiroNome(nomeMembro(a.de_id)))}</b><small>${dataHoraBr(a.criado_em)}${a.prazo_em ? ' · ' + prazoSolic(a) : ''}</small></div>
      <div class="rc-t">${esc(a.texto)}</div></div>
      <button class="btn btn-sm btn-primary" data-act="atenderSolic" data-id="${a.id}">${ic('check', 14)}<span>Atender</span></button></div>`).join('')}${l.map(a => `<div class="recado${a.urgente ? ' urg' : ''}">
      <div class="rc-ic">${ic('megaphone', 20)}</div>
      <div class="rc-b"><div class="rc-h">${a.urgente ? '<span class="tag danger">Urgente</span>' : ''}<b>Recado de ${esc(primeiroNome(nomeMembro(a.de_id)))}</b><small>${dataHoraBr(a.criado_em)}</small></div>
      <div class="rc-t">${esc(a.texto)}</div></div>
      <button class="btn btn-sm" data-act="recadoLido" data-id="${a.id}">${ic('check', 14)}<span>Li</span></button></div>`).join('')}</div>`;
  }
  function recadosEnviados() {
    const l = (D.avisos || []).filter(a => a.tipo === 'recado' && a.de_id === D.me.id).slice(0, 8);
    if (!l.length) return '';
    return `<details class="enviados"><summary>${ic('megaphone', 14)}Recados que enviei <span class="count">${l.length}</span></summary>
      ${l.map(a => `<div class="env"><span class="env-p">${esc(primeiroNome(nomeMembro(a.membro_id)))}</span><span class="env-t">${esc(a.texto)}</span>
        <span class="env-s ${a.lido_em ? 'green-t' : 'muted'}">${a.lido_em ? '✓ lido ' + dataHoraBr(a.lido_em) : 'não lido'}</span>
        <button class="icon-btn sm" data-act="recadoExcluir" data-id="${a.id}" title="Apagar">${ic('trash', 14)}</button></div>`).join('')}</details>`;
  }
  function formRecado() {
    const lista = [...D.membros].filter(m => m.id !== D.me.id).sort(porNome);
    modal('Enviar recado', `
      <div><div class="lbl">Para quem</div>
        <div class="filters tight"><select data-fpart aria-label="Filtrar por função">${optAreas('')}</select>
          <button type="button" class="btn btn-sm btn-ghost" data-todos>Marcar visíveis</button><button type="button" class="btn btn-sm btn-ghost" data-nenhum>Limpar</button></div>
        <div class="people">${lista.map(m => `<label data-funcao="${esc(m.funcao || '')}"><input type="checkbox" name="part" value="${m.id}" data-multi="1"><span class="avatar xs">${esc(iniciais(m.nome))}</span><span>${esc(m.nome)}<small>${esc(m.funcao || 'Gestão')}</small></span></label>`).join('')}</div>
      </div>
      <label>Recado<textarea name="texto" maxlength="600" required placeholder="Ex.: Prioridade hoje é finalizar o carrossel da Padaria."></textarea></label>
      <label class="inline"><input type="checkbox" name="urgente"> Urgente (aparece em vermelho no início da pessoa)</label>`,
    async (f, form) => {
      const membros = [...form.querySelectorAll('input[name=part]:checked')].map(c => c.value);
      if (!membros.length) throw new Error('Escolha pelo menos uma pessoa.');
      const j = await acao('recado_enviar', { membros, texto: f.texto, urgente: f.urgente });
      D.avisos = (j.rows || []).concat(D.avisos || []);
      toast(membros.length === 1 ? 'Recado enviado.' : `Recado enviado para ${membros.length} pessoas.`);
    }, { saveLabel: 'Enviar', setup: ligarPessoas });
  }
  // Filtro por função + marcar/limpar nas listas de pessoas com checkbox
  function ligarPessoas(form) {
    const fil = form.querySelector('[data-fpart]');
    if (!fil) return;
    const visiveis = () => [...form.querySelectorAll('.people label')].filter(l => l.style.display !== 'none');
    fil.addEventListener('change', () => form.querySelectorAll('.people label').forEach(l => { l.style.display = !fil.value || l.dataset.funcao === fil.value ? '' : 'none'; }));
    form.querySelector('[data-todos]').addEventListener('click', () => visiveis().forEach(l => { l.querySelector('input').checked = true; }));
    form.querySelector('[data-nenhum]').addEventListener('click', () => form.querySelectorAll('.people input').forEach(i => { i.checked = false; }));
  }

  /* ---------------- e-mails de aviso ---------------- */
  const emailsConhecidos = () => [...new Set([...(D.contatos || []).map(c => c.email), ...D.membros.map(m => m.email).filter(Boolean), D.me.email].filter(Boolean))].sort();
  const validoEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  function campoEmails(t) {
    return `<div class="sep">Avisos por e-mail</div>
      <label class="inline"><input type="checkbox" name="notificar"${t.notificar ? ' checked' : ''}> Enviar e-mails desta tarefa (nova tarefa, prazo chegando e atraso)</label>
      <div class="emails" data-emails>
        <div class="chips" data-chips></div>
        <div class="em-add"><input type="text" data-em-in list="emailsConhecidos" placeholder="Escolha ou escreva um e-mail" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="email"><button type="button" class="btn btn-sm" data-em-add>${ic('plus', 14)}<span>Adicionar e-mail</span></button></div>
        <datalist id="emailsConhecidos">${emailsConhecidos().map(e => `<option value="${esc(e)}">`).join('')}</datalist>
        <div class="hint">O e-mail fica guardado nos registros para as próximas tarefas. O envio começa quando o serviço de e-mail for ligado.</div>
      </div>`;
  }
  function ligarEmails(form, inicial, respSel) {
    const lista = [...(inicial || [])];
    const box = form.querySelector('[data-chips]'), inp = form.querySelector('[data-em-in]'), chk = form.querySelector('[name=notificar]');
    const desenhar = () => {
      box.innerHTML = lista.map((e, i) => `<span class="chip">${ic('mail', 12)}${esc(e)}<button type="button" data-rm="${i}" aria-label="Remover">×</button></span>`).join('') || '<span class="small muted">Nenhum e-mail ainda.</span>';
    };
    const add = async e => {
      e = String(e || '').trim().toLowerCase();
      if (!e) return;
      if (!validoEmail(e)) { toast('E-mail inválido.'); return; }
      if (!lista.includes(e)) lista.push(e);
      inp.value = ''; chk.checked = true; desenhar();
      if (!emailsConhecidos().includes(e)) {
        try { const j = await acao('contato_salvar', { email: e }); D.contatos = (D.contatos || []).concat(j.row); } catch (er) {}
      }
    };
    form.querySelector('[data-em-add]').addEventListener('click', () => add(inp.value));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(inp.value); } });
    box.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { lista.splice(+b.dataset.rm, 1); desenhar(); } });
    // Ao escolher o responsável, sugere o e-mail dele
    const sel = respSel && form.querySelector(respSel);
    if (sel) sel.addEventListener('change', () => { const m = membro(sel.value); if (m && m.email && !lista.includes(m.email)) { lista.push(m.email); desenhar(); } });
    desenhar();
    // Se a pessoa digitou um e-mail válido e não clicou em "Adicionar", ele entra mesmo assim
    return () => { const v = inp.value.trim().toLowerCase(); if (validoEmail(v) && !lista.includes(v)) lista.push(v); return lista.slice(); };
  }

  /* ---------------- SOLICITAÇÕES DE ATENDIMENTO ---------------- */
  const solicitacoesTodas = () => (D.avisos || []).filter(a => a.tipo === 'solicitacao');
  const solicPend = () => solicitacoesTodas().filter(a => !a.atendido_em).length;
  const minhasSolic = () => meusAvisos().filter(a => a.tipo === 'solicitacao' && !a.atendido_em);
  function prazoSolic(a) {
    if (!a.prazo_em) return '';
    const min = Math.round((new Date(a.prazo_em) - Date.now()) / 6e4);
    if (a.atendido_em) return `prazo ${dataHoraBr(a.prazo_em)}`;
    if (min < 0) return `<span class="red-t">atrasada há ${duracao(-min * 6e4)}</span>`;
    if (min < 60) return `<span class="yellow-t">vence em ${min} min</span>`;
    return `até ${dataHoraBr(a.prazo_em)}`;
  }
  function solicitacoes() {
    if (!gestao()) return inicio();
    const l = solicitacoesTodas().sort((a, b) => b.criado_em.localeCompare(a.criado_em));
    const pend = l.filter(a => !a.atendido_em), feitas = l.filter(a => a.atendido_em);
    const linha = a => `<div class="sol${a.atendido_em ? ' ok' : ''}${a.urgente && !a.atendido_em ? ' urg' : ''}">
      <div class="sol-p"><span class="avatar xs">${esc(iniciais(nomeMembro(a.membro_id)))}</span><span><b>${esc(nomeMembro(a.membro_id))}</b><small>pedido por ${esc(primeiroNome(nomeMembro(a.de_id)))} · ${dataHoraBr(a.criado_em)}</small></span></div>
      <div class="sol-t">${a.urgente ? '<span class="tag danger">Urgente</span> ' : ''}${esc(a.texto)}${a.resposta ? `<div class="sol-r">↳ ${esc(a.resposta)}</div>` : ''}</div>
      <div class="sol-s">${a.atendido_em ? `<span class="tag ok">✓ Atendida</span><small>em ${duracao(new Date(a.atendido_em) - new Date(a.criado_em))}</small>` : `<span class="tag ${a.lido_em ? 'warn' : ''}">${a.lido_em ? 'Vista, pendente' : 'Ainda não vista'}</span><small>${prazoSolic(a)}</small>`}</div>
      ${a.de_id === D.me.id || can('gerenciar_equipe') ? `<button class="icon-btn sm" data-act="recadoExcluir" data-id="${a.id}" title="Apagar">${ic('trash', 14)}</button>` : ''}
    </div>`;
    return cab('Solicitações de atendimento', 'Peça algo para alguém da equipe com prazo. Chega na caixa de entrada da pessoa (com som) e fica fixo no início dela até ser atendido.', btn('solicitacaoNova', 'Nova solicitação', 'plus', 'btn-primary')) +
      `<h2 class="sec">Pendentes <span class="count">${pend.length}</span></h2>` + (pend.length ? `<div class="sols">${pend.map(linha).join('')}</div>` : vazio('Nenhuma solicitação pendente.')) +
      `<h2 class="sec">Atendidas <span class="count">${feitas.length}</span></h2>` + (feitas.length ? `<div class="sols">${feitas.slice(0, 40).map(linha).join('')}</div>` : vazio('Nenhuma atendida ainda.'));
  }
  function formSolicitacao() {
    const lista = [...D.membros].filter(m => m.id !== D.me.id).sort(porNome);
    const daqui = h => { const d = new Date(Date.now() + h * 36e5); return `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    modal('Nova solicitação de atendimento', `
      <div><div class="lbl">Quem atende</div>
        <div class="filters tight"><select data-fpart aria-label="Filtrar por função">${optAreas('')}</select>
          <button type="button" class="btn btn-sm btn-ghost" data-todos>Marcar visíveis</button><button type="button" class="btn btn-sm btn-ghost" data-nenhum>Limpar</button></div>
        <div class="people">${lista.map(m => `<label data-funcao="${esc(m.funcao || '')}"><input type="checkbox" name="part" value="${m.id}" data-multi="1"><span class="avatar xs">${esc(iniciais(m.nome))}</span><span>${esc(m.nome)}<small>${esc(m.funcao || 'Gestão')}</small></span></label>`).join('')}</div>
      </div>
      <label>O que precisa<textarea name="texto" maxlength="1000" required placeholder="Ex.: Cliente pediu um story urgente da promoção de hoje."></textarea></label>
      <div class="two">
        <label>Prazo<select name="_prazo"><option value="1">Em 1 hora</option><option value="2">Em 2 horas</option><option value="4">Em 4 horas</option><option value="hoje">Até o fim do dia</option><option value="">Sem prazo</option><option value="outro">Escolher data e hora…</option></select></label>
        <label data-outro hidden>Data e hora<input type="datetime-local" name="_quando" value="${daqui(24)}"></label>
      </div>
      <label class="inline"><input type="checkbox" name="urgente"> Urgente (aparece em vermelho)</label>`,
    async (f, form) => {
      const membros = [...form.querySelectorAll('input[name=part]:checked')].map(c => c.value);
      if (!membros.length) throw new Error('Escolha pelo menos uma pessoa.');
      let prazo = null;
      if (f._prazo === 'hoje') { const d = new Date(); d.setHours(23, 59, 0, 0); prazo = d.toISOString(); }
      else if (f._prazo === 'outro') prazo = f._quando ? new Date(f._quando).toISOString() : null;
      else if (f._prazo) prazo = new Date(Date.now() + Number(f._prazo) * 36e5).toISOString();
      const j = await acao('solicitacao_enviar', { membros, texto: f.texto, urgente: f.urgente, prazo_em: prazo });
      D.avisos = (j.rows || []).concat(D.avisos || []);
      toast(membros.length === 1 ? 'Solicitação enviada.' : `Solicitação enviada para ${membros.length} pessoas.`);
    }, { saveLabel: 'Enviar', setup: form => {
      ligarPessoas(form);
      const sel = form.querySelector('[name=_prazo]'), outro = form.querySelector('[data-outro]');
      sel.addEventListener('change', () => { outro.hidden = sel.value !== 'outro'; });
    } });
  }
  function atenderSolicitacao(a) {
    modal(a.urgente ? 'Solicitação urgente' : 'Solicitação de atendimento', `
      <div class="recado${a.urgente ? ' urg' : ''}" style="animation:none"><div class="rc-ic">${ic('hand', 20)}</div><div class="rc-b">
        <div class="rc-h"><b>${esc(nomeMembro(a.de_id))}</b><small>${dataHoraBr(a.criado_em)}</small>${a.prazo_em ? `<small>· ${prazoSolic(a)}</small>` : ''}</div>
        <div class="rc-t">${esc(a.texto)}</div></div></div>
      <label>Resposta <span class="hint">(opcional — ex.: “feito, já está no Drive”)</span><textarea name="resposta" maxlength="600" style="min-height:60px"></textarea></label>`,
    async f => {
      const j = await acao('solicitacao_atender', { id: a.id, resposta: f.resposta });
      Object.assign(a, j.row);
      toast('Solicitação marcada como atendida ✓');
    }, { saveLabel: 'Marcar como atendida', semFoco: true, setup: () => marcarLido(x => x.id === a.id) });
  }

  /* ---------------- ACESSOS (só o dono vê) ---------------- */
  let acessosCache = null;
  function acessos() {
    if (!D.me.dono) return inicio();
    const dias = Number(S.diasAcesso) || 7;
    if (!acessosCache || acessosCache.dias !== dias) {
      acessosCache = { dias, rows: null };
      acao('acessos', { dias }).then(j => { acessosCache.rows = j.rows || []; if (rota()[0] === 'acessos') render(true); }).catch(e => { acessosCache.rows = []; toast(e.message); });
    }
    const rows = acessosCache.rows;
    const dur = r => Math.max(60e3, new Date(r.ultimo) - new Date(r.inicio)); // mínimo 1 min por acesso
    const cab_ = cab('Acessos', 'Quando e por quanto tempo cada pessoa usou o painel. Só você (dono) vê esta aba.',
      `<select data-set="diasAcesso" aria-label="Período">${opcoes([['1', 'Hoje e ontem'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias']], String(dias))}</select>${btn('acessosAtualizar', 'Atualizar', '', 'btn-ghost')}`);
    if (!rows) return cab_ + '<div class="loading">Carregando…</div>';
    const pessoas = [...D.membros].sort(porNome).map(m => {
      const l = rows.filter(r => r.membro_id === m.id);
      return { m, l, total: l.reduce((s, r) => s + dur(r), 0), ultimo: l[0] };
    }).sort((a, b) => (b.ultimo ? b.ultimo.ultimo : '').localeCompare(a.ultimo ? a.ultimo.ultimo : ''));
    const online = r => r && Date.now() - new Date(r.ultimo) < 90e3;
    return cab_ + `<div class="card table-card"><table class="perf"><thead><tr><th>Pessoa</th><th>Último acesso</th><th>Acessos</th><th>Tempo total</th><th>Média por acesso</th><th>Dispositivo</th></tr></thead><tbody>
      ${pessoas.map(({ m, l, total, ultimo }) => `<tr class="${l.length ? 'click' : ''}" ${l.length ? `data-act="acessoDetalhe" data-id="${m.id}"` : ''}>
        <td><div class="mem"><span class="avatar xs">${esc(iniciais(m.nome))}</span><span><b>${esc(m.nome)}</b><small class="muted">${esc(m.funcao || 'Gestão')}</small></span></div></td>
        <td>${ultimo ? (online(ultimo) ? '<span class="green-t">● online agora</span>' : dataHoraBr(ultimo.ultimo)) : '<span class="muted">sem acesso</span>'}</td>
        <td>${l.length}</td><td>${l.length ? duracao(total) : '—'}</td><td>${l.length ? duracao(total / l.length) : '—'}</td>
        <td>${ultimo ? esc(ultimo.dispositivo) : '—'}</td></tr>`).join('')}
    </tbody></table></div><p class="small muted" style="margin-top:.8rem">Clique numa pessoa para ver cada acesso. O tempo conta enquanto o painel está aberto e visível na tela.</p>`;
  }
  function detalheAcesso(id) {
    const l = (acessosCache.rows || []).filter(r => r.membro_id === id);
    modal(`Acessos de ${nomeMembro(id)}`, `<div class="card table-card"><table class="perf"><thead><tr><th>Entrou</th><th>Saiu</th><th>Tempo</th><th>Onde</th></tr></thead><tbody>
      ${l.map(r => `<tr><td>${dataHoraBr(r.inicio)}</td><td>${dataHoraBr(r.ultimo)}</td><td>${duracao(Math.max(60e3, new Date(r.ultimo) - new Date(r.inicio)))}</td><td>${esc(r.dispositivo)} · ${r.area === 'admin' ? 'gestão' : 'equipe'}</td></tr>`).join('')}
    </tbody></table></div>`, null, { wide: true, semFoco: true });
  }

  /* ---------------- PROTEÇÃO DE CONTEÚDO (colaboradores) ---------------- */
  // Dificulta copiar dados: sem seleção de texto, sem copiar/colar, sem botão direito e marca d'água com o nome.
  // Não impede foto da tela — mas a marca d'água mostra de quem é o acesso.
  let protegido = false;
  function protegerConteudo() {
    const proteger = !gestao();
    document.body.classList.toggle('protegido', proteger);
    let wm = $('#marcaDagua');
    if (!proteger) { if (wm) wm.remove(); return; }
    if (!wm) { wm = document.createElement('div'); wm.id = 'marcaDagua'; wm.setAttribute('aria-hidden', 'true'); document.body.appendChild(wm); }
    const txt = `${D.me.nome} · ${D.me.usuario} · ${new Date().toLocaleDateString('pt-BR')}`;
    wm.innerHTML = Array(40).fill(`<span>${esc(txt)}</span>`).join('');
    if (protegido) return;
    protegido = true;
    const bloqueia = e => { if (!document.body.classList.contains('protegido')) return; if (e.target.closest && e.target.closest('input,textarea,[contenteditable]')) return; e.preventDefault(); };
    ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach(ev => document.addEventListener(ev, bloqueia));
    document.addEventListener('keydown', e => { if (document.body.classList.contains('protegido') && (e.ctrlKey || e.metaKey) && /^[spu]$/i.test(e.key)) e.preventDefault(); });
  }

  /* ---------------- TAREFAS ---------------- */
  function filtrosTarefas() {
    if (!verTodas()) return '';
    const pessoas = [...D.membros].filter(m => !S.area || m.funcao === S.area).sort(porNome);
    return `<div class="filters">
      <select data-set="area" aria-label="Filtrar por função">${optAreas(S.area)}</select>
      <select data-set="pessoa" aria-label="Filtrar por pessoa">${opcoes([['', S.area ? 'Todas as pessoas da função' : 'Toda a equipe'], ['minhas', 'Só as minhas'], ...pessoas.map(m => [m.id, m.nome])], S.pessoa)}</select>
    </div>`;
  }

  function tarefas() {
    const lista = tarefasFiltradas();
    const todas = verTodas() && S.pessoa !== 'minhas';
    const acts = `<div class="seg" role="tablist">
        <button class="${S.modo === 'semana' ? 'on' : ''}" data-act="modoTarefas" data-id="semana">${ic('cal', 15)}Semana</button>
        <button class="${S.modo === 'quadro' ? 'on' : ''}" data-act="modoTarefas" data-id="quadro">${ic('board', 15)}Quadro</button>
      </div>${btn('tarefaNova', 'Nova tarefa', 'plus', 'btn-primary')}`;
    let corpo;
    if (S.modo === 'quadro') {
      const col = s => {
        const arr = lista.filter(t => t.status === s).sort(ordemPrazo);
        return `<div class="col"><h3>${STATUS_T[s]} <span class="count">${arr.length}</span></h3>${arr.map(cartaoTarefa).join('') || '<div class="empty small">Vazio</div>'}</div>`;
      };
      corpo = `<div class="cols">${col('pendente')}${col('fazendo')}${col('feito')}</div>`;
    } else {
      const seg = segunda(S.semanaT);
      const dias = [...Array(7)].map((_, i) => somaDias(seg, i));
      const h = hoje();
      const ini = ymd(dias[0]), fim = ymd(dias[6]);
      const semPrazo = lista.filter(t => !t.prazo && t.status !== 'feito');
      const abertasAntes = S.semanaT === 0 ? lista.filter(t => t.status !== 'feito' && t.prazo && t.prazo < ini) : [];
      const evs = (D.eventos || []).filter(e => e.data >= ini && e.data <= fim);
      corpo = `<div class="weekbar">${btn('semanaT', '', 'left', 'btn-ghost btn-sm', '-1', ' aria-label="Semana anterior"')}
          <div class="wk-t"><b>${S.semanaT === 0 ? 'Esta semana' : S.semanaT === 1 ? 'Próxima semana' : S.semanaT === -1 ? 'Semana passada' : 'Semana'}</b><span>${dataBr(ini)} a ${dataBr(fim)}</span></div>
          ${btn('semanaT', '', 'right', 'btn-ghost btn-sm', '1', ' aria-label="Próxima semana"')}${S.semanaT ? btn('semanaT', 'Hoje', '', 'btn-ghost btn-sm', '0') : ''}</div>` +
        (abertasAntes.length ? `<div class="late-box">${ic('alert', 15)}<b>${abertasAntes.length}</b> ${abertasAntes.length === 1 ? 'tarefa atrasada de semanas anteriores' : 'tarefas atrasadas de semanas anteriores'} — veja no painel ao lado.</div>` : '') +
        `<div class="tweek">${dias.map(d => {
          const s = ymd(d);
          const ts = lista.filter(t => t.prazo === s).sort(ordemPrazo);
          const es = evs.filter(e => e.data === s);
          return `<div class="tday${s === h ? ' today' : ''}${s < h ? ' past' : ''}${!ts.length && !es.length ? ' none' : ''}">
            <div class="td-h"><span>${DIAS[d.getDay()]}</span><b>${d.getDate()}</b>${ts.length ? `<em>${ts.length}</em>` : ''}</div>
            ${es.map(e => `<div class="echip" data-act="eventoAbrir" data-id="${e.id}" role="button" tabindex="0">${dot(sitEvento(e))}<span>${TIPO_EV[e.tipo] ? TIPO_EV[e.tipo][0] : ''} ${esc(e.titulo)}</span></div>`).join('')}
            ${ts.map(t => chipTarefa(t, todas)).join('')}
          </div>`;
        }).join('')}</div>` +
        (semPrazo.length ? `<h2 class="sec">Sem prazo <span class="count">${semPrazo.length}</span></h2><div class="nodate">${semPrazo.map(t => chipTarefa(t, todas)).join('')}</div>` : '');
    }
    return `<div class="with-panel"><div>` +
      cab('Tarefas', verTodas() ? 'Tarefas da equipe semana a semana. Clique numa tarefa para ver detalhes.' : 'Suas tarefas semana a semana. Clique numa tarefa para ver detalhes.', acts) +
      filtrosTarefas() + corpo + `</div>${painelAtencao(lista, todas ? 'Atenção da equipe' : 'Minhas pendências')}</div>`;
  }

  function abrirTarefa(t) {
    if (!t) return;
    if (tarefaNova(t)) { marcarLido(a => a.tarefa_id === t.id && a.tipo === 'nova_tarefa'); setTimeout(() => render(true), 0); }
    const sit = sitTarefa(t);
    const p = PRIOR[t.prioridade] || PRIOR.media;
    const prox = PROX[t.status] || PROX.pendente;
    const ini = t.iniciado_em, fim = t.concluido_em;
    const noPrazo = t.status === 'feito' && t.prazo && fim ? (ymd(new Date(fim)) <= t.prazo ? 'Concluída no prazo' : 'Concluída com atraso') : '';
    const erros = t.erros || [];
    modal(t.titulo, `
      <div class="det-top">${dot(sit)}<b>${SIT[sit][1]}</b>${noPrazo ? ` · <span class="${noPrazo.includes('atraso') ? 'red-t' : 'green-t'}">${noPrazo}</span>` : ''}</div>
      ${t.descricao ? `<p class="pre">${esc(t.descricao)}</p>` : ''}
      <dl class="kv">
        <dt>Responsável</dt><dd>${esc(nomeMembro(t.membro_id))}${membro(t.membro_id) && membro(t.membro_id).funcao ? ` <span class="muted">· ${esc(membro(t.membro_id).funcao)}</span>` : ''}</dd>
        <dt>Status</dt><dd>${STATUS_T[t.status] || t.status}</dd>
        <dt>Prioridade</dt><dd><span class="tag ${p[1]}">${p[0]}</span></dd>
        <dt>Prazo</dt><dd>${t.prazo ? `${dataBr(t.prazo)} (${quando(t.prazo).toLowerCase()})` : 'Sem prazo'}</dd>
        ${t.cliente_id && nomeCliente(t.cliente_id) ? `<dt>Cliente</dt><dd><a href="#/cliente/${t.cliente_id}">${esc(nomeCliente(t.cliente_id))}</a></dd>` : ''}
        ${t.criado_por ? `<dt>Criada por</dt><dd>${esc(nomeMembro(t.criado_por))} · ${dataHoraBr(t.criado_em)}</dd>` : ''}
        ${t.notificar && (t.emails || []).length ? `<dt>Avisos por e-mail</dt><dd>${t.emails.map(esc).join(', ')}</dd>` : ''}
        ${ini ? `<dt>Começou</dt><dd>${dataHoraBr(ini)}</dd>` : ''}
        ${fim ? `<dt>Concluiu</dt><dd>${dataHoraBr(fim)} · levou ${duracao(new Date(fim) - new Date(ini || t.criado_em))}</dd>` : ''}
      </dl>
      ${erros.length || edita('gerenciar_tarefas') ? `<div class="sep">Erros e ajustes ${erros.length ? `<span class="tag danger">${erros.length}</span>` : ''}</div>
        ${erros.map(e => `<div class="erro">${ic('alert', 13)}<div><div>${esc(e.texto)}</div><div class="small muted">${esc(primeiroNome(nomeMembro(e.por)))} · ${dataHoraBr(e.em)}</div></div></div>`).join('') || '<p class="small muted">Nenhum erro registrado.</p>'}
        ${edita('gerenciar_tarefas') ? `<div class="erro-add"><input name="erro" maxlength="500" placeholder="Registrar erro ou ajuste pedido (ex.: legenda com erro, refazer corte)"><button type="button" class="btn btn-sm" data-erro>Registrar</button></div>` : ''}` : ''}`,
    null, {
      semFoco: true,
      extra: (podeEditarTarefa(t) ? `<button type="button" class="btn btn-ghost" data-editar>${ic('edit')}Editar</button>` : '') +
        (podeStatus(t) ? `<button type="button" class="btn btn-primary" data-status="${prox[0]}">${prox[1]}</button>` : ''),
      setup: (form, { fechar, rodar }) => {
        const be = form.querySelector('[data-editar]');
        if (be) be.addEventListener('click', () => { fechar(); formTarefa(t); });
        const bs = form.querySelector('[data-status]');
        if (bs) bs.addEventListener('click', () => { fechar(); mudarStatus(t.id, bs.dataset.status); });
        const br = form.querySelector('[data-erro]');
        if (br) br.addEventListener('click', () => rodar(async () => {
          const texto = form.querySelector('[name=erro]').value;
          const j = await acao('tarefa_erro', { id: t.id, texto });
          aplicar('tarefas', j.row);
          toast('Erro registrado.');
          setTimeout(() => abrirTarefa(D.tarefas.find(x => x.id === t.id)), 30);
        }));
      }
    });
  }

  // Atualização otimista: a tela muda na hora e o servidor confirma por trás
  async function mudarStatus(id, status) {
    const t = D.tarefas.find(x => x.id === id);
    if (!t) return;
    const antes = Object.assign({}, t);
    const agora = new Date().toISOString();
    Object.assign(t, { status, concluido_em: status === 'feito' ? agora : null, iniciado_em: status === 'pendente' ? null : (t.iniciado_em || agora) });
    render(true);
    if (status === 'feito') toast('Tarefa concluída ✓');
    try { const j = await acao('tarefa_status', { id, status }); aplicar('tarefas', j.row); render(true); }
    catch (e) { Object.assign(t, antes); render(true); if (e.message !== 'sessao') toast(e.message); }
  }

  let lerEmails = () => [];
  function formTarefa(t = {}, padrao = {}) {
    const gere = edita('gerenciar_tarefas');
    const resp = t.membro_id || padrao.membro_id || (gere ? '' : D.me.id);
    const areaResp = resp && membro(resp) ? membro(resp).funcao : '';
    modal(t.id ? 'Editar tarefa' : (gere ? 'Nova tarefa' : 'Nova tarefa para mim'), `
      <input type="hidden" name="id" value="${esc(t.id || '')}">
      <label>Título<input name="titulo" maxlength="200" required value="${esc(t.titulo || '')}" placeholder="Ex.: Roteiro do reels de terça"></label>
      <label>Descrição<textarea name="descricao" placeholder="Detalhes, links, referências…">${esc(t.descricao || '')}</textarea></label>
      ${gere ? `<div class="two">
        <label>Função<select name="_area">${optAreas(areaResp)}</select></label>
        <label>Responsável<select name="membro_id" required>${optMembros(resp, 'Escolha…', areaResp)}</select></label>
      </div>` : `<input type="hidden" name="membro_id" value="${esc(D.me.id)}">`}
      <div class="two">
        <label>Cliente<select name="cliente_id">${optClientes(t.cliente_id || padrao.cliente_id, 'Nenhum')}</select></label>
        <label>Prazo<input type="date" name="prazo" value="${esc(t.prazo || padrao.prazo || '')}"></label>
      </div>
      <div class="two">
        <label>Prioridade<select name="prioridade">${opcoes([['alta', 'Alta'], ['media', 'Média'], ['baixa', 'Baixa']], t.prioridade || 'media')}</select></label>
        <label>Status<select name="status">${opcoes([['pendente', 'A fazer'], ['fazendo', 'Fazendo'], ['feito', 'Feito']], t.status || 'pendente')}</select></label>
      </div>
      ${campoEmails(t)}`,
    async f => {
      delete f._area;
      f.emails = lerEmails();
      if (f.notificar && !f.emails.length) throw new Error('Adicione pelo menos um e-mail ou desmarque os avisos por e-mail.');
      const j = await acao('tarefa_salvar', { row: f });
      aplicar('tarefas', j.row);
      toast(j.row.membro_id !== D.me.id && !t.id ? `Tarefa enviada para ${primeiroNome(nomeMembro(j.row.membro_id))}.` : 'Tarefa salva.');
    },
    Object.assign({ wide: true, setup: form => {
      ligarArea(form, '[name=_area]', '[name=membro_id]');
      const r = membro(resp);
      lerEmails = ligarEmails(form, t.id ? t.emails : (r && r.email ? [r.email] : []), '[name=membro_id]');
    } },
      t.id && podeEditarTarefa(t) ? { onDelete: async () => { await acao('tarefa_excluir', { id: t.id }); aplicar('tarefas', t, true); toast('Tarefa excluída.'); }, confirmDel: 'Excluir esta tarefa?' } : {}));
  }

  /* ---------------- CALENDÁRIO ---------------- */
  const TIPO_EV = { reuniao: ['👥', 'Reunião'], entrega: ['📦', 'Entrega'], prazo: ['⏰', 'Prazo'], outro: ['📌', 'Outro'] };

  function cartaoEvento(e) {
    const sit = sitEvento(e);
    return `<div class="card ev-card" data-act="eventoAbrir" data-id="${e.id}" role="button" tabindex="0">
      <div class="over">${dot(sit)}${TIPO_EV[e.tipo] ? TIPO_EV[e.tipo][1] : 'Evento'}${e.hora ? ' · ' + esc(e.hora) : ''}</div>
      <div class="ct">${esc(e.titulo)}</div>
      ${e.cliente_id && nomeCliente(e.cliente_id) ? `<div class="small muted">${esc(nomeCliente(e.cliente_id))}</div>` : ''}
    </div>`;
  }

  function itensDoDia(s) {
    const minhasOuTodas = tarefasFiltradas();
    return {
      ev: (D.eventos || []).filter(e => e.data === s).sort((a, b) => (a.hora || '').localeCompare(b.hora || '')),
      ts: minhasOuTodas.filter(t => t.prazo === s).sort(ordemPrazo),
      ps: D.publicacoes.filter(p => p.data === s).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
    };
  }

  function calendario() {
    const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + S.mes);
    const ano = base.getFullYear(), mes = base.getMonth();
    const ini = somaDias(base, -((base.getDay() + 6) % 7));
    const h = hoje();
    if (!S.diaSel) S.diaSel = h;
    const celulas = [...Array(42)].map((_, i) => somaDias(ini, i));
    const ultimaLinha = celulas.slice(35).every(d => d.getMonth() !== mes) ? 35 : 42;
    const dSel = itensDoDia(S.diaSel);
    const selD = parseYmd(S.diaSel);
    return cab('Calendário', 'Reuniões, entregas, prazos, tarefas e publicações do mês. Escolha um dia e use “Adicionar neste dia”.') +
      filtrosTarefas() +
      `<div class="cal-wrap"><div class="cal">
        <div class="cal-head">${btn('mes', '', 'left', 'btn-ghost btn-sm', '-1', ' aria-label="Mês anterior"')}<b>${MESES[mes]} ${ano}</b>${btn('mes', '', 'right', 'btn-ghost btn-sm', '1', ' aria-label="Próximo mês"')}${S.mes ? btn('mes', 'Hoje', '', 'btn-ghost btn-sm', '0') : ''}</div>
        <div class="cal-grid">${['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map(d => `<div class="cal-dow">${d}</div>`).join('')}
        ${celulas.slice(0, ultimaLinha).map(d => {
          const s = ymd(d);
          const it = itensDoDia(s);
          const n = it.ev.length + it.ts.length + it.ps.length;
          return `<button class="cal-d${d.getMonth() !== mes ? ' out' : ''}${s === h ? ' today' : ''}${s === S.diaSel ? ' sel' : ''}" data-act="diaSel" data-id="${s}">
            <span class="cd-n">${d.getDate()}</span>
            <span class="cd-items">${it.ev.slice(0, 2).map(e => `<span class="cd-ev ${SIT[sitEvento(e)][0]}">${eventoNovo(e) ? '<b class="nova">Nova</b>' : ''}${esc(e.titulo)}</span>`).join('')}</span>
            <span class="cd-dots">${it.ev.map(e => `<span class="dot ev ${SIT[sitEvento(e)][0]}${eventoNovo(e) ? ' pulse' : ''}" title="${esc(e.titulo)}"></span>`).join('')}${it.ts.slice(0, 6).map(t => dot(sitTarefa(t), t.titulo)).join('')}${it.ps.length ? `<span class="dot pub" title="${it.ps.length} publicação(ões)"></span>` : ''}${n > 8 ? '<span class="more">+</span>' : ''}</span>
          </button>`;
        }).join('')}</div>
        <div class="legend">${dot('atrasada')}Atrasado ${dot('perto')}Perto do prazo ${dot('ok')}Novo / no prazo ${dot('feito')}Feito <span class="dot pub"></span>Publicação</div>
      </div>
      <aside class="panel day-panel">
        <h3>${DIAS[selD.getDay()]}, ${selD.getDate()} de ${MESES[selD.getMonth()]}</h3>
        <button class="btn btn-primary btn-sm full" data-act="adicionarDia" data-id="${S.diaSel}">${ic('plus')}<span>Adicionar neste dia</span></button>
        ${dSel.ev.length ? `<div class="pl-sec"><div class="pl-h">${ic('month', 14)}Eventos</div>${dSel.ev.map(e => `<button class="pl" data-act="eventoAbrir" data-id="${e.id}">${dot(sitEvento(e))}<span class="pl-t">${eventoNovo(e) ? '<span class="nova">Nova</span>' : ''}${TIPO_EV[e.tipo] ? TIPO_EV[e.tipo][0] : ''} ${esc(e.titulo)}</span><span class="pl-d">${esc(e.hora || '')}</span></button>`).join('')}</div>` : ''}
        ${dSel.ts.length ? `<div class="pl-sec"><div class="pl-h">${ic('task', 14)}Prazos de tarefas</div>${dSel.ts.map(t => `<button class="pl" data-act="tarefaAbrir" data-id="${t.id}">${dot(sitTarefa(t))}<span class="pl-t">${esc(t.titulo)}</span><span class="pl-d">${esc(primeiroNome(nomeMembro(t.membro_id)))}</span></button>`).join('')}</div>` : ''}
        ${dSel.ps.length ? `<div class="pl-sec"><div class="pl-h">${ic('cal', 14)}Publicações</div>${dSel.ps.map(p => `<button class="pl" data-act="pubAbrir" data-id="${p.id}"><span class="dot pub"></span><span class="pl-t">${esc(nomeCliente(p.cliente_id))} · ${esc(p.formato || '')}</span><span class="pl-d">${esc(p.hora || '')}</span></button>`).join('')}</div>` : ''}
        ${!dSel.ev.length && !dSel.ts.length && !dSel.ps.length ? '<div class="pl-vazio">Nada neste dia.</div>' : ''}
      </aside></div>`;
  }

  function abrirEvento(e) {
    if (!e) return;
    if (naoLidos().some(a => a.tipo === 'novo_evento' && a.tarefa_id === e.id)) { marcarLido(a => a.tipo === 'novo_evento' && a.tarefa_id === e.id); setTimeout(() => render(true), 0); }
    const sit = sitEvento(e);
    const participa = !(e.participantes || []).length || e.participantes.includes(D.me.id);
    const podeMarcar = e.tipo !== 'reuniao' && (participa || edita('gerenciar_calendario'));
    modal(e.titulo, `
      <div class="det-top">${dot(sit)}<b>${TIPO_EV[e.tipo] ? TIPO_EV[e.tipo][1] : 'Evento'}</b> · ${e.concluido ? 'Feito' : SIT[sit][1]}</div>
      ${e.descricao ? `<p class="pre">${esc(e.descricao)}</p>` : ''}
      <dl class="kv">
        <dt>Quando</dt><dd>${dataBr(e.data)}${e.hora ? ' às ' + esc(e.hora) : ''} (${quando(e.data).toLowerCase()})</dd>
        ${e.cliente_id && nomeCliente(e.cliente_id) ? `<dt>Cliente</dt><dd><a href="#/cliente/${e.cliente_id}">${esc(nomeCliente(e.cliente_id))}</a></dd>` : ''}
        <dt>Quem</dt><dd>${(e.participantes || []).length ? e.participantes.map(id => esc(nomeMembro(id))).join(', ') : 'Equipe toda'}</dd>
        ${e.criado_por ? `<dt>Criado por</dt><dd>${esc(nomeMembro(e.criado_por))}</dd>` : ''}
      </dl>`, null, {
      semFoco: true,
      extra: (edita('gerenciar_calendario') ? `<button type="button" class="btn btn-ghost" data-editar>${ic('edit')}Editar</button>` : '') +
        (podeMarcar ? `<button type="button" class="btn btn-primary" data-feito>${e.concluido ? 'Reabrir' : 'Marcar como feito'}</button>` : ''),
      setup: (form, { fechar, rodar }) => {
        const be = form.querySelector('[data-editar]');
        if (be) be.addEventListener('click', () => { fechar(); formEvento(e); });
        const bf = form.querySelector('[data-feito]');
        if (bf) bf.addEventListener('click', () => rodar(async () => { const j = await acao('evento_status', { id: e.id, concluido: !e.concluido }); aplicar('eventos', j.row); toast(e.concluido ? 'Reaberto.' : 'Marcado como feito ✓'); }));
      }
    });
  }

  function formEvento(e = {}, dia) {
    const part = new Set(e.participantes || []);
    const lista = [...D.membros].sort(porNome);
    modal(e.id ? 'Editar evento' : 'Novo evento', `
      <input type="hidden" name="id" value="${esc(e.id || '')}">
      <label>Título<input name="titulo" maxlength="200" required value="${esc(e.titulo || '')}" placeholder="Ex.: Reunião de alinhamento com a Padaria"></label>
      <div class="two">
        <label>Tipo<select name="tipo">${opcoes(Object.entries(TIPO_EV).map(([k, v]) => [k, v[0] + ' ' + v[1]]), e.tipo || 'reuniao')}</select></label>
        <label>Cliente<select name="cliente_id">${optClientes(e.cliente_id, 'Nenhum')}</select></label>
      </div>
      <div class="two">
        <label>Dia<input type="date" name="data" required value="${esc(e.data || dia || hoje())}"></label>
        <label>Horário<input type="time" name="hora" value="${esc(e.hora || '')}"></label>
      </div>
      <label>Descrição<textarea name="descricao" style="min-height:64px">${esc(e.descricao || '')}</textarea></label>
      <div>
        <div class="lbl">Quem participa <span class="hint">(nenhum marcado = equipe toda)</span></div>
        <div class="filters tight"><select data-fpart aria-label="Filtrar por função">${optAreas('')}</select>
          <button type="button" class="btn btn-sm btn-ghost" data-todos>Marcar visíveis</button><button type="button" class="btn btn-sm btn-ghost" data-nenhum>Limpar</button></div>
        <div class="people">${lista.map(m => `<label data-funcao="${esc(m.funcao || '')}"><input type="checkbox" name="part" value="${m.id}" data-multi="1"${part.has(m.id) ? ' checked' : ''}><span class="avatar xs">${esc(iniciais(m.nome))}</span><span>${esc(m.nome)}<small>${esc(m.funcao || '')}</small></span></label>`).join('')}</div>
      </div>`,
    async (f, form) => {
      f.participantes = [...form.querySelectorAll('input[name=part]:checked')].map(c => c.value);
      delete f.part;
      const j = await acao('evento_salvar', { row: f });
      aplicar('eventos', j.row);
      S.diaSel = j.row.data;
      toast('Evento salvo.');
    }, Object.assign({ setup: ligarPessoas }, e.id ? { onDelete: async () => { await acao('evento_excluir', { id: e.id }); aplicar('eventos', e, true); toast('Evento excluído.'); }, confirmDel: 'Excluir este evento?' } : {}));
  }

  /* ---------------- PUBLICAÇÕES ---------------- */
  function cartaoPub(p) {
    const podeEditar = edita('gerenciar_publicacoes');
    const click = podeEditar || p.responsavel_id === D.me.id;
    return `<div class="pub${p.status === 'publicado' ? ' done' : ''}${click ? ' click' : ''}"${click ? ` data-act="pubAbrir" data-id="${p.id}" role="button" tabindex="0"` : ''}>
      <div class="h">${esc(p.hora || '')}${p.hora ? ' · ' : ''}${esc(nomeCliente(p.cliente_id) || 'Cliente')}</div>
      ${p.formato ? `<div>${esc(p.formato)}</div>` : ''}
      ${p.descricao ? `<div class="muted">${esc(p.descricao)}</div>` : ''}
      ${p.responsavel_id ? `<div class="muted">${esc(primeiroNome(nomeMembro(p.responsavel_id)))}</div>` : ''}
    </div>`;
  }

  function agenda() {
    const seg = segunda(S.semanaP);
    const dias = [...Array(7)].map((_, i) => somaDias(seg, i));
    const h = hoje();
    return cab('Agenda de publicações', 'Programação da semana por cliente, formato e horário.',
      (edita('gerenciar_publicacoes') ? btn('pubNova', 'Nova publicação', 'plus', 'btn-primary') : '')) +
      `<div class="weekbar">${btn('semanaP', '', 'left', 'btn-ghost btn-sm', '-1', ' aria-label="Semana anterior"')}<div class="wk-t"><b>${S.semanaP === 0 ? 'Esta semana' : 'Semana'}</b><span>${dataBr(ymd(dias[0]))} a ${dataBr(ymd(dias[6]))}</span></div>${btn('semanaP', '', 'right', 'btn-ghost btn-sm', '1', ' aria-label="Próxima semana"')}${S.semanaP ? btn('semanaP', 'Hoje', '', 'btn-ghost btn-sm', '0') : ''}</div>` +
      `<div class="week">${dias.map(d => {
        const s = ymd(d);
        const pubs = D.publicacoes.filter(p => p.data === s).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
        return `<div class="day${s === h ? ' today' : ''}"><div class="dh"><b>${d.getDate()}</b>${DIAS[d.getDay()]}</div>${pubs.map(cartaoPub).join('')}</div>`;
      }).join('')}</div>` +
      (S.semanaP < -7 ? '<p class="small muted" style="margin-top:.8rem">Publicações com mais de 60 dias não aparecem aqui.</p>' : '');
  }

  function formPub(p = {}) {
    if (!edita('gerenciar_publicacoes')) {
      const nova = p.status === 'publicado' ? 'programado' : 'publicado';
      return modal(nomeCliente(p.cliente_id) || 'Publicação', `
        <p>${esc(dataBr(p.data))} ${esc(p.hora || '')} · ${esc(p.formato || '')}</p>
        ${p.descricao ? `<p class="muted">${esc(p.descricao)}</p>` : ''}
        <p class="small muted">Status atual: <b>${p.status === 'publicado' ? 'Publicado' : 'Programado'}</b></p>`,
      p.responsavel_id === D.me.id ? async () => { const j = await acao('pub_status', { id: p.id, status: nova }); aplicar('publicacoes', j.row); toast('Status atualizado.'); } : null,
      { saveLabel: nova === 'publicado' ? 'Marcar como publicado' : 'Voltar para programado' });
    }
    const areaResp = p.responsavel_id && membro(p.responsavel_id) ? membro(p.responsavel_id).funcao : '';
    modal(p.id ? 'Editar publicação' : 'Nova publicação', `
      <input type="hidden" name="id" value="${esc(p.id || '')}">
      <label>Cliente<select name="cliente_id" required>${optClientes(p.cliente_id, 'Escolha…')}</select></label>
      <div class="two">
        <label>Dia<input type="date" name="data" required value="${esc(p.data || hoje())}"></label>
        <label>Horário<input type="time" name="hora" value="${esc(p.hora || '')}"></label>
      </div>
      <label>Formato<input name="formato" maxlength="60" placeholder="Reels, carrossel, stories…" value="${esc(p.formato || '')}" list="formatos"><datalist id="formatos"><option>Reels</option><option>Carrossel</option><option>Post estático</option><option>Stories</option><option>TikTok</option></datalist></label>
      <div class="two">
        <label>Função<select name="_area">${optAreas(areaResp)}</select></label>
        <label>Responsável<select name="responsavel_id">${optMembros(p.responsavel_id, 'Ninguém', areaResp)}</select></label>
      </div>
      <label>Descrição<input name="descricao" maxlength="300" value="${esc(p.descricao || '')}"></label>
      <label>Status<select name="status">${opcoes([['programado', 'Programado'], ['publicado', 'Publicado']], p.status || 'programado')}</select></label>`,
    async f => { delete f._area; const j = await acao('pub_salvar', { row: f }); aplicar('publicacoes', j.row); toast('Publicação salva.'); },
    Object.assign({ setup: form => ligarArea(form, '[name=_area]', '[name=responsavel_id]') },
      p.id ? { onDelete: async () => { await acao('pub_excluir', { id: p.id }); aplicar('publicacoes', p, true); toast('Publicação excluída.'); }, confirmDel: 'Excluir esta publicação?' } : {}));
  }

  /* ---------------- CLIENTES ---------------- */
  const SAUDE = { ok: ['Saudável', 'ok'], atencao: ['Atenção', 'warn'], risco: ['Em risco', 'danger'], novo: ['Novo', 'info'], avaliar: ['Avaliar', ''] };
  const tagSaude = s => { const x = SAUDE[s] || SAUDE.avaliar; return `<span class="tag ${x[1]}">${x[0]}</span>`; };
  const cores = txt => [...new Set((String(txt || '').match(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/gi) || []).map(c => c.toUpperCase()))];

  function clientes() {
    const lista = [...D.clientes].sort((a, b) => (a.ordem - b.ordem) || a.nome.localeCompare(b.nome));
    return cab('Clientes', `${lista.length} cliente${lista.length === 1 ? '' : 's'} na carteira.`, edita('gerenciar_clientes') ? btn('clienteNovo', 'Novo cliente', 'plus', 'btn-primary') : '') +
      (lista.length ? `<div class="grid">${lista.map(c => {
        const abertas = D.tarefas.filter(t => t.cliente_id === c.id && t.status !== 'feito');
        const atr = abertas.filter(t => sitTarefa(t) === 'atrasada').length;
        return `<a class="card cli" href="#/cliente/${c.id}">
          <div class="cli-top"><div class="nm">${esc(c.nome)}</div>${cores(c.paleta).length ? `<div class="sw-mini">${cores(c.paleta).slice(0, 5).map(x => `<i style="background:${x}"></i>`).join('')}</div>` : ''}</div>
          <div class="tags">${tagSaude(c.saude)}${c.plano ? `<span class="tag">${esc(c.plano)}</span>` : ''}${c.nicho ? `<span class="tag">${esc(c.nicho)}</span>` : ''}${c.rede ? '<span class="tag info">Rede Conceito</span>' : ''}</div>
          ${c.resumo ? `<div class="rs">${esc(c.resumo)}</div>` : ''}
          <div class="small muted cli-foot">${c.instagram ? `@${esc(c.instagram)}` : ''}<span>${abertas.length ? `${atr ? dot('atrasada') : dot('ok')}${abertas.length} tarefa${abertas.length === 1 ? '' : 's'}` : ''}</span></div>
        </a>`;
      }).join('')}</div>` : vazio(edita('gerenciar_clientes') ? 'Nenhum cliente cadastrado ainda. Use “Novo cliente” para começar.' : 'Nenhum cliente cadastrado ainda.'));
  }

  const LISTAS = [['sobre', 'Sobre'], ['objetivo', 'Objetivo'], ['posicionamento', 'Posicionamento'], ['ideias', 'Ideias'], ['atencao', 'Pontos de atenção'], ['como_agir', 'Como agir']];
  const ABAS = [['geral', 'Visão geral'], ['identidade', 'Identidade visual'], ['onboarding', 'Onboarding e formulário'], ['semana', 'Observações da semana'], ['anotacoes', 'Anotações pessoais'], ['tarefas', 'Tarefas']];

  function fichaCliente(id, aba = 'geral') {
    const c = cliente(id);
    if (!c) return `<a class="back" href="#/clientes">${ic('left')}Clientes</a>` + vazio('Cliente não encontrado.');
    if (!ABAS.some(a => a[0] === aba)) aba = 'geral';
    const notas = (D.notas || []).filter(n => n.cliente_id === c.id);
    const arqs = (D.arquivos || []).filter(a => a.cliente_id === c.id);
    const abertas = D.tarefas.filter(t => t.cliente_id === c.id && t.status !== 'feito');
    const anots = (D.anotacoes || []).filter(n => n.cliente_id === c.id);
    const cont = { semana: notas.length, onboarding: arqs.length, tarefas: abertas.length, anotacoes: anots.filter(n => n.membro_id === D.me.id).length };
    let corpo = '';
    if (aba === 'geral') {
      const plano = conteudo('planos').find(p => p.titulo && c.plano && c.plano.toLowerCase().includes(p.titulo.toLowerCase()));
      const kv = [['Serviço', c.servico], ['Plano', c.plano], ['Status', c.status], ['Nicho', c.nicho], ['Instagram', c.instagram ? '@' + c.instagram : ''], ['Cliente desde', c.desde], ['Aprovação', c.aprovacao], ['Quem aparece', c.aparecem]].filter(x => x[1]);
      corpo = `<div class="ficha">
          ${kv.length ? `<div class="card"><h3>Dados</h3><dl class="kv">${kv.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>` : ''}
          ${plano ? `<div class="card"><h3>O que o ${esc(plano.titulo)} inclui</h3><div class="pre small">${esc(plano.texto || '')}</div><a class="small" href="#/planos">ver todos os planos</a></div>` : ''}
          ${(c.links || []).length ? `<div class="card span2"><h3>Links úteis</h3><div class="links">${c.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${ic(iconeLink(l.url))}${esc(l.titulo || dominio(l.url))}</a>`).join('')}</div></div>` : ''}
          ${c.observacoes ? `<div class="card span2"><h3>Observações sobre o cliente</h3><div class="pre">${esc(c.observacoes)}</div></div>` : ''}
          ${LISTAS.filter(([k]) => (c[k] || []).length).map(([k, t]) => `<div class="card"><h3>${t}</h3><ul>${c[k].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
        </div>` + (!kv.length && !c.observacoes && !(c.links || []).length && !LISTAS.some(([k]) => (c[k] || []).length) ? vazio('Ficha ainda sem informações.') : '');
    } else if (aba === 'identidade') {
      const cs = cores(c.paleta);
      const muda = String(c.tipografia_muda || '');
      corpo = `<div class="ficha">
        <div class="card span2"><h3>Paleta de cores</h3>
          ${cs.length ? `<div class="swatches">${cs.map(x => `<button class="sw" data-act="copiar" data-id="${x}" title="Copiar ${x}"><i style="background:${x}"></i><span>${x}</span></button>`).join('')}</div>` : ''}
          ${c.paleta && c.paleta.replace(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/gi, '').replace(/[\s,;]/g, '') ? `<div class="pre small muted">${esc(c.paleta)}</div>` : ''}
          ${!c.paleta ? '<p class="muted small">Não informada.</p>' : ''}
        </div>
        <div class="card"><h3>Tipo de música</h3><div class="pre">${esc(c.musica) || '<span class="muted small">Não informado.</span>'}</div></div>
        <div class="card"><h3>Tipografia</h3><dl class="kv"><dt>Feed</dt><dd>${esc(c.tipografia_feed) || '—'}</dd><dt>Story</dt><dd>${esc(c.tipografia_story) || '—'}</dd>
          <dt>Canva × CapCut</dt><dd>${muda ? (/^sim/i.test(muda) ? `<span class="tag warn">Muda</span> ${esc(muda.replace(/^sim\s*[—:-]?\s*/i, ''))}` : '<span class="tag ok">Mesma tipografia</span>') : '—'}</dd></dl></div>
      </div>`;
    } else if (aba === 'onboarding') {
      const grupo = (tipo, titulo) => {
        const l = arqs.filter(a => a.tipo === tipo);
        return `<div class="card"><h3>${titulo}</h3>${l.map(a => `<div class="arq"><button class="arq-open" data-act="pdfAbrir" data-id="${a.id}">${ic('file', 18)}<span><b>${esc(a.nome)}</b><small>${(a.tamanho / 1048576).toFixed(1).replace('.', ',')} MB · ${dataBr((a.criado_em || '').slice(0, 10))}</small></span></button>${edita('gerenciar_clientes') ? `<button class="icon-btn" data-act="pdfExcluir" data-id="${a.id}" title="Remover">${ic('trash')}</button>` : ''}</div>`).join('') || '<p class="muted small">Nenhum arquivo.</p>'}</div>`;
      };
      corpo = (edita('gerenciar_clientes') ? `<div class="upl"><select id="uplTipo" aria-label="Tipo de arquivo"><option value="onboarding">Onboarding</option><option value="formulario">Formulário</option><option value="outro">Outro</option></select>
          <label class="btn btn-primary">${ic('upload')}<span>Anexar PDF</span><input type="file" id="uplArq" accept="application/pdf" hidden></label><span class="small muted" id="uplMsg">Até 25 MB.</span></div>` : '') +
        `<div class="ficha">${grupo('onboarding', 'Onboarding')}${grupo('formulario', 'Formulário')}${arqs.some(a => a.tipo === 'outro') ? grupo('outro', 'Outros') : ''}</div>
        <p class="small muted" style="margin-top:.8rem">${ic('lock', 12)} Os PDFs abrem só para visualização dentro do painel.</p>`;
      posRender.push(v => { const f = v.querySelector('#uplArq'); if (f) f.addEventListener('change', () => enviarPdf(c.id, f)); });
    } else if (aba === 'semana') {
      const grupos = {};
      notas.forEach(n => { const k = ymd(segundaDe(new Date(n.criado_em))); (grupos[k] = grupos[k] || []).push(n); });
      corpo = `<div class="card nota-nova"><form id="notaForm" class="form">
          <div class="seg small-seg"><label><input type="radio" name="tipo" value="observacao" checked><span>Observação da semana</span></label><label><input type="radio" name="tipo" value="solicitacao"><span>Pedido fora do combinado</span></label></div>
          <textarea name="texto" maxlength="2000" required placeholder="Como foi a semana com o cliente? O que ele pediu?"></textarea>
          <div class="r"><button class="btn btn-primary" type="submit">${ic('note')}<span>Registrar</span></button></div></form></div>` +
        (Object.keys(grupos).length ? Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0])).map(([k, l]) =>
          `<h2 class="sec">Semana de ${dataBr(k)} a ${dataBr(ymd(somaDias(parseYmd(k), 6)))}</h2><div class="items">${l.map(n => `<div class="item nota ${n.tipo}">
            <div class="t">${n.tipo === 'solicitacao' ? '<span class="tag warn">Fora do combinado</span>' : '<span class="tag">Observação</span>'}<span class="small muted">${esc(nomeMembro(n.membro_id))} · ${dataHoraBr(n.criado_em)}</span>
            ${n.membro_id === D.me.id || edita('editar_clientes') ? `<button class="icon-btn sm" data-act="notaExcluir" data-id="${n.id}" title="Excluir">${ic('trash', 15)}</button>` : ''}</div>
            <div class="d">${esc(n.texto)}</div></div>`).join('')}</div>`).join('') : vazio('Nenhuma observação ainda.'));
      posRender.push(v => {
        const f = v.querySelector('#notaForm');
        if (f) f.addEventListener('submit', async e => {
          e.preventDefault();
          const b = f.querySelector('button'); b.disabled = true;
          try {
            const j = await acao('nota_salvar', { row: { cliente_id: c.id, tipo: f.tipo.value, texto: f.texto.value } });
            D.notas = [j.row].concat(D.notas || []);
            toast('Registrado.'); render(true);
          } catch (er) { if (er.message !== 'sessao') toast(er.message); b.disabled = false; }
        });
      });
    } else if (aba === 'anotacoes') {
      const minhas = anots.filter(n => n.membro_id === D.me.id);
      const outras = D.me.dono ? anots.filter(n => n.membro_id !== D.me.id) : [];
      const cartao = (n, minha) => `<div class="item anot">
        <div class="t"><span class="small muted">${minha ? 'Você' : esc(nomeMembro(n.membro_id))} · ${dataHoraBr(n.atualizado_em)}</span>
        ${minha ? `<span class="acts-inline"><button class="icon-btn sm" data-act="anotEditar" data-id="${n.id}" title="Editar">${ic('edit', 14)}</button><button class="icon-btn sm" data-act="anotExcluir" data-id="${n.id}" title="Excluir">${ic('trash', 14)}</button></span>` : ''}</div>
        <div class="d">${esc(n.texto)}</div></div>`;
      corpo = `<div class="aviso-priv">${ic('lock', 14)}<span>${D.me.dono ? 'Suas anotações pessoais. Abaixo, você (dono) também vê as anotações de cada pessoa da equipe sobre este cliente.' : 'Suas anotações pessoais sobre este cliente. Ninguém da equipe vê — só você e a direção.'}</span></div>
        <div class="card nota-nova"><form id="anotForm" class="form">
          <textarea name="texto" maxlength="4000" required placeholder="Ex.: prefere ser chamada por áudio, gosta de referências minimalistas…"></textarea>
          <div class="r"><button class="btn btn-primary" type="submit">${ic('note')}<span>Salvar anotação</span></button></div></form></div>` +
        (minhas.length ? `<h2 class="sec">Minhas anotações <span class="count">${minhas.length}</span></h2><div class="items">${minhas.map(n => cartao(n, true)).join('')}</div>` : vazio('Você ainda não tem anotações sobre este cliente.')) +
        (D.me.dono ? `<h2 class="sec">Anotações da equipe <span class="count">${outras.length}</span></h2>` + (outras.length ? `<div class="items">${outras.map(n => cartao(n, false)).join('')}</div>` : vazio('Ninguém da equipe fez anotações sobre este cliente.')) : '');
      posRender.push(v => {
        const f = v.querySelector('#anotForm');
        if (f) f.addEventListener('submit', async e => {
          e.preventDefault();
          const b = f.querySelector('button'); b.disabled = true;
          try {
            const j = await acao('anotacao_salvar', { cliente_id: c.id, texto: f.texto.value });
            D.anotacoes = [j.row].concat(D.anotacoes || []);
            toast('Anotação salva.'); render(true);
          } catch (er) { if (er.message !== 'sessao') toast(er.message); b.disabled = false; }
        });
      });
    } else if (aba === 'tarefas') {
      const pubs = D.publicacoes.filter(p => p.cliente_id === c.id && p.data >= hoje()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
      const evs = (D.eventos || []).filter(e => e.cliente_id === c.id && e.data >= hoje());
      corpo = `<div class="ph-row"><h2 class="sec">Tarefas abertas</h2>${btn('tarefaNovaCliente', 'Nova tarefa', 'plus', 'btn-sm', c.id)}</div>` +
        (abertas.length ? `<div class="grid">${abertas.sort(ordemPrazo).map(cartaoTarefa).join('')}</div>` : vazio('Nenhuma tarefa aberta para este cliente.')) +
        (evs.length ? `<h2 class="sec">Próximos eventos</h2><div class="grid">${evs.map(cartaoEvento).join('')}</div>` : '') +
        `<h2 class="sec">Próximas publicações</h2>` + (pubs.length ? `<div class="grid">${pubs.map(p => `<div><div class="small muted" style="margin-bottom:.25rem">${dataBr(p.data)}</div>${cartaoPub(p)}</div>`).join('')}</div>` : vazio('Nada programado.'));
    }
    return `<a class="back" href="#/clientes">${ic('left')}Clientes</a>` +
      cab(c.nome, `${tagSaude(c.saude)} ${c.plano ? `<span class="tag">${esc(c.plano)}</span>` : ''} ${c.rede ? '<span class="tag info">Rede Conceito</span>' : ''} ${c.resumo ? `<span class="sub-r">${esc(c.resumo)}</span>` : ''}`,
        (edita('editar_clientes') ? btn('clienteEditar', 'Editar ficha', 'edit', 'btn-primary', c.id) : '')) +
      `<nav class="tabs">${ABAS.map(([k, t]) => `<a href="#/cliente/${c.id}/${k}" class="${aba === k ? 'on' : ''}">${t}${cont[k] ? ` <span class="count">${cont[k]}</span>` : ''}</a>`).join('')}</nav>` + corpo;
  }
  const dominio = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
  const iconeLink = u => (/drive\.google|docs\.google/.test(u) ? 'file' : /trello|notion|asana|clickup/.test(u) ? 'board' : 'link');
  const segundaDe = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };

  function formCliente(c = {}) {
    const lista = k => esc((c[k] || []).join('\n'));
    const muda = String(c.tipografia_muda || '');
    const mudaSim = /^sim/i.test(muda);
    const planos = conteudo('planos').map(p => p.titulo).filter(Boolean);
    modal(c.id ? 'Editar ficha' : 'Novo cliente', `
      <input type="hidden" name="id" value="${esc(c.id || '')}">
      <div class="sep first">Dados principais</div>
      <div class="two">
        <label>Nome<input name="nome" maxlength="120" required value="${esc(c.nome || '')}"></label>
        <label>Nicho<input name="nicho" maxlength="60" value="${esc(c.nicho || '')}"></label>
      </div>
      <div class="two">
        <label>Serviço<input name="servico" maxlength="300" value="${esc(c.servico || '')}" placeholder="Social media, vídeos, identidade…"></label>
        <label>Plano<input name="plano" maxlength="120" value="${esc(c.plano || '')}" list="planosList" placeholder="P1, P2, P3…"><datalist id="planosList">${planos.map(p => `<option>${esc(p)}</option>`).join('')}</datalist></label>
      </div>
      <div class="two">
        <label>Saúde<select name="saude">${opcoes(Object.entries(SAUDE).map(([k, v]) => [k, v[0]]), c.saude || 'avaliar')}</select></label>
        <label>Status<input name="status" maxlength="60" value="${esc(c.status || 'Ativo')}"></label>
      </div>
      <div class="two">
        <label>Instagram<input name="instagram" maxlength="60" placeholder="@perfil" value="${esc(c.instagram || '')}"></label>
        <label>Cliente desde<input name="desde" maxlength="40" value="${esc(c.desde || '')}" placeholder="ex.: março/2026"></label>
      </div>
      <div class="two">
        <label>Aprovação<input name="aprovacao" maxlength="300" placeholder="Quem aprova e como" value="${esc(c.aprovacao || '')}"></label>
        <label>Quem aparece<input name="aparecem" maxlength="300" value="${esc(c.aparecem || '')}"></label>
      </div>
      <label>Resumo<textarea name="resumo" maxlength="600" style="min-height:60px">${esc(c.resumo || '')}</textarea></label>
      <label class="inline"><input type="checkbox" name="rede"${c.rede ? ' checked' : ''}> Faz parte da Rede Conceito</label>
      <div class="sep">Identidade visual</div>
      <label>Paleta de cores <span class="hint">(códigos como #6E2C14, separados por vírgula — aparecem como amostras)</span><input name="paleta" maxlength="400" value="${esc(c.paleta || '')}" placeholder="#6E2C14, #C4673A, #F6EFE6"><div class="sw-prev" data-prev></div></label>
      <label>Tipo de música<input name="musica" maxlength="300" value="${esc(c.musica || '')}" placeholder="Ex.: pop acústico, lo-fi, sertanejo animado"></label>
      <div class="two">
        <label>Tipografia do feed<input name="tipografia_feed" maxlength="200" value="${esc(c.tipografia_feed || '')}"></label>
        <label>Tipografia do story<input name="tipografia_story" maxlength="200" value="${esc(c.tipografia_story || '')}"></label>
      </div>
      <div class="two">
        <label>Muda a tipografia entre Canva e CapCut?<select name="_muda"><option value="">Não informado</option><option value="nao"${muda && !mudaSim ? ' selected' : ''}>Não, é a mesma</option><option value="sim"${mudaSim ? ' selected' : ''}>Sim, muda</option></select></label>
        <label>Se muda, como?<input name="_muda_det" maxlength="300" value="${esc(mudaSim ? muda.replace(/^sim\s*[—:-]?\s*/i, '') : '')}" placeholder="Ex.: no CapCut usar Montserrat"></label>
      </div>
      <label>Observações sobre o cliente<textarea name="observacoes" maxlength="3000">${esc(c.observacoes || '')}</textarea></label>
      <label>Links úteis <span class="hint">(um por linha: nome | link — ex.: Trello | https://trello.com/…)</span><textarea name="_links" placeholder="Trello | https://trello.com/b/…&#10;Drive | https://drive.google.com/…">${esc((c.links || []).map(l => (l.titulo ? l.titulo + ' | ' : '') + l.url).join('\n'))}</textarea></label>
      <div class="sep">Estratégia <span class="hint">(um item por linha)</span></div>
      ${LISTAS.map(([k, t]) => `<label>${t}<textarea name="${k}" style="min-height:70px">${lista(k)}</textarea></label>`).join('')}`,
    async f => {
      f.tipografia_muda = f._muda === 'sim' ? ('Sim' + (f._muda_det ? ' — ' + f._muda_det : '')) : f._muda === 'nao' ? 'Não' : '';
      delete f._muda; delete f._muda_det;
      f.links = String(f._links || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
        const m = l.match(/^(.*?)\s*[|–-]\s*(https?:\/\/\S+)$/i) || l.match(/^()(https?:\/\/\S+)$/i);
        if (!m) throw new Error(`Link inválido: "${l}". Use: nome | https://…`);
        return { titulo: m[1].trim(), url: m[2] };
      });
      delete f._links;
      const j = await acao('cliente_salvar', { row: f });
      aplicar('clientes', j.row);
      if (!c.id) location.hash = '#/cliente/' + j.row.id;
      toast('Cliente salvo.');
    },
    Object.assign({ wide: true, setup: form => {
      const inp = form.querySelector('[name=paleta]'), prev = form.querySelector('[data-prev]');
      const upd = () => { prev.innerHTML = cores(inp.value).map(x => `<i style="background:${x}" title="${x}"></i>`).join(''); };
      inp.addEventListener('input', upd); upd();
    } }, c.id && edita('gerenciar_clientes') ? { onDelete: async () => { await acao('cliente_excluir', { id: c.id }); aplicar('clientes', c, true); location.hash = '#/clientes'; toast('Cliente removido.'); }, delLabel: 'Remover cliente', confirmDel: `Remover ${c.nome} da lista de clientes?` } : {}));
  }

  /* ---------------- PDF: envio em partes e visualização sem download ---------------- */
  async function enviarPdf(clienteId, input) {
    const file = input.files && input.files[0];
    const msg = $('#uplMsg');
    if (!file) return;
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) { toast('Escolha um arquivo PDF.'); input.value = ''; return; }
    if (file.size > 25 * 1048576) { toast('O PDF pode ter no máximo 25 MB.'); input.value = ''; return; }
    const tipo = $('#uplTipo').value;
    const PARTE = 1536 * 1024;
    const b64 = buf => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
    input.disabled = true;
    try {
      let id = null;
      for (let off = 0; off < file.size; off += PARTE) {
        msg.textContent = `Enviando… ${Math.round(off / file.size * 100)}%`;
        const parte = b64(await file.slice(off, off + PARTE).arrayBuffer());
        if (!id) id = (await acao('arquivo_inicio', { cliente_id: clienteId, tipo, nome: file.name, tamanho: file.size, parte })).id;
        else await acao('arquivo_parte', { id, parte });
      }
      const j = await acao('arquivo_fim', { id });
      D.arquivos = [j.row].concat(D.arquivos || []);
      toast('PDF anexado.');
      render(true);
    } catch (e) {
      if (e.message !== 'sessao') { msg.textContent = e.message; toast(e.message); }
    } finally { input.disabled = false; input.value = ''; }
  }

  let pdfjs = null;
  function carregarPdfJs() {
    if (pdfjs) return pdfjs;
    pdfjs = new Promise((ok, falha) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; ok(window.pdfjsLib); };
      s.onerror = () => { pdfjs = null; falha(new Error('Não foi possível carregar o leitor de PDF.')); };
      document.head.appendChild(s);
    });
    return pdfjs;
  }

  async function abrirPdf(id) {
    const a = (D.arquivos || []).find(x => x.id === id);
    if (!a) return;
    const ov = document.createElement('div');
    ov.className = 'overlay pdf-ov';
    ov.innerHTML = `<div class="pdf-box" role="dialog" aria-modal="true"><div class="pdf-bar"><b>${esc(a.nome)}</b><span class="small muted" data-st>Abrindo…</span><button class="icon-btn" data-x aria-label="Fechar">✕</button></div><div class="pdf-pages" oncontextmenu="return false"></div></div>`;
    const fechar = () => { ov.remove(); document.removeEventListener('keydown', tecla); };
    const tecla = e => { if (e.key === 'Escape') fechar(); if ((e.ctrlKey || e.metaKey) && /^[sp]$/i.test(e.key)) e.preventDefault(); };
    document.addEventListener('keydown', tecla);
    ov.querySelector('[data-x]').addEventListener('click', fechar);
    ov.addEventListener('mousedown', e => { if (e.target === ov) fechar(); });
    document.body.appendChild(ov);
    const st = ov.querySelector('[data-st]'), pages = ov.querySelector('.pdf-pages');
    try {
      const lib = await carregarPdfJs();
      const partes = [];
      let off = 0, total = 1;
      while (off < total) {
        const { status, j } = await api(`/api/arquivo?id=${encodeURIComponent(id)}&offset=${off}`);
        if (status === 401) { fechar(); return mostrarLogin('Sua sessão expirou. Entre de novo.'); }
        if (!j.ok) throw new Error(j.erro || 'Erro ao abrir o arquivo.');
        const bin = atob(j.parte); const u = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
        partes.push(u); total = j.total; off += u.length;
        st.textContent = `Abrindo… ${Math.round(off / total * 100)}%`;
        if (!u.length) break;
      }
      const dados = new Uint8Array(off); let p = 0;
      partes.forEach(u => { dados.set(u, p); p += u.length; });
      const doc = await lib.getDocument({ data: dados }).promise;
      st.textContent = `${doc.numPages} página${doc.numPages === 1 ? '' : 's'}`;
      const largura = Math.min(pages.clientWidth - 24, 900);
      for (let n = 1; n <= doc.numPages; n++) {
        if (!document.body.contains(ov)) return;
        const pg = await doc.getPage(n);
        const vp1 = pg.getViewport({ scale: 1 });
        const escala = largura / vp1.width;
        const vp = pg.getViewport({ scale: escala * (window.devicePixelRatio || 1) });
        const cv = document.createElement('canvas');
        cv.width = vp.width; cv.height = vp.height;
        cv.style.width = largura + 'px';
        pages.appendChild(cv);
        await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
      }
    } catch (e) { st.textContent = e.message; }
  }

  /* ---------------- CONTEÚDO (blocos editáveis) ---------------- */
  const BLOCOS = {
    jornada: { t: 'Jornada do cliente', campos: ['titulo', 'quem', 'texto'] },
    producao: { t: 'Fluxo de produção', campos: ['titulo', 'quem', 'texto'] },
    stories: { t: 'Stories', campos: ['titulo', 'quem', 'texto'] },
    qa: { t: 'Checklist de qualidade', campos: ['titulo', 'texto'] },
    padroes: { t: 'Padrões', campos: ['titulo', 'texto'] },
    nichos: { t: 'Playbook por nicho', campos: ['titulo', 'texto'] },
    papeis: { t: 'Divisão de papéis', campos: ['titulo', 'texto'] },
    planos: { t: 'Planos', campos: ['titulo', 'texto'] },
    boasPraticas: { t: 'Boas práticas', campos: ['titulo', 'categoria', 'texto'] },
    rituais: { t: 'Rituais da semana', campos: ['titulo', 'quando', 'texto'] },
    links: { t: 'Atalhos', campos: ['titulo', 'url'] },
    redeConceito: { t: 'Rede Conceito', campos: ['titulo', 'texto'] }
  };
  const PERM_BLOCO = {
    jornada: 'editar_fluxograma', producao: 'editar_fluxograma', stories: 'editar_fluxograma',
    qa: 'editar_processos', padroes: 'editar_processos', nichos: 'editar_processos', papeis: 'editar_processos', planos: 'editar_processos',
    boasPraticas: 'editar_praticas', rituais: 'editar_inicio', links: 'editar_inicio', redeConceito: 'editar_inicio'
  };
  const ROTULO = { titulo: 'Título', texto: 'Texto', categoria: 'Categoria', quando: 'Quando', url: 'Endereço (https://…)', quem: 'Quem executa (função)' };

  const itemHtml = it => `<div class="item"><div class="t">${esc(it.titulo)}${lock(it)}</div>${it.texto ? `<div class="d">${esc(it.texto)}</div>` : ''}</div>`;
  const secBloco = (k, corpo) => `<h2 class="sec">${BLOCOS[k].t} ${edita(PERM_BLOCO[k]) ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', k) : ''}</h2>${corpo}`;
  const itens = k => { const l = conteudo(k); return l.length ? `<div class="items">${l.map(itemHtml).join('')}</div>` : vazio('Nada cadastrado ainda.'); };

  // Fluxograma de verdade: balões ligados por linhas (SVG), redesenhado ao mudar o tamanho da tela
  function fluxo(k, lista) {
    const l = lista || conteudo(k);
    if (!l.length) return vazio('Nada cadastrado ainda.');
    const minha = (D.me.funcao || '').toLowerCase();
    return `<div class="fc" data-fc>
      <svg class="fc-lines" aria-hidden="true"></svg>
      ${l.map((s, i) => {
        const meu = s.quem && minha && s.quem.toLowerCase().split(/[,/]| e /).some(q => q.trim() && (minha.includes(q.trim()) || q.trim().includes(minha)));
        return `<div class="fc-node${meu ? ' mine' : ''}" data-i="${i}" tabindex="0">
          <div class="fc-n">${pad(i + 1)}</div>
          <div class="fc-t">${esc(s.titulo)} ${lock(s)}</div>
          ${s.quem ? `<div class="fc-q">${ic('user', 12)}${esc(s.quem)}</div>` : ''}
          ${s.texto ? `<div class="fc-d">${esc(s.texto)}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }
  function desenharFluxos(raiz) {
    raiz.querySelectorAll('[data-fc]').forEach(fc => {
      const svg = fc.querySelector('svg');
      const nodes = [...fc.querySelectorAll('.fc-node')];
      const R = fc.getBoundingClientRect();
      svg.setAttribute('width', R.width); svg.setAttribute('height', R.height);
      svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
      const ds = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i].getBoundingClientRect(), b = nodes[i + 1].getBoundingClientRect();
        const ax = a.left - R.left, ay = a.top - R.top, bx = b.left - R.left, by = b.top - R.top;
        if (Math.abs(ay - by) < 8) { // mesma linha: liga lado a lado
          const x1 = ax + a.width, y1 = ay + a.height / 2, x2 = bx, y2 = by + b.height / 2;
          const mx = (x1 + x2) / 2;
          ds.push(`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 6},${y2}`);
        } else { // quebra de linha: desce do fim de uma e entra no começo da outra
          const x1 = ax + a.width / 2, y1 = ay + a.height, x2 = bx + b.width / 2, y2 = by;
          const my = y1 + (y2 - y1) / 2, r = Math.min(12, Math.abs(y2 - y1) / 4, Math.abs(x1 - x2) / 2), dir = x2 < x1 ? -1 : 1;
          ds.push(Math.abs(x1 - x2) < 2 ? `M${x1},${y1} V${y2 - 6}`
            : `M${x1},${y1} V${my - r} Q${x1},${my} ${x1 + dir * r},${my} H${x2 - dir * r} Q${x2},${my} ${x2},${my + r} V${y2 - 6}`);
        }
      }
      svg.innerHTML = `<defs><marker id="seta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>` +
        ds.map(d => `<path d="${d}" marker-end="url(#seta)"/>`).join('');
    });
  }
  let rzT;
  addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => desenharFluxos(document), 120); });

  function fluxograma() {
    posRender.push(v => requestAnimationFrame(() => desenharFluxos(v)));
    return cab('Fluxograma', `Como o trabalho anda e quem executa cada etapa.${D.me.funcao ? ` Etapas destacadas são da sua função (${esc(D.me.funcao)}).` : ''}`) +
      secBloco('jornada', fluxo('jornada')) + secBloco('producao', fluxo('producao')) + secBloco('stories', fluxo('stories')) +
      conteudo('fluxosExtras').map((f, i) => `<h2 class="sec">${esc(f.titulo)} ${lock(f)}${edita('editar_fluxograma') ? `<span class="acts-inline">${btn('fluxoEditar', 'Editar', 'edit', 'btn-sm btn-ghost', String(i))}</span>` : ''}</h2>${fluxo(null, f.etapas || [])}`).join('') +
      (edita('editar_fluxograma') ? `<div class="novo-fluxo">${btn('fluxoEditar', 'Criar novo fluxograma', 'plus', 'btn-primary', 'novo')}</div>` : '');
  }
  // Fluxogramas criados pela gestão (além de jornada, produção e stories)
  function editarFluxoExtra(idx) {
    const extras = conteudo('fluxosExtras').map(f => JSON.parse(JSON.stringify(f)));
    const novo = idx === 'novo';
    const f = novo ? { titulo: '', etapas: [{}, {}] } : extras[+idx];
    editorLista({
      titulo: novo ? 'Novo fluxograma' : `Editar: ${f.titulo}`,
      campos: ['titulo', 'quem', 'texto'], itens: f.etapas || [],
      topo: `<label>Nome do fluxograma<input data-nome maxlength="80" required value="${esc(f.titulo || '')}" placeholder="Ex.: Fluxo de captação"></label>${can('ver_restrito') ? `<label class="inline"><input type="checkbox" data-restr${f.restrito ? ' checked' : ''}> Restrito</label>` : ''}<div class="lbl">Etapas, na ordem</div>`,
      apagar: novo ? null : async () => { extras.splice(+idx, 1); await acao('conteudo_salvar', { chave: 'fluxosExtras', valor: extras }); D.conteudo.fluxosExtras = extras; toast('Fluxograma apagado.'); },
      salvar: async (etapas, form) => {
        const titulo = form.querySelector('[data-nome]').value.trim();
        if (!titulo) throw new Error('Dê um nome ao fluxograma.');
        if (!etapas.length) throw new Error('Adicione pelo menos uma etapa.');
        const item = { titulo, etapas };
        const r = form.querySelector('[data-restr]');
        if (r && r.checked) item.restrito = true;
        if (novo) extras.push(item); else extras[+idx] = item;
        await acao('conteudo_salvar', { chave: 'fluxosExtras', valor: extras });
        D.conteudo.fluxosExtras = extras;
        toast('Fluxograma salvo.');
      }
    });
  }

  const qaChave = () => 'sp_qa_' + D.me.id;
  const qaLer = () => { try { return JSON.parse(localStorage.getItem(qaChave()) || '[]'); } catch { return []; } };
  const qaFeito = n => qaLer().includes(n);
  function qaMarcar(n, on) {
    const l = new Set(qaLer()); on ? l.add(n) : l.delete(n);
    try { localStorage.setItem(qaChave(), JSON.stringify([...l])); } catch {}
  }
  function processos() {
    posRender.push(v => v.querySelectorAll('[data-qa]').forEach(c => c.addEventListener('change', () => { qaMarcar(+c.dataset.qa, c.checked); render(true); })));
    const qa = conteudo('qa');
    return cab('Processos', 'Padrões que garantem a qualidade das entregas.') +
      secBloco('qa', qa.length ? `<div class="items">${qa.map((i, n) => `<label class="item check${qaFeito(n) ? ' feito' : ''}"><input type="checkbox" data-qa="${n}"${qaFeito(n) ? ' checked' : ''}><span class="box">${ic('check', 13)}</span><div><div class="t">${esc(i.titulo)}${lock(i)}</div>${i.texto ? `<div class="d">${esc(i.texto)}</div>` : ''}</div></label>`).join('')}</div>
        <div class="qa-foot"><span class="small muted">${qa.filter((_, n) => qaFeito(n)).length} de ${qa.length} conferidos · fica salvo só para você</span>${btn('qaLimpar', 'Recomeçar checklist', '', 'btn-sm btn-ghost')}</div>` : vazio('Nada cadastrado ainda.')) +
      secBloco('padroes', itens('padroes')) + secBloco('nichos', itens('nichos')) + secBloco('papeis', itens('papeis'));
  }

  function planos() {
    const l = conteudo('planos');
    return cab('Planos', 'O que cada plano inclui, para todos saberem o que foi combinado com o cliente.', edita('editar_processos') ? btn('editarBloco', 'Editar planos', 'edit', 'btn-primary', 'planos') : '') +
      (l.length ? `<div class="plans">${l.map((p, i) => {
        const n = D.clientes.filter(c => c.plano && p.titulo && c.plano.toLowerCase().includes(p.titulo.toLowerCase())).length;
        return `<div class="card plan p${(i % 3) + 1}"><div class="plan-h"><b>${esc(p.titulo)}</b>${n ? `<span class="tag">${n} cliente${n === 1 ? '' : 's'}</span>` : ''}</div>
          <ul>${String(p.texto || '').split('\n').map(x => x.trim()).filter(Boolean).map(x => `<li>${esc(x.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul></div>`;
      }).join('')}</div><p class="small muted" style="margin-top:.8rem">Dica: escreva um item por linha.</p>` : vazio('Nenhum plano cadastrado.'));
  }

  function praticas() {
    const l = conteudo('boasPraticas');
    const grupos = {};
    l.forEach(p => { (grupos[p.categoria || 'Geral'] = grupos[p.categoria || 'Geral'] || []).push(p); });
    return cab('Boas práticas', 'O jeito Studio Pulga de trabalhar.', edita('editar_praticas') ? btn('editarBloco', 'Editar', 'edit', 'btn-primary', 'boasPraticas') : '') +
      (l.length ? Object.entries(grupos).map(([g, arr]) => `<h2 class="sec">${esc(g)}</h2><div class="items">${arr.map(itemHtml).join('')}</div>`).join('') : vazio('Nenhuma prática cadastrada ainda.'));
  }

  function editarBloco(k) {
    const cfg = BLOCOS[k];
    if (!cfg) return;
    editorLista({
      titulo: `Editar: ${cfg.t}`, campos: cfg.campos, itens: conteudo(k),
      salvar: async valor => {
        if (k === 'links' && valor.some(l => !/^https?:\/\//.test(l.url))) throw new Error('Os endereços dos atalhos precisam começar com https://');
        await acao('conteudo_salvar', { chave: k, valor });
        D.conteudo[k] = valor;
        toast('Conteúdo salvo.');
      }
    });
  }

  // Editor de listas (itens com subir/descer/excluir) usado pelos blocos de conteúdo e pelos fluxogramas
  function editorLista({ titulo, campos, itens, topo = '', salvar, apagar }) {
    const lista = (itens || []).map(x => Object.assign({}, x));
    const podeRestrito = can('ver_restrito');
    const linhas = () => lista.map((it, i) => `<div class="ed-row" data-i="${i}">
      <div class="fs">${campos.map(c => c === 'texto'
        ? `<textarea data-c="texto" placeholder="${ROTULO[c]}" style="min-height:64px">${esc(it.texto || '')}</textarea>`
        : `<input data-c="${c}" placeholder="${ROTULO[c]}" value="${esc(it[c] || '')}"${c === 'quem' ? ' list="funcoesList"' : ''}>`).join('')}
        ${podeRestrito ? `<label class="chk"><input type="checkbox" data-c="restrito"${it.restrito ? ' checked' : ''}> Restrito (só quem tem acesso a conteúdo restrito vê)</label>` : ''}
      </div>
      <div class="side-acts">
        <button type="button" class="icon-btn" data-mv="-1" title="Subir">${ic('up')}</button>
        <button type="button" class="icon-btn" data-mv="1" title="Descer">${ic('down')}</button>
        <button type="button" class="icon-btn" data-rm title="Excluir">${ic('trash')}</button>
      </div></div>`).join('') || '<div class="empty small">Nenhum item. Use “Adicionar item”.</div>';
    const ler = form => form.querySelectorAll('.ed-row').forEach(r => {
      const it = lista[+r.dataset.i];
      r.querySelectorAll('[data-c]').forEach(el => { it[el.dataset.c] = el.type === 'checkbox' ? el.checked : el.value; });
    });
    modal(titulo, `<datalist id="funcoesList">${funcoes().map(f => `<option>${esc(f)}</option>`).join('')}</datalist>${topo}<div class="ed-list"></div><button type="button" class="btn btn-ghost" data-add>${ic('plus')}Adicionar item</button>`,
      async (_, form) => {
        ler(form);
        const valor = lista.map(it => {
          const o = {};
          campos.forEach(c => { o[c] = String(it[c] || '').trim(); });
          if (it.restrito) o.restrito = true;
          return o;
        }).filter(o => o.titulo);
        await salvar(valor, form);
      },
      Object.assign({ wide: true, setup: form => {
        const box = form.querySelector('.ed-list');
        const desenhar = () => { box.innerHTML = linhas(); };
        desenhar();
        form.querySelector('[data-add]').addEventListener('click', () => { ler(form); lista.push({}); desenhar(); const r = box.lastElementChild; if (r) r.querySelector('input,textarea').focus(); });
        box.addEventListener('click', e => {
          const b = e.target.closest('button');
          if (!b) return;
          ler(form);
          const i = +b.closest('.ed-row').dataset.i;
          if (b.hasAttribute('data-rm')) lista.splice(i, 1);
          else { const j = i + Number(b.dataset.mv); if (j >= 0 && j < lista.length) [lista[i], lista[j]] = [lista[j], lista[i]]; }
          desenhar();
        });
      } }, apagar ? { onDelete: apagar, delLabel: 'Apagar fluxograma', confirmDel: 'Apagar este fluxograma inteiro?' } : {}));
  }


  /* ---------------- EQUIPE ---------------- */
  const PERMS_ADMIN = ['acesso_gestao', 'gerenciar_equipe'];
  const ehAdmin = m => !!m && (m.dono || (m.permissoes || []).some(p => PERMS_ADMIN.includes(p)));
  // Dono edita todos; quem gerencia a equipe sem ser dono edita só colaboradores (nunca a si mesmo nem administradores)
  const podeEditarMembro = m => can('gerenciar_equipe') && (D.me.dono || (m.id !== D.me.id && !ehAdmin(m)));
  function equipe() {
    const gere = can('gerenciar_equipe');
    const nomesPerm = Object.fromEntries((D.permissoes || []).map(p => [p.k, p.t]));
    const grupos = {};
    [...D.membros].sort((a, b) => (a.ordem - b.ordem) || a.nome.localeCompare(b.nome)).forEach(m => { const g = FUNCOES.includes(m.funcao) ? m.funcao : 'Gestão'; (grupos[g] = grupos[g] || []).push(m); });
    return cab(gere ? 'Equipe e acessos' : 'Equipe', gere ? 'Cadastre a equipe, crie logins e defina o que cada um pode fazer.' : 'Quem faz parte do Studio Pulga.',
      gere ? btn('membroNovo', 'Novo membro', 'plus', 'btn-primary') : '') +
      Object.entries(grupos).map(([g, l]) => `<h2 class="sec">${esc(g)} <span class="count">${l.length}</span></h2><div class="grid">${l.map(m => `<div class="card">
        <div class="mem"><div class="avatar">${esc(iniciais(m.nome))}</div><div style="flex:1;min-width:0"><div class="nm">${esc(m.nome)}</div><div class="small muted">${esc(m.funcao || '')}</div></div>
        ${gere && podeEditarMembro(m) ? `<button class="icon-btn" data-act="membroEditar" data-id="${m.id}" title="Editar">${ic('edit')}</button>` : gere && ehAdmin(m) && !m.dono ? `<span class="tag" title="Só o dono altera administradores">${ic('lock', 11)}Admin</span>` : ''}</div>
        ${gere ? `<div class="small muted" style="margin-top:.5rem">Usuário: <b>${esc(m.usuario || '')}</b>${m.email ? ` · ${esc(m.email)}` : ''}</div>
          <div class="perms">${m.dono ? '<span class="tag ok">Dono · acesso total</span>' : (m.permissoes || []).length ? m.permissoes.map(p => `<span class="tag">${esc(nomesPerm[p] || p)}</span>`).join('') : '<span class="tag">Só o site da equipe</span>'}</div>` : ''}
      </div>`).join('')}</div>`).join('');
  }

  function formMembro(m = {}) {
    const perms = D.permissoes || [];
    const tem = new Set(m.permissoes || []);
    let grupo = '';
    const lista = perms.map(p => {
      const g = p.grupo !== grupo ? `<div class="g">${esc((grupo = p.grupo))}</div>` : '';
      const travada = !D.me.dono && PERMS_ADMIN.includes(p.k);
      return g + `<label class="${travada ? 'travada' : ''}"><input type="checkbox" name="perm" value="${p.k}" data-multi="1"${tem.has(p.k) ? ' checked' : ''}${m.dono ? ' disabled checked' : travada ? ' disabled' : ''}><div><b>${esc(p.t)}${travada ? ' 🔒' : ''}</b><span>${esc(p.d)}${travada ? ' Só o dono pode dar ou tirar esta permissão.' : ''}</span></div></label>`;
    }).join('');
    modal(m.id ? `Editar ${m.nome}` : 'Novo membro', `
      <input type="hidden" name="id" value="${esc(m.id || '')}">
      <div class="two">
        <label>Nome<input name="nome" maxlength="120" required value="${esc(m.nome || '')}"></label>
        <label>Função<select name="funcao">${opcoes([['', 'Sem função (gestão)'], ...FUNCOES.map(f => [f, f])], FUNCOES.includes(m.funcao) ? m.funcao : '')}</select></label>
      </div>
      <div class="two">
        <label>Usuário (login)<input name="usuario" maxlength="40" required autocapitalize="none" value="${esc(m.usuario || '')}"></label>
        <label>E-mail<input type="email" name="email" maxlength="120" value="${esc(m.email || '')}" placeholder="para avisos de prazo"></label>
      </div>
      <div class="two">
        <label>${m.id ? 'Nova senha <span class="hint">(vazio = manter)</span>' : 'Senha inicial <span class="hint">(mín. 6)</span>'}<input type="text" name="senha" autocomplete="off" ${m.id ? '' : 'required minlength="6"'}></label>
        <label>Ordem na lista<input type="number" name="ordem" value="${esc(m.ordem ?? 0)}"></label>
      </div>
      <div><div class="lbl">Permissões ${m.dono ? '<span class="hint">(dono tem acesso total)</span>' : ''}</div>
        ${m.dono || !D.me.dono ? '' : `<div class="filters tight"><button type="button" class="btn btn-sm" data-adm>${ic('key', 14)}<span>Tornar administrador</span></button><button type="button" class="btn btn-sm btn-ghost" data-colab>Só colaborador</button></div>`}
        <div class="perm-list">${lista}</div></div>`,
    async (f, form) => {
      const permissoes = [...form.querySelectorAll('input[name=perm]:checked:not(:disabled)')].map(c => c.value);
      const row = { id: f.id, nome: f.nome, funcao: f.funcao, usuario: f.usuario, email: f.email, ordem: f.ordem, permissoes: m.dono ? (m.permissoes || []) : permissoes };
      if (row.id && row.id === D.me.id && !m.dono && !permissoes.includes('gerenciar_equipe')) throw new Error('Você não pode tirar de si mesmo a permissão de gerenciar a equipe.');
      const j = await acao('membro_salvar', { row, senha: f.senha });
      aplicar('membros', j.row);
      toast('Membro salvo.');
    },
    Object.assign({ setup: form => {
      const a = form.querySelector('[data-adm]'), c = form.querySelector('[data-colab]');
      // Administrador = todas as permissões de gestão; só o dono decide quem gerencia a equipe e acessos
      if (a) a.addEventListener('click', () => form.querySelectorAll('input[name=perm]').forEach(i => { i.checked = i.value !== 'gerenciar_equipe' || i.checked; }));
      if (c) c.addEventListener('click', () => form.querySelectorAll('input[name=perm]').forEach(i => { i.checked = false; }));
    } }, m.id && !m.dono && m.id !== D.me.id ? { onDelete: async () => { await acao('membro_excluir', { id: m.id }); aplicar('membros', m, true); toast('Membro removido.'); }, delLabel: 'Remover', confirmDel: `Remover ${m.nome}? O login e a senha deixam de funcionar na hora, mesmo se a pessoa estiver com o painel aberto.` } : {}));
  }

  /* ---------------- DESEMPENHO (gestão) ---------------- */
  function desempenho() {
    if (!can('gerenciar_tarefas')) return inicio();
    const dias = Number(S.periodo) || 30;
    const desde = Date.now() - dias * 864e5;
    const doPeriodo = t => new Date(t.criado_em).getTime() >= desde || (t.concluido_em && new Date(t.concluido_em).getTime() >= desde);
    const base = D.tarefas.filter(doPeriodo).filter(t => !S.area || (membro(t.membro_id) || {}).funcao === S.area);
    const calc = lista => {
      const feitas = lista.filter(t => t.status === 'feito' && t.concluido_em);
      const comPrazo = feitas.filter(t => t.prazo);
      const noPrazo = comPrazo.filter(t => ymd(new Date(t.concluido_em)) <= t.prazo).length;
      const tempos = feitas.map(t => new Date(t.concluido_em) - new Date(t.iniciado_em || t.criado_em)).filter(x => x > 0);
      const erros = lista.reduce((n, t) => n + (t.erros || []).length, 0);
      return {
        total: lista.length, feitas: feitas.length,
        prazo: comPrazo.length ? Math.round(noPrazo / comPrazo.length * 100) : null,
        atrasadas: lista.filter(t => sitTarefa(t) === 'atrasada').length,
        andamento: lista.filter(t => t.status === 'fazendo').length,
        tempo: tempos.length ? tempos.reduce((a, b) => a + b, 0) / tempos.length : 0,
        erros, comErro: lista.filter(t => (t.erros || []).length).length
      };
    };
    const g = calc(base);
    const pessoas = [...D.membros].filter(m => !S.area || m.funcao === S.area).sort(porNome)
      .map(m => ({ m, s: calc(base.filter(t => t.membro_id === m.id)) })).filter(x => x.s.total);
    const barra = v => v === null ? '<span class="muted">—</span>' : `<div class="bar"><i style="width:${v}%" class="${v >= 85 ? 'g' : v >= 60 ? 'y' : 'r'}"></i></div><span class="bar-v">${v}%</span>`;
    const errosRec = base.flatMap(t => (t.erros || []).map(e => Object.assign({ t }, e))).sort((a, b) => b.em.localeCompare(a.em)).slice(0, 12);
    return cab('Desempenho', 'Como as atribuições estão sendo executadas: prazos, tempo de execução e erros no caminho.',
      `<select data-set="periodo" aria-label="Período">${opcoes([['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias']], String(dias))}</select><select data-set="area" aria-label="Função">${optAreas(S.area)}</select>`) +
      `<div class="stats">
        <div class="card stat"><div class="n">${g.feitas}<small>/${g.total}</small></div><div class="l">concluídas</div></div>
        <div class="card stat"><div class="n ${g.prazo === null ? '' : g.prazo >= 85 ? 'green-t' : g.prazo >= 60 ? 'yellow-t' : 'red-t'}">${g.prazo === null ? '—' : g.prazo + '%'}</div><div class="l">entregues no prazo</div></div>
        <div class="card stat"><div class="n">${duracao(g.tempo)}</div><div class="l">tempo médio de execução</div></div>
        <div class="card stat"><div class="n ${g.atrasadas ? 'red-t' : ''}">${g.atrasadas}</div><div class="l">${dot('atrasada')}atrasadas agora</div></div>
        <div class="card stat"><div class="n ${g.erros ? 'red-t' : ''}">${g.erros}</div><div class="l">erros registrados</div></div>
      </div>` +
      `<h2 class="sec">Por pessoa</h2>` +
      (pessoas.length ? `<div class="card table-card"><table class="perf"><thead><tr><th>Pessoa</th><th>Concluídas</th><th>No prazo</th><th>Tempo médio</th><th>Em andamento</th><th>Atrasadas</th><th>Erros</th></tr></thead><tbody>
        ${pessoas.map(({ m, s }) => `<tr><td><div class="mem"><span class="avatar xs">${esc(iniciais(m.nome))}</span><span><b>${esc(m.nome)}</b><small class="muted">${esc(m.funcao || '')}</small></span></div></td>
          <td>${s.feitas}/${s.total}</td><td class="bar-td">${barra(s.prazo)}</td><td>${duracao(s.tempo)}</td><td>${s.andamento}</td>
          <td>${s.atrasadas ? `<span class="red-t">${dot('atrasada')}${s.atrasadas}</span>` : '0'}</td><td>${s.erros ? `<span class="red-t">${s.erros}</span> <small class="muted">em ${s.comErro}</small>` : '0'}</td></tr>`).join('')}
      </tbody></table></div>` : vazio('Nenhuma tarefa no período.')) +
      `<h2 class="sec">Erros e ajustes recentes</h2>` +
      (errosRec.length ? `<div class="items">${errosRec.map(e => `<button class="item erro-item" data-act="tarefaAbrir" data-id="${e.t.id}"><div class="t">${ic('alert', 14)}${esc(e.texto)}</div><div class="d small">${esc(e.t.titulo)} · ${esc(nomeMembro(e.t.membro_id))} · ${dataHoraBr(e.em)}</div></button>`).join('')}</div>` : vazio('Nenhum erro registrado no período. 👏')) +
      `<p class="small muted" style="margin-top:1rem">Tempo de execução = de “Começar” até “Concluir” (ou da criação até a conclusão, se a pessoa não clicou em Começar). Registre erros abrindo a tarefa.</p>`;
  }

  // "Adicionar neste dia": tarefa para alguém (ou para mim) ou reunião/entrega/prazo
  function adicionarNoDia(dia) {
    const tarefa = () => formTarefa({}, { prazo: dia });
    if (!edita('gerenciar_calendario')) return tarefa();
    const d = parseYmd(dia);
    modal(`Adicionar em ${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`, `<div class="escolha">
      <button type="button" class="esc" data-tipo="tarefa">${ic('task', 22)}<b>${edita('gerenciar_tarefas') ? 'Tarefa para alguém' : 'Tarefa para mim'}</b><span>Com responsável, prazo neste dia e avisos por e-mail</span></button>
      <button type="button" class="esc" data-tipo="evento">${ic('month', 22)}<b>Reunião, entrega ou prazo</b><span>Evento no calendário com quem participa</span></button>
    </div>`, null, { semFoco: true, setup: (form, { fechar }) => {
      form.querySelector('[data-tipo=tarefa]').addEventListener('click', () => { fechar(); tarefa(); });
      form.querySelector('[data-tipo=evento]').addEventListener('click', () => { fechar(); formEvento({}, dia); });
    } });
  }

  /* ---------------- TUTORIAL DO PRIMEIRO ACESSO ---------------- */
  // Ao mudar algo grande no painel: suba VERSAO_TUTORIAL e descreva a mudança em NOVIDADES[nova versão].
  // Quem já fez o tutorial vê só as novidades; quem nunca entrou faz o tutorial completo.
  const VERSAO_TUTORIAL = 1;
  const NOVIDADES = {
    // 2: ['Exemplo: nova aba de relatórios no menu.', 'Exemplo: agora dá para anexar imagens nas tarefas.']
  };
  function mostrarNovidades(desde) {
    const itens = Object.keys(NOVIDADES).map(Number).filter(v => v > desde && v <= VERSAO_TUTORIAL).sort().flatMap(v => NOVIDADES[v]);
    const concluir = () => acao('tutorial_visto', { versao: VERSAO_TUTORIAL }).then(() => { D.me.tutorial_versao = VERSAO_TUTORIAL; }).catch(() => {});
    if (!itens.length) return concluir();
    modal('O que mudou no painel ✨', `<ul class="novidades">${itens.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`, null, {
      semFoco: true, onClose: concluir,
      extra: `<button type="button" class="btn btn-ghost" data-tour>${ic('help', 14)}<span>Ver tutorial completo</span></button>`,
      setup: (form, { fechar }) => form.querySelector('[data-tour]').addEventListener('click', () => { fechar(); iniciarTutorial(); })
    });
  }

  function passosTutorial() {
    const P = [];
    const nome = primeiroNome(D.me.nome);
    const mobile = matchMedia('(max-width: 820px)').matches;
    P.push({ rota: 'inicio', titulo: `Bem-vinda(o) ao painel, ${nome}! 👋`, texto: 'Este é o lugar onde a equipe da Studio Pulga organiza tarefas, prazos, clientes e recados. Em 2 minutos você vai ver onde fica cada coisa. Use “OK, próximo” para avançar — e pode rever este tutorial quando quiser em Minha conta.' });
    P.push({ rota: 'inicio', alvo: '#side', menu: true, titulo: 'Menu', texto: 'Tudo fica aqui: Início, Tarefas, Calendário, Publicações, Clientes e os conteúdos da agência (Fluxograma, Processos, Planos e Boas práticas).' + (mobile ? ' No celular, ele abre pelo botão ☰ no canto de cima.' : '') });
    if (!mobile) P.push({ rota: 'inicio', alvo: '.side-toggle', titulo: 'Recolher o menu', texto: 'Clique aqui para deixar o menu só com ícones e ganhar espaço na tela. Clique de novo para expandir.' });
    P.push({ rota: 'inicio', alvo: '#inboxBtn', titulo: 'Caixa de entrada', texto: 'Quando alguém criar uma tarefa para você, mandar um recado ou uma solicitação, chega aqui — com um número vermelho e um som. Abra para ver e responder.' });
    P.push({ rota: 'inicio', alvo: '.with-panel > .panel', titulo: 'Suas pendências', texto: 'O que está atrasado (bolinha vermelha) e o que vence em até 2 dias (bolinha amarela). Bolinha verde = no prazo. Clique em qualquer item para abrir.' });
    P.push({ rota: 'inicio', alvo: '.recados, .stats', titulo: 'Recados e resumo', texto: 'Recados e solicitações da gestão aparecem em destaque no topo do Início até você marcar como lido ou atendido. Logo abaixo, o resumo das suas tarefas.' });
    P.push({ rota: 'inicio', alvo: '.strip', titulo: 'Minha semana', texto: 'Cada dia da semana com as bolinhas das suas tarefas. Toque em um dia para abrir as tarefas.' });
    if (gestao()) P.push({ rota: 'inicio', alvo: '[data-act=recadoNovo]', titulo: 'Enviar recado', texto: 'Mande um recado rápido para uma pessoa ou para uma função inteira. Marque “urgente” para aparecer em vermelho. Você acompanha quem já leu.' });
    P.push({ rota: 'tarefas', alvo: '.tweek, .cols', titulo: 'Tarefas da semana', texto: 'Cada coluna é um dia, pelo prazo. Toque numa tarefa para ver os detalhes, começar e concluir. O ✓ na tarefa conclui direto — e quem pediu é avisado na hora.' });
    P.push({ rota: 'tarefas', alvo: '.weekbar', titulo: 'Semana a semana', texto: 'Use as setas para ver a semana passada ou as próximas. “Hoje” volta para a semana atual.' });
    P.push({ rota: 'tarefas', alvo: '#view [data-act=tarefaNova]', titulo: 'Nova tarefa', texto: gestao() ? 'Crie e atribua tarefas: escolha a função (Social media, Video maker ou Design) e a pessoa, o prazo e quem recebe avisos por e-mail.' : 'Crie tarefas para você mesma(o) e organize sua semana. As tarefas que a gestão cria para você chegam sozinhas, marcadas como “Nova”.' });
    P.push({ rota: 'calendario', alvo: '.cal', titulo: 'Calendário', texto: 'O mês inteiro: reuniões, entregas, prazos de tarefas e publicações. Toque em um dia para ver tudo o que tem nele.' });
    P.push({ rota: 'calendario', alvo: '[data-act=adicionarDia]', titulo: 'Adicionar neste dia', texto: gestao() ? 'Escolha o dia e adicione uma tarefa para alguém (o prazo já vem preenchido) ou uma reunião, entrega ou prazo para a equipe.' : 'Escolha o dia e crie uma tarefa para você com aquele prazo.' });
    P.push({ rota: 'clientes', alvo: '#view .ph', titulo: 'Clientes', texto: 'A ficha de cada cliente tem abas: visão geral (com links úteis), identidade visual (cores, música e tipografias), onboarding e formulário em PDF, observações da semana, anotações pessoais (só você e a direção veem) e tarefas.' });
    P.push({ rota: 'fluxograma', alvo: '#view .ph', titulo: 'Fluxograma', texto: 'Como o trabalho anda, etapa por etapa, e quem executa cada uma. As etapas da sua função aparecem destacadas.' });
    P.push({ rota: 'processos', alvo: '#view .items', titulo: 'Checklist de qualidade', texto: 'Antes de enviar uma peça, confira item por item e vá ticando. O checklist fica salvo só para você e dá para recomeçar.' });
    if (gestao()) P.push({ rota: 'solicitacoes', alvo: '#view .ph', titulo: 'Solicitações de atendimento', texto: 'Peça algo para alguém da equipe com prazo (em 1 hora, até o fim do dia…). A pessoa recebe com som, fica fixo no Início dela e você vê quando foi vista e atendida — e em quanto tempo.' });
    if (can('gerenciar_equipe')) P.push({ rota: 'equipe', alvo: '#view .ph', titulo: 'Equipe e acessos', texto: 'Cadastre e remova pessoas, crie logins e senhas, e defina quem é administrador. Remover alguém derruba o login na hora.' });
    if (can('gerenciar_tarefas')) P.push({ rota: 'desempenho', alvo: '#view .stats', titulo: 'Desempenho', texto: 'Quanto cada pessoa concluiu, se foi no prazo, quanto tempo levou e quais erros foram registrados.' });
    if (D.me.dono) P.push({ rota: 'acessos', alvo: '#view .ph', titulo: 'Acessos (só você vê)', texto: 'Quando e por quanto tempo cada pessoa usou o painel, e em qual aparelho.' });
    P.push({ rota: 'inicio', alvo: '#senhaBtn', titulo: 'Minha conta', texto: 'Coloque seu e-mail para receber avisos, troque sua senha, ligue ou desligue o som das notificações e reveja este tutorial.' });
    P.push({ rota: 'inicio', alvo: '#themeBtn', titulo: 'Tema claro ou escuro', texto: 'Troque entre o tema claro e o escuro quando quiser.' });
    P.push({ rota: 'inicio', titulo: 'Pronto! 🎉', texto: (mobile ? 'Dica: instale o painel como app — no iPhone, toque em Compartilhar → “Adicionar à Tela de Início”; no Android, use “Instalar app” no menu. ' : '') + 'Qualquer dúvida, fale com a gestão. Bom trabalho!' });
    return P;
  }

  function iniciarTutorial() {
    document.querySelectorAll('.tour').forEach(t => t.remove());
    const passos = passosTutorial();
    let i = 0;
    const tour = document.createElement('div');
    tour.className = 'tour';
    tour.innerHTML = '<div class="tour-hole"></div><div class="tour-card" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(tour);
    const hole = tour.querySelector('.tour-hole'), card = tour.querySelector('.tour-card');
    const fim = () => {
      tour.remove(); document.body.classList.remove('nav-open'); removeEventListener('resize', posicionar);
      D.me.tutorial_versao = VERSAO_TUTORIAL;
      acao('tutorial_visto', { versao: VERSAO_TUTORIAL }).catch(() => {});
      location.hash = '#/inicio';
    };
    let alvoAtual = null;
    function posicionar() {
      const r = alvoAtual && alvoAtual.getBoundingClientRect();
      const mobile = innerWidth <= 820;
      if (!r || !r.width) {
        hole.style.cssText = `left:50%;top:50%;width:0;height:0`;
        card.style.cssText = mobile ? '' : `left:50%;top:50%;transform:translate(-50%,-50%)`;
        card.classList.add('centro');
        return;
      }
      card.classList.remove('centro');
      const m = 6;
      hole.style.cssText = `left:${r.left - m}px;top:${r.top - m}px;width:${r.width + m * 2}px;height:${Math.min(r.height, innerHeight - 40) + m * 2}px`;
      if (mobile) { card.style.cssText = r.top > innerHeight / 2 ? 'top:12px;bottom:auto' : ''; return; }
      const cw = 360, ch = card.offsetHeight || 200;
      let left = Math.min(Math.max(12, r.left), innerWidth - cw - 12);
      let top = r.bottom + 14;
      if (top + ch > innerHeight - 12) top = r.top - ch - 14;
      if (top < 12) { top = Math.max(12, Math.min(innerHeight - ch - 12, r.top)); left = r.right + 14 + cw < innerWidth ? r.right + 14 : Math.max(12, r.left - cw - 14); }
      card.style.cssText = `left:${left}px;top:${top}px`;
    }
    async function mostrar() {
      const p = passos[i];
      if (p.rota && rota()[0] !== p.rota) { location.hash = '#/' + p.rota; await new Promise(r => setTimeout(r, 260)); }
      const mobile = innerWidth <= 820;
      document.body.classList.toggle('nav-open', !!(p.menu && mobile));
      if (p.menu && mobile) await new Promise(r => setTimeout(r, 230));
      alvoAtual = null;
      if (p.alvo) for (const sel of p.alvo.split(',')) { const el = document.querySelector(sel.trim()); if (el && el.getBoundingClientRect().width) { alvoAtual = el; break; } }
      if (alvoAtual && !p.menu) { alvoAtual.scrollIntoView({ block: 'center', behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); }
      card.innerHTML = `<div class="tour-n">${i + 1} de ${passos.length}</div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p>
        <div class="tour-b"><button type="button" class="btn btn-ghost btn-sm" data-pular>Pular tutorial</button><span></span>
        ${i ? '<button type="button" class="btn btn-ghost btn-sm" data-voltar>Voltar</button>' : ''}
        <button type="button" class="btn btn-primary btn-sm" data-ok>${i === passos.length - 1 ? 'Começar a usar' : 'OK, próximo'}</button></div>`;
      card.querySelector('[data-ok]').addEventListener('click', () => { if (i === passos.length - 1) fim(); else { i++; mostrar(); } });
      const v = card.querySelector('[data-voltar]'); if (v) v.addEventListener('click', () => { i--; mostrar(); });
      card.querySelector('[data-pular]').addEventListener('click', () => { if (confirm('Pular o tutorial? Dá para ver de novo em Minha conta.')) fim(); });
      posicionar();
      card.querySelector('[data-ok]').focus();
    }
    addEventListener('resize', posicionar);
    mostrar();
  }

  /* ---------------- ações dos botões ---------------- */
  const ACOES = {
    tarefaNova: () => formTarefa(),
    tarefaNovaCliente: id => formTarefa({}, { cliente_id: id }),
    tarefaAbrir: id => abrirTarefa(D.tarefas.find(t => t.id === id)),
    tarefaStatus: (id, el) => mudarStatus(id, el.dataset.status),
    modoTarefas: m => { S.modo = m; try { localStorage.setItem('sp_modo_tarefas', m); } catch {} render(true); },
    semanaT: n => { S.semanaT = n === '0' ? 0 : S.semanaT + Number(n); render(true); },
    semanaP: n => { S.semanaP = n === '0' ? 0 : S.semanaP + Number(n); render(true); },
    mes: n => { S.mes = n === '0' ? 0 : S.mes + Number(n); if (n === '0') S.diaSel = hoje(); render(true); },
    diaSel: d => { S.diaSel = d; render(true); },
    eventoNovo: dia => formEvento({}, dia || S.diaSel),
    adicionarDia: dia => adicionarNoDia(dia || S.diaSel),
    recadoNovo: () => formRecado(),
    recadoLido: id => { marcarLido(a => a.id === id); render(true); toast('Recado marcado como lido.'); },
    recadoExcluir: async id => {
      if (!confirm('Apagar este recado?')) return;
      try { await acao('recado_excluir', { id }); D.avisos = D.avisos.filter(a => a.id !== id); render(true); } catch (e) { if (e.message !== 'sessao') toast(e.message); }
    },
    eventoAbrir: id => abrirEvento((D.eventos || []).find(e => e.id === id)),
    pubNova: () => formPub(),
    pubAbrir: id => formPub(D.publicacoes.find(p => p.id === id)),
    solicitacaoNova: () => formSolicitacao(),
    acessosAtualizar: () => { acessosCache = null; render(true); },
    acessoDetalhe: id => detalheAcesso(id),
    atenderSolic: id => { const a = meusAvisos().find(x => x.id === id); if (a) atenderSolicitacao(a); },
    clienteNovo: () => formCliente(),
    clienteEditar: id => formCliente(cliente(id)),
    pdfAbrir: id => abrirPdf(id),
    pdfExcluir: async id => {
      if (!confirm('Remover este PDF?')) return;
      try { await acao('arquivo_excluir', { id }); D.arquivos = D.arquivos.filter(a => a.id !== id); render(true); toast('PDF removido.'); }
      catch (e) { if (e.message !== 'sessao') toast(e.message); }
    },
    notaExcluir: async id => {
      if (!confirm('Excluir esta observação?')) return;
      try { await acao('nota_excluir', { id }); D.notas = D.notas.filter(n => n.id !== id); render(true); }
      catch (e) { if (e.message !== 'sessao') toast(e.message); }
    },
    anotEditar: id => {
      const n = (D.anotacoes || []).find(x => x.id === id);
      if (!n) return;
      modal('Editar anotação', `<label>Anotação<textarea name="texto" maxlength="4000" required style="min-height:140px">${esc(n.texto)}</textarea></label>`,
        async f => { const j = await acao('anotacao_salvar', { id, texto: f.texto }); Object.assign(n, j.row); toast('Anotação salva.'); });
    },
    anotExcluir: async id => {
      if (!confirm('Excluir esta anotação?')) return;
      try { await acao('anotacao_excluir', { id }); D.anotacoes = D.anotacoes.filter(n => n.id !== id); render(true); }
      catch (e) { if (e.message !== 'sessao') toast(e.message); }
    },
    qaLimpar: () => { try { localStorage.removeItem(qaChave()); } catch {} render(true); },
    copiar: async cor => { try { await navigator.clipboard.writeText(cor); toast(`${cor} copiado`); } catch { toast(cor); } },
    editarBloco: k => editarBloco(k),
    fluxoEditar: i => editarFluxoExtra(i),
    membroNovo: () => formMembro(),
    membroEditar: id => formMembro(membro(id))
  };
  // Teclado: Enter/Espaço abre cartões clicáveis
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role=button][data-act]')) { e.preventDefault(); e.target.click(); }
  });

  carregar();
})();
