/* Studio Pulga — Painel da Equipe + Painel de Gestão */
(() => {
  const AREA = window.AREA === 'admin' ? 'admin' : 'equipe';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    task: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clients: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    flow: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    process: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    team: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16 7l3 3M19 4l2 2"/>',
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
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
  };
  const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  let D = null;          // dados vindos de /api/dados
  let semana = 0;        // deslocamento da agenda (semanas a partir de hoje)
  let filtroTarefas = '';

  const can = p => !!D && D.me.perms.includes(p);
  const edita = p => AREA === 'admin' && can('acesso_gestao') && can(p);

  /* ---------------- utilidades ---------------- */
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hoje = () => ymd(new Date());
  const parseYmd = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
  const dataBr = s => (s ? s.slice(8, 10) + '/' + s.slice(5, 7) : '');
  const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const iniciais = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const membro = id => (D.membros || []).find(m => m.id === id);
  const cliente = id => (D.clientes || []).find(c => c.id === id);
  const nomeMembro = id => (membro(id) || {}).nome || '—';
  const nomeCliente = id => (cliente(id) || {}).nome || '';
  const primeiroNome = n => String(n || '').split(' ')[0];
  const conteudo = k => (D.conteudo && Array.isArray(D.conteudo[k]) ? D.conteudo[k] : []);

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  async function api(path, body) {
    const opt = body === undefined
      ? { credentials: 'same-origin' }
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

  /* ---------------- tema ---------------- */
  function temaAtual() {
    const t = document.documentElement.dataset.theme;
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function aplicarTema(t) {
    if (t) document.documentElement.dataset.theme = t;
    $('#themeBtn').innerHTML = ic(temaAtual() === 'dark' ? 'sun' : 'moon');
  }
  try { const t = localStorage.getItem('sp_tema'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch {}

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
    carregar();
  });

  /* ---------------- carga ---------------- */
  async function carregar() {
    const { status, j } = await api('/api/dados?area=' + AREA);
    if (status === 401) return mostrarLogin();
    if (status === 403) return mostrarLogin('Seu login não tem acesso ao painel de gestão.<br><a href="/">Ir para o site da equipe</a>');
    if (!j.ok) return mostrarLogin(esc(j.erro || 'Erro ao carregar. Tente de novo.'));
    D = j;
    $('#login').classList.add('hidden');
    $('#app').classList.remove('hidden');
    montarTopo();
    render();
  }

  async function recarregar() {
    const { status, j } = await api('/api/dados?area=' + AREA);
    if (status === 401) return mostrarLogin('Sua sessão expirou. Entre de novo.');
    if (j.ok) { D = j; render(); }
  }

  /* ---------------- topo e menu ---------------- */
  function montarTopo() {
    $('#menuBtn').innerHTML = ic('menu');
    $('#senhaBtn').innerHTML = ic('key');
    $('#logoutBtn').innerHTML = ic('logout');
    aplicarTema();
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
    const itens = [
      ['inicio', 'home', 'Início'],
      ['tarefas', 'task', 'Tarefas'],
      ['agenda', 'cal', 'Agenda de publicações'],
      ['clientes', 'clients', 'Clientes'],
      ['g', 'Conteúdo'],
      ['fluxograma', 'flow', 'Fluxograma'],
      ['processos', 'process', 'Processos'],
      ['praticas', 'star', 'Boas práticas'],
      ['g', 'Pessoas'],
      ['equipe', 'team', AREA === 'admin' && can('gerenciar_equipe') ? 'Equipe e acessos' : 'Equipe']
    ];
    const atual = rota()[0];
    let h = itens.map(i => i[0] === 'g'
      ? `<div class="grp">${i[1]}</div>`
      : `<a href="#/${i[0]}" class="${atual === i[0] || (atual === 'cliente' && i[0] === 'clientes') ? 'on' : ''}">${ic(i[1])}<span>${i[2]}</span></a>`).join('');
    const sw = $('#switch').innerHTML;
    if (sw) h += `<div class="side-mobile-switch"><div class="grp">Outro painel</div>${sw.replace('<a ', '<a style="padding-left:.75rem" ')}</div>`;
    $('#side').innerHTML = h;
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
    modal('Trocar minha senha', `
      <label>Senha atual<input type="password" name="atual" autocomplete="current-password" required></label>
      <label>Nova senha <span class="hint">(mínimo 6 caracteres)</span><input type="password" name="nova" autocomplete="new-password" minlength="6" required></label>
      <label>Repita a nova senha<input type="password" name="nova2" autocomplete="new-password" required></label>`,
    async f => {
      if (f.nova !== f.nova2) throw new Error('As senhas novas não são iguais.');
      await acao('minha_senha', { atual: f.atual, nova: f.nova });
      toast('Senha alterada.');
    });
  });

  /* ---------------- modal ---------------- */
  function modal(titulo, corpo, onSave, opts = {}) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><h2>${esc(titulo)}</h2>
      <form class="form">${corpo}<div class="err"></div>
      <div class="foot">${opts.onDelete ? `<button type="button" class="btn btn-danger" data-del>${ic('trash')} ${esc(opts.delLabel || 'Excluir')}</button>` : ''}
      <div class="r"><button type="button" class="btn btn-ghost" data-close>Cancelar</button>${onSave ? `<button type="submit" class="btn btn-primary">${esc(opts.saveLabel || 'Salvar')}</button>` : ''}</div></div>
      </form></div>`;
    const fechar = () => { ov.remove(); document.removeEventListener('keydown', esc_); };
    const esc_ = e => { if (e.key === 'Escape') fechar(); };
    document.addEventListener('keydown', esc_);
    ov.addEventListener('mousedown', e => { if (e.target === ov) fechar(); });
    ov.querySelector('[data-close]').addEventListener('click', fechar);
    const form = ov.querySelector('form');
    const errEl = ov.querySelector('.err');
    const rodar = async fn => {
      errEl.textContent = '';
      form.querySelectorAll('button').forEach(b => (b.disabled = true));
      try { await fn(); fechar(); await recarregar(); }
      catch (e) { if (e.message !== 'sessao') errEl.textContent = e.message; }
      finally { form.querySelectorAll('button').forEach(b => (b.disabled = false)); }
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!onSave) return fechar();
      const f = {};
      new FormData(form).forEach((v, k) => { f[k] = v; });
      form.querySelectorAll('input[type=checkbox][name]').forEach(c => { if (!c.dataset.multi) f[c.name] = c.checked; });
      rodar(() => onSave(f, form));
    });
    if (opts.onDelete) ov.querySelector('[data-del]').addEventListener('click', () => {
      if (confirm(opts.confirmDel || 'Tem certeza que quer excluir?')) rodar(opts.onDelete);
    });
    if (opts.setup) opts.setup(form);
    document.body.appendChild(ov);
    const first = form.querySelector('input:not([type=hidden]):not([type=checkbox]),textarea,select');
    if (first) first.focus();
    return form;
  }

  const opcoes = (lista, sel, vazio) => (vazio !== undefined ? `<option value="">${esc(vazio)}</option>` : '') +
    lista.map(([v, t]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('');
  const optMembros = (sel, vazio) => opcoes([...D.membros].sort((a, b) => a.nome.localeCompare(b.nome)).map(m => [m.id, m.nome]), sel, vazio);
  const optClientes = (sel, vazio) => opcoes([...D.clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map(c => [c.id, c.nome]), sel, vazio);

  /* ---------------- rotas ---------------- */
  const rota = () => (location.hash.replace(/^#\/?/, '') || 'inicio').split('/');
  window.addEventListener('hashchange', () => { if (D) { render(); scrollTo(0, 0); } });

  function render() {
    if (!D) return;
    menu();
    const [r, arg] = rota();
    const v = $('#view');
    const telas = { inicio, tarefas, agenda, clientes, cliente: () => fichaCliente(arg), fluxograma, processos, praticas, equipe };
    v.innerHTML = (telas[r] || inicio)();
    ligar(v);
  }

  // Ações por data-atributos (re-ligadas a cada render)
  function ligar(v) {
    v.querySelectorAll('[data-act]').forEach(el => el.addEventListener('click', e => {
      e.preventDefault();
      const fn = ACOES[el.dataset.act];
      if (fn) fn(el.dataset.id, el);
    }));
    v.querySelectorAll('[data-filtro]').forEach(el => el.addEventListener('change', () => { filtroTarefas = el.value; render(); }));
  }

  const cab = (titulo, sub, acts = '') => `<div class="ph"><div><h1>${esc(titulo)}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
  const btn = (act, label, icon, cls = '', id = '') => `<button class="btn ${cls}" data-act="${act}"${id ? ` data-id="${esc(id)}"` : ''}>${icon ? ic(icon) : ''}${esc(label)}</button>`;
  const vazio = msg => `<div class="empty">${msg}</div>`;
  const lock = it => (it && it.restrito ? `<span class="tag lock" title="Visível só para quem tem acesso a conteúdo restrito">${ic('lock').replace('<svg', '<svg width="11" height="11"')}Restrito</span>` : '');

  /* ---------------- tarefas: helpers ---------------- */
  const PRIOR = { alta: ['Alta', 'danger'], media: ['Média', 'warn'], baixa: ['Baixa', 'info'] };
  const STATUS_T = { pendente: 'A fazer', fazendo: 'Fazendo', feito: 'Feito' };
  const atrasada = t => t.status !== 'feito' && t.prazo && t.prazo < hoje();

  function cartaoTarefa(t, compacto) {
    const p = PRIOR[t.prioridade] || PRIOR.media;
    const minha = t.membro_id === D.me.id;
    const podeStatus = minha || edita('gerenciar_tarefas');
    const proximo = { pendente: ['fazendo', 'Começar'], fazendo: ['feito', 'Concluir'], feito: ['pendente', 'Reabrir'] }[t.status] || ['fazendo', 'Começar'];
    return `<div class="task${atrasada(t) ? ' late' : ''}">
      <div class="t">${esc(t.titulo)}</div>
      ${t.descricao && !compacto ? `<div class="d">${esc(t.descricao)}</div>` : ''}
      <div class="meta">
        <span class="tag ${p[1]}">${p[0]}</span>
        ${t.prazo ? `<span class="tag ${atrasada(t) ? 'danger' : ''}">${atrasada(t) ? 'Atrasada · ' : 'Prazo '}${dataBr(t.prazo)}</span>` : ''}
        ${t.cliente_id && nomeCliente(t.cliente_id) ? `<span class="tag">${esc(nomeCliente(t.cliente_id))}</span>` : ''}
        ${!minha || compacto ? `<span class="tag info">${esc(primeiroNome(nomeMembro(t.membro_id)))}</span>` : ''}
      </div>
      ${podeStatus || edita('gerenciar_tarefas') ? `<div class="row">
        ${podeStatus ? `<button class="btn btn-sm" data-act="tarefaStatus" data-id="${t.id}" data-status="${proximo[0]}">${proximo[1]}</button>` : ''}
        ${edita('gerenciar_tarefas') ? `<button class="btn btn-sm btn-ghost" data-act="tarefaEditar" data-id="${t.id}">${ic('edit')}Editar</button>` : ''}
      </div>` : ''}
    </div>`;
  }

  /* ---------------- INÍCIO ---------------- */
  function inicio() {
    const minhas = D.tarefas.filter(t => t.membro_id === D.me.id && t.status !== 'feito');
    const atrasadas = minhas.filter(atrasada);
    const h = hoje();
    const pubsHoje = D.publicacoes.filter(p => p.data === h);
    const ativos = D.clientes.filter(c => !/inativ|pausad|encerrad/i.test(c.status || ''));
    const hora = new Date().getHours();
    const saud = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
    const rituais = conteudo('rituais'), links = conteudo('links'), rede = conteudo('redeConceito');
    const ed = edita('editar_inicio');
    return cab(`${saud}, ${primeiroNome(D.me.nome)}!`, `${esc(D.me.funcao || '')}${AREA === 'admin' ? ' · Painel de gestão' : ''}`) +
      `<div class="stats">
        <a class="card stat" href="#/tarefas" style="text-decoration:none;color:inherit"><div class="n">${minhas.length}</div><div class="l">minhas tarefas abertas</div></a>
        <a class="card stat" href="#/tarefas" style="text-decoration:none;color:inherit"><div class="n" style="${atrasadas.length ? 'color:var(--danger)' : ''}">${atrasadas.length}</div><div class="l">atrasadas</div></a>
        <a class="card stat" href="#/agenda" style="text-decoration:none;color:inherit"><div class="n">${pubsHoje.length}</div><div class="l">publicações hoje</div></a>
        <a class="card stat" href="#/clientes" style="text-decoration:none;color:inherit"><div class="n">${ativos.length}</div><div class="l">clientes ativos</div></a>
      </div>` +
      `<h2 class="sec">Minhas tarefas <a href="#/tarefas" class="small">ver todas</a></h2>` +
      (minhas.length ? `<div class="grid">${minhas.sort((a, b) => (a.prazo || '9') < (b.prazo || '9') ? -1 : 1).slice(0, 6).map(t => cartaoTarefa(t)).join('')}</div>` : vazio('Nenhuma tarefa aberta para você. 🎉')) +
      `<h2 class="sec">Publicações de hoje <a href="#/agenda" class="small">abrir agenda</a></h2>` +
      (pubsHoje.length ? `<div class="grid">${pubsHoje.map(cartaoPub).join('')}</div>` : vazio('Nada programado para hoje.')) +
      `<h2 class="sec">Atalhos ${ed ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', 'links') : ''}</h2>` +
      (links.length ? `<div class="links">${links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${ic('link')}${esc(l.titulo)}${l.restrito ? ' ' + ic('lock').replace('<svg', '<svg width="12" height="12"') : ''}</a>`).join('')}</div>` : vazio('Nenhum atalho cadastrado.')) +
      `<h2 class="sec">Rituais da semana ${ed ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', 'rituais') : ''}</h2>` +
      (rituais.length ? `<div class="grid">${rituais.map(r => `<div class="card"><div class="small muted" style="font-weight:600;text-transform:uppercase;letter-spacing:.06em">${esc(r.quando || '')}</div><div style="font-weight:700;margin:.15rem 0 .3rem">${esc(r.titulo)}</div><div class="muted small" style="white-space:pre-wrap">${esc(r.texto || '')}</div></div>`).join('')}</div>` : vazio('Nenhum ritual cadastrado.')) +
      `<h2 class="sec">Rede Conceito ${ed ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', 'redeConceito') : ''}</h2>` +
      (rede.length ? `<div class="items">${rede.map(itemHtml).join('')}</div>` : vazio('Sem texto cadastrado.'));
  }

  /* ---------------- TAREFAS ---------------- */
  function tarefas() {
    const verTodas = can('ver_tarefas_equipe') || can('gerenciar_tarefas');
    let lista = D.tarefas;
    if (filtroTarefas === 'minhas') lista = lista.filter(t => t.membro_id === D.me.id);
    else if (filtroTarefas) lista = lista.filter(t => t.membro_id === filtroTarefas);
    const ordenar = arr => arr.sort((a, b) => {
      const pa = { alta: 0, media: 1, baixa: 2 }[a.prioridade] ?? 1, pb = { alta: 0, media: 1, baixa: 2 }[b.prioridade] ?? 1;
      return (a.prazo || '9999') .localeCompare(b.prazo || '9999') || pa - pb;
    });
    const col = s => {
      const arr = ordenar(lista.filter(t => t.status === s));
      return `<div class="col"><h3>${STATUS_T[s]} <span class="count">${arr.length}</span></h3>${arr.map(t => cartaoTarefa(t)).join('') || '<div class="empty small">Vazio</div>'}</div>`;
    };
    return cab('Tarefas', verTodas ? 'Tarefas da equipe. Concluídas somem depois de 14 dias.' : 'Suas tarefas. Concluídas somem depois de 14 dias.',
      edita('gerenciar_tarefas') ? btn('tarefaNova', 'Nova tarefa', 'plus', 'btn-primary') : '') +
      (verTodas ? `<div class="filters"><select data-filtro aria-label="Filtrar por pessoa">${opcoes([['', 'Toda a equipe'], ['minhas', 'Só as minhas'], ...[...D.membros].sort((a, b) => a.nome.localeCompare(b.nome)).map(m => [m.id, m.nome])], filtroTarefas)}</select></div>` : '') +
      `<div class="cols">${col('pendente')}${col('fazendo')}${col('feito')}</div>`;
  }

  function formTarefa(t = {}) {
    modal(t.id ? 'Editar tarefa' : 'Nova tarefa', `
      <input type="hidden" name="id" value="${esc(t.id || '')}">
      <label>Título<input name="titulo" maxlength="200" required value="${esc(t.titulo || '')}"></label>
      <label>Descrição<textarea name="descricao">${esc(t.descricao || '')}</textarea></label>
      <div class="two">
        <label>Responsável<select name="membro_id" required>${optMembros(t.membro_id, 'Escolha…')}</select></label>
        <label>Cliente<select name="cliente_id">${optClientes(t.cliente_id, 'Nenhum')}</select></label>
      </div>
      <div class="two">
        <label>Prioridade<select name="prioridade">${opcoes([['alta', 'Alta'], ['media', 'Média'], ['baixa', 'Baixa']], t.prioridade || 'media')}</select></label>
        <label>Prazo<input type="date" name="prazo" value="${esc(t.prazo || '')}"></label>
      </div>
      <label>Status<select name="status">${opcoes([['pendente', 'A fazer'], ['fazendo', 'Fazendo'], ['feito', 'Feito']], t.status || 'pendente')}</select></label>`,
    async f => { await acao('tarefa_salvar', { row: f }); toast('Tarefa salva.'); },
    t.id ? { onDelete: async () => { await acao('tarefa_excluir', { id: t.id }); toast('Tarefa excluída.'); }, confirmDel: 'Excluir esta tarefa?' } : {});
  }

  /* ---------------- AGENDA ---------------- */
  function cartaoPub(p) {
    const podeEditar = edita('gerenciar_publicacoes');
    const resp = p.responsavel_id === D.me.id;
    const click = podeEditar || resp;
    return `<div class="pub${p.status === 'publicado' ? ' done' : ''}${click ? ' click' : ''}"${click ? ` data-act="pubAbrir" data-id="${p.id}"` : ''}>
      <div class="h">${esc(p.hora || '')}${p.hora ? ' · ' : ''}${esc(nomeCliente(p.cliente_id) || 'Cliente')}</div>
      ${p.formato ? `<div>${esc(p.formato)}</div>` : ''}
      ${p.descricao ? `<div class="muted">${esc(p.descricao)}</div>` : ''}
      ${p.responsavel_id ? `<div class="muted">${esc(primeiroNome(nomeMembro(p.responsavel_id)))}</div>` : ''}
    </div>`;
  }

  function agenda() {
    const base = new Date();
    base.setDate(base.getDate() - ((base.getDay() + 6) % 7) + semana * 7); // segunda-feira
    const dias = [...Array(7)].map((_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
    const h = hoje();
    const titulo = `${dataBr(ymd(dias[0]))} a ${dataBr(ymd(dias[6]))}`;
    return cab('Agenda de publicações', 'Programação da semana por cliente, formato e horário.',
      `<div class="week-nav">${btn('semanaAnt', '', 'left', 'btn-ghost btn-sm')}<span class="small" style="min-width:110px;text-align:center;font-weight:600">${titulo}</span>${btn('semanaProx', '', 'right', 'btn-ghost btn-sm')}${semana ? btn('semanaHoje', 'Hoje', '', 'btn-ghost btn-sm') : ''}</div>` +
      (edita('gerenciar_publicacoes') ? btn('pubNova', 'Nova publicação', 'plus', 'btn-primary') : '')) +
      `<div class="week">${dias.map(d => {
        const s = ymd(d);
        const pubs = D.publicacoes.filter(p => p.data === s).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
        return `<div class="day${s === h ? ' today' : ''}"><div class="dh"><b>${d.getDate()}</b>${DIAS[d.getDay()]}</div>${pubs.map(cartaoPub).join('')}</div>`;
      }).join('')}</div>` +
      (semana < -1 ? '<p class="small muted" style="margin-top:.8rem">Publicações com mais de 7 dias não aparecem aqui.</p>' : '');
  }

  function formPub(p = {}) {
    const podeEditar = edita('gerenciar_publicacoes');
    if (!podeEditar) {
      const nova = p.status === 'publicado' ? 'programado' : 'publicado';
      return modal(nomeCliente(p.cliente_id) || 'Publicação', `
        <p>${esc(dataBr(p.data))} ${esc(p.hora || '')} · ${esc(p.formato || '')}</p>
        ${p.descricao ? `<p class="muted">${esc(p.descricao)}</p>` : ''}
        <p class="small muted">Status atual: <b>${p.status === 'publicado' ? 'Publicado' : 'Programado'}</b></p>`,
      async () => { await acao('pub_status', { id: p.id, status: nova }); toast('Status atualizado.'); },
      { saveLabel: nova === 'publicado' ? 'Marcar como publicado' : 'Voltar para programado' });
    }
    modal(p.id ? 'Editar publicação' : 'Nova publicação', `
      <input type="hidden" name="id" value="${esc(p.id || '')}">
      <label>Cliente<select name="cliente_id" required>${optClientes(p.cliente_id, 'Escolha…')}</select></label>
      <div class="two">
        <label>Dia<input type="date" name="data" required value="${esc(p.data || hoje())}"></label>
        <label>Horário<input type="time" name="hora" value="${esc(p.hora || '')}"></label>
      </div>
      <div class="two">
        <label>Formato<input name="formato" maxlength="60" placeholder="Reels, carrossel, stories…" value="${esc(p.formato || '')}"></label>
        <label>Responsável<select name="responsavel_id">${optMembros(p.responsavel_id, 'Ninguém')}</select></label>
      </div>
      <label>Descrição<input name="descricao" maxlength="300" value="${esc(p.descricao || '')}"></label>
      <label>Status<select name="status">${opcoes([['programado', 'Programado'], ['publicado', 'Publicado']], p.status || 'programado')}</select></label>`,
    async f => { await acao('pub_salvar', { row: f }); toast('Publicação salva.'); },
    p.id ? { onDelete: async () => { await acao('pub_excluir', { id: p.id }); toast('Publicação excluída.'); }, confirmDel: 'Excluir esta publicação?' } : {});
  }

  /* ---------------- CLIENTES ---------------- */
  const SAUDE = { ok: ['Saudável', 'ok'], atencao: ['Atenção', 'warn'], risco: ['Em risco', 'danger'], novo: ['Novo', 'info'], avaliar: ['Avaliar', ''] };
  const tagSaude = s => { const x = SAUDE[s] || SAUDE.avaliar; return `<span class="tag ${x[1]}">${x[0]}</span>`; };

  function clientes() {
    const lista = [...D.clientes].sort((a, b) => (a.ordem - b.ordem) || a.nome.localeCompare(b.nome));
    return cab('Clientes', `${lista.length} cliente${lista.length === 1 ? '' : 's'} na carteira.`, edita('gerenciar_clientes') ? btn('clienteNovo', 'Novo cliente', 'plus', 'btn-primary') : '') +
      (lista.length ? `<div class="grid">${lista.map(c => `<a class="card cli" href="#/cliente/${c.id}">
        <div class="nm">${esc(c.nome)}</div>
        <div style="display:flex;gap:.35rem;flex-wrap:wrap">${tagSaude(c.saude)}${c.status ? `<span class="tag">${esc(c.status)}</span>` : ''}${c.nicho ? `<span class="tag">${esc(c.nicho)}</span>` : ''}${c.rede ? '<span class="tag info">Rede Conceito</span>' : ''}</div>
        ${c.resumo ? `<div class="rs">${esc(c.resumo)}</div>` : ''}
        ${c.instagram ? `<div class="small muted">@${esc(c.instagram)}</div>` : ''}
      </a>`).join('')}</div>` : vazio(edita('gerenciar_clientes') ? 'Nenhum cliente cadastrado ainda. Use “Novo cliente” para começar.' : 'Nenhum cliente cadastrado ainda.'));
  }

  const LISTAS = [['sobre', 'Sobre'], ['objetivo', 'Objetivo'], ['posicionamento', 'Posicionamento'], ['ideias', 'Ideias'], ['atencao', 'Pontos de atenção'], ['como_agir', 'Como agir']];

  function fichaCliente(id) {
    const c = cliente(id);
    if (!c) return `<a class="back" href="#/clientes">${ic('left')}Clientes</a>` + vazio('Cliente não encontrado.');
    const tfs = D.tarefas.filter(t => t.cliente_id === c.id && t.status !== 'feito');
    const pubs = D.publicacoes.filter(p => p.cliente_id === c.id && p.data >= hoje()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const kv = [['Serviço', c.servico], ['Plano', c.plano], ['Status', c.status], ['Nicho', c.nicho], ['Instagram', c.instagram ? '@' + c.instagram : ''], ['Cliente desde', c.desde], ['Aprovação', c.aprovacao], ['Quem aparece', c.aparecem]].filter(x => x[1]);
    return `<a class="back" href="#/clientes">${ic('left')}Clientes</a>` +
      cab(c.nome, `${tagSaude(c.saude)} ${c.rede ? '<span class="tag info">Rede Conceito</span>' : ''}`,
        (edita('editar_clientes') ? btn('clienteEditar', 'Editar ficha', 'edit', 'btn-primary', c.id) : '')) +
      (c.resumo ? `<p style="margin:-.6rem 0 1rem;max-width:70ch">${esc(c.resumo)}</p>` : '') +
      `<div class="ficha">
        ${kv.length ? `<div class="card"><h3>Dados</h3><dl class="kv">${kv.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>` : ''}
        ${LISTAS.filter(([k]) => (c[k] || []).length).map(([k, t]) => `<div class="card"><h3>${t}</h3><ul>${c[k].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
      </div>` +
      `<h2 class="sec">Tarefas abertas</h2>` + (tfs.length ? `<div class="grid">${tfs.map(t => cartaoTarefa(t, true)).join('')}</div>` : vazio('Nenhuma tarefa aberta para este cliente.')) +
      `<h2 class="sec">Próximas publicações</h2>` + (pubs.length ? `<div class="grid">${pubs.map(p => `<div>${'<div class="small muted" style="margin-bottom:.25rem">' + dataBr(p.data) + '</div>' + cartaoPub(p)}</div>`).join('')}</div>` : vazio('Nada programado.'));
  }

  function formCliente(c = {}) {
    const lista = k => esc((c[k] || []).join('\n'));
    modal(c.id ? 'Editar ficha' : 'Novo cliente', `
      <input type="hidden" name="id" value="${esc(c.id || '')}">
      <div class="two">
        <label>Nome<input name="nome" maxlength="120" required value="${esc(c.nome || '')}"></label>
        <label>Nicho<input name="nicho" maxlength="60" value="${esc(c.nicho || '')}"></label>
      </div>
      <div class="two">
        <label>Saúde<select name="saude">${opcoes(Object.entries(SAUDE).map(([k, v]) => [k, v[0]]), c.saude || 'avaliar')}</select></label>
        <label>Status<input name="status" maxlength="60" value="${esc(c.status || 'Ativo')}"></label>
      </div>
      <div class="two">
        <label>Serviço<input name="servico" maxlength="300" value="${esc(c.servico || '')}"></label>
        <label>Plano<input name="plano" maxlength="120" value="${esc(c.plano || '')}"></label>
      </div>
      <div class="two">
        <label>Instagram<input name="instagram" maxlength="60" placeholder="@perfil" value="${esc(c.instagram || '')}"></label>
        <label>Cliente desde<input name="desde" maxlength="40" value="${esc(c.desde || '')}"></label>
      </div>
      <div class="two">
        <label>Aprovação<input name="aprovacao" maxlength="300" placeholder="Quem aprova e como" value="${esc(c.aprovacao || '')}"></label>
        <label>Quem aparece<input name="aparecem" maxlength="300" value="${esc(c.aparecem || '')}"></label>
      </div>
      <label>Resumo<textarea name="resumo" maxlength="600" style="min-height:60px">${esc(c.resumo || '')}</textarea></label>
      <label class="inline"><input type="checkbox" name="rede"${c.rede ? ' checked' : ''}> Faz parte da Rede Conceito</label>
      ${LISTAS.map(([k, t]) => `<label>${t} <span class="hint">(um item por linha)</span><textarea name="${k}">${lista(k)}</textarea></label>`).join('')}`,
    async f => { await acao('cliente_salvar', { row: f }); toast('Cliente salvo.'); },
    c.id && edita('gerenciar_clientes') ? { onDelete: async () => { await acao('cliente_excluir', { id: c.id }); location.hash = '#/clientes'; toast('Cliente removido.'); }, delLabel: 'Remover cliente', confirmDel: `Remover ${c.nome} da lista de clientes?` } : {});
  }

  /* ---------------- CONTEÚDO (blocos editáveis) ---------------- */
  const BLOCOS = {
    jornada: { t: 'Jornada do cliente', campos: ['titulo', 'texto'] },
    producao: { t: 'Fluxo de produção', campos: ['titulo', 'texto'] },
    stories: { t: 'Stories', campos: ['titulo', 'texto'] },
    qa: { t: 'Checklist de qualidade', campos: ['titulo', 'texto'] },
    padroes: { t: 'Padrões', campos: ['titulo', 'texto'] },
    nichos: { t: 'Playbook por nicho', campos: ['titulo', 'texto'] },
    papeis: { t: 'Divisão de papéis', campos: ['titulo', 'texto'] },
    boasPraticas: { t: 'Boas práticas', campos: ['titulo', 'categoria', 'texto'] },
    rituais: { t: 'Rituais da semana', campos: ['titulo', 'quando', 'texto'] },
    links: { t: 'Atalhos', campos: ['titulo', 'url'] },
    redeConceito: { t: 'Rede Conceito', campos: ['titulo', 'texto'] }
  };
  const PERM_BLOCO = {
    jornada: 'editar_fluxograma', producao: 'editar_fluxograma', stories: 'editar_fluxograma',
    qa: 'editar_processos', padroes: 'editar_processos', nichos: 'editar_processos', papeis: 'editar_processos',
    boasPraticas: 'editar_praticas', rituais: 'editar_inicio', links: 'editar_inicio', redeConceito: 'editar_inicio'
  };
  const ROTULO = { titulo: 'Título', texto: 'Texto', categoria: 'Categoria', quando: 'Quando', url: 'Endereço (https://…)' };

  const itemHtml = it => `<div class="item"><div class="t">${esc(it.titulo)}${lock(it)}</div>${it.texto ? `<div class="d">${esc(it.texto)}</div>` : ''}</div>`;
  const secBloco = (k, corpo) => `<h2 class="sec">${BLOCOS[k].t} ${edita(PERM_BLOCO[k]) ? btn('editarBloco', 'Editar', 'edit', 'btn-sm btn-ghost', k) : ''}</h2>${corpo}`;
  const fluxo = k => { const l = conteudo(k); return l.length ? `<div class="flow">${l.map((s, i) => `<div class="step"><div class="num">${pad(i + 1)}</div><div class="t">${esc(s.titulo)} ${lock(s)}</div>${s.texto ? `<div class="d">${esc(s.texto)}</div>` : ''}</div>`).join('')}</div>` : vazio('Nada cadastrado ainda.'); };
  const itens = k => { const l = conteudo(k); return l.length ? `<div class="items">${l.map(itemHtml).join('')}</div>` : vazio('Nada cadastrado ainda.'); };

  function fluxograma() {
    return cab('Fluxograma', 'Como o trabalho anda, do primeiro contato à publicação.') +
      secBloco('jornada', fluxo('jornada')) + secBloco('producao', fluxo('producao')) + secBloco('stories', fluxo('stories'));
  }

  function processos() {
    const qa = conteudo('qa');
    return cab('Processos', 'Padrões que garantem a qualidade das entregas.') +
      secBloco('qa', qa.length ? `<div class="items">${qa.map(i => `<div class="item check"><span class="box"></span><div><div class="t">${esc(i.titulo)}${lock(i)}</div>${i.texto ? `<div class="d">${esc(i.texto)}</div>` : ''}</div></div>`).join('')}</div>` : vazio('Nada cadastrado ainda.')) +
      secBloco('padroes', itens('padroes')) + secBloco('nichos', itens('nichos')) + secBloco('papeis', itens('papeis'));
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
    let lista = conteudo(k).map(x => Object.assign({}, x));
    const podeRestrito = can('ver_restrito');
    const linhas = () => lista.map((it, i) => `<div class="ed-row" data-i="${i}">
      <div class="fs">${cfg.campos.map(c => c === 'texto'
        ? `<textarea data-c="texto" placeholder="${ROTULO[c]}" style="min-height:64px">${esc(it.texto || '')}</textarea>`
        : `<input data-c="${c}" placeholder="${ROTULO[c]}" value="${esc(it[c] || '')}">`).join('')}
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
    modal(`Editar: ${cfg.t}`, `<div class="ed-list"></div><button type="button" class="btn btn-ghost" data-add>${ic('plus')}Adicionar item</button>`,
      async (_, form) => {
        ler(form);
        const valor = lista.map(it => {
          const o = {};
          cfg.campos.forEach(c => { o[c] = String(it[c] || '').trim(); });
          if (it.restrito) o.restrito = true;
          return o;
        }).filter(o => o.titulo);
        if (k === 'links' && valor.some(l => !/^https?:\/\//.test(l.url))) throw new Error('Os endereços dos atalhos precisam começar com https://');
        await acao('conteudo_salvar', { chave: k, valor });
        toast('Conteúdo salvo.');
      },
      { setup: form => {
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
      } });
  }

  /* ---------------- EQUIPE ---------------- */
  function equipe() {
    const gere = AREA === 'admin' && can('gerenciar_equipe');
    const lista = [...D.membros].sort((a, b) => (a.ordem - b.ordem) || a.nome.localeCompare(b.nome));
    const nomesPerm = Object.fromEntries((D.permissoes || []).map(p => [p.k, p.t]));
    return cab(gere ? 'Equipe e acessos' : 'Equipe', gere ? 'Cadastre a equipe, crie logins e defina o que cada um pode fazer.' : 'Quem faz parte do Studio Pulga.',
      gere ? btn('membroNovo', 'Novo membro', 'plus', 'btn-primary') : '') +
      `<div class="grid">${lista.map(m => `<div class="card">
        <div class="mem"><div class="avatar">${esc(iniciais(m.nome))}</div><div style="flex:1;min-width:0"><div class="nm">${esc(m.nome)}</div><div class="small muted">${esc(m.funcao || '')}</div></div>
        ${gere ? `<button class="icon-btn" data-act="membroEditar" data-id="${m.id}" title="Editar">${ic('edit')}</button>` : ''}</div>
        ${gere ? `<div class="small muted" style="margin-top:.5rem">Usuário: <b>${esc(m.usuario || '')}</b></div>
          <div class="perms">${m.dono ? '<span class="tag ok">Dono · acesso total</span>' : (m.permissoes || []).length ? m.permissoes.map(p => `<span class="tag">${esc(nomesPerm[p] || p)}</span>`).join('') : '<span class="tag">Só o site da equipe</span>'}</div>` : ''}
      </div>`).join('')}</div>`;
  }

  function formMembro(m = {}) {
    const perms = D.permissoes || [];
    const tem = new Set(m.permissoes || []);
    let grupo = '';
    const lista = perms.map(p => {
      const g = p.grupo !== grupo ? `<div class="g">${esc((grupo = p.grupo))}</div>` : '';
      return g + `<label><input type="checkbox" name="perm" value="${p.k}" data-multi="1"${tem.has(p.k) ? ' checked' : ''}${m.dono ? ' disabled checked' : ''}><div><b>${esc(p.t)}</b><span>${esc(p.d)}</span></div></label>`;
    }).join('');
    modal(m.id ? `Editar ${m.nome}` : 'Novo membro', `
      <input type="hidden" name="id" value="${esc(m.id || '')}">
      <div class="two">
        <label>Nome<input name="nome" maxlength="120" required value="${esc(m.nome || '')}"></label>
        <label>Função<input name="funcao" maxlength="120" value="${esc(m.funcao || '')}"></label>
      </div>
      <div class="two">
        <label>Usuário (login)<input name="usuario" maxlength="40" required autocapitalize="none" value="${esc(m.usuario || '')}"></label>
        <label>${m.id ? 'Nova senha <span class="hint">(deixe vazio para manter)</span>' : 'Senha inicial <span class="hint">(mín. 6)</span>'}<input type="text" name="senha" autocomplete="off" ${m.id ? '' : 'required minlength="6"'}></label>
      </div>
      <label>Ordem na lista<input type="number" name="ordem" value="${esc(m.ordem ?? 0)}"></label>
      <div><div style="font-size:.82rem;font-weight:500;color:var(--muted);margin-bottom:.4rem">Permissões ${m.dono ? '<span class="hint">(dono tem acesso total)</span>' : ''}</div><div class="perm-list">${lista}</div></div>`,
    async (f, form) => {
      const permissoes = [...form.querySelectorAll('input[name=perm]:checked:not(:disabled)')].map(c => c.value);
      const row = { id: f.id, nome: f.nome, funcao: f.funcao, usuario: f.usuario, ordem: f.ordem, permissoes: m.dono ? (m.permissoes || []) : permissoes };
      await acao('membro_salvar', { row, senha: f.senha });
      toast('Membro salvo.');
    },
    m.id && !m.dono && m.id !== D.me.id ? { onDelete: async () => { await acao('membro_excluir', { id: m.id }); toast('Membro removido.'); }, delLabel: 'Remover', confirmDel: `Remover ${m.nome}? O login dele(a) deixa de funcionar na hora.` } : {});
  }

  /* ---------------- ações dos botões ---------------- */
  const ACOES = {
    tarefaNova: () => formTarefa(),
    tarefaEditar: id => formTarefa(D.tarefas.find(t => t.id === id)),
    tarefaStatus: async (id, el) => {
      el.disabled = true;
      try { await acao('tarefa_status', { id, status: el.dataset.status }); await recarregar(); }
      catch (e) { if (e.message !== 'sessao') toast(e.message); el.disabled = false; }
    },
    pubNova: () => formPub(),
    pubAbrir: id => formPub(D.publicacoes.find(p => p.id === id)),
    semanaAnt: () => { semana--; render(); },
    semanaProx: () => { semana++; render(); },
    semanaHoje: () => { semana = 0; render(); },
    clienteNovo: () => formCliente(),
    clienteEditar: id => formCliente(cliente(id)),
    editarBloco: k => editarBloco(k),
    membroNovo: () => formMembro(),
    membroEditar: id => formMembro(membro(id))
  };

  carregar();
})();
