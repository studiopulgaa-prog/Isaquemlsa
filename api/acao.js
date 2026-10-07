const { rpc } = require('./_db');
const { getUser, send } = require('./_auth');
const { PERMISSOES, CHAVE_PERM, pode } = require('./_perm');

const str = (v, n = 2000) => String(v ?? '').trim().slice(0, n);
const lista = v => (Array.isArray(v) ? v : String(v || '').split('\n')).map(x => str(x, 1000)).filter(Boolean).slice(0, 60);
const data = v => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? v : null);
const uuid = v => (/^[0-9a-f-]{36}$/.test(String(v || '')) ? v : null);
const um = (v, ops, def) => (ops.includes(v) ? v : def);
const uuids = v => (Array.isArray(v) ? v : []).map(uuid).filter(Boolean).slice(0, 40);
const email = v => { const e = str(v, 120).toLowerCase(); return !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null; };
const B64 = /^[A-Za-z0-9+/]*={0,2}$/;
const PARTE_MAX = 2 * 1024 * 1024 * 4 / 3 + 8; // ~2 MB por parte (em base64)
const ARQUIVO_MAX = 25 * 1024 * 1024;
const slugify = s => str(s, 80).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cliente';

class Negado extends Error {}
const exigir = (ok, msg = 'Você não tem permissão para isso.') => { if (!ok) throw new Negado(msg); };

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { ok: false });
  try {
    const me = await getUser(req);
    if (!me) return send(res, 401, { ok: false, erro: 'Sessão expirada. Entre de novo.' });
    const b = req.body || {};
    const gestao = pode(me, 'acesso_gestao');
    const P = p => gestao && pode(me, p);
    let out = { ok: true };

    switch (b.op) {
      // ---------- TAREFAS ----------
      case 'tarefa_status': {
        const t = await rpc('get', { tabela: 'eq_tarefas', id: uuid(b.id) });
        exigir(t && (t.membro_id === me.id || P('gerenciar_tarefas')));
        const status = um(b.status, ['pendente', 'fazendo', 'feito'], 'pendente');
        const agora = new Date().toISOString();
        const row = { id: t.id, status, concluido_em: status === 'feito' ? agora : null };
        if (status !== 'pendente' && !t.iniciado_em) row.iniciado_em = agora;
        if (status === 'pendente') row.iniciado_em = null;
        out.row = await rpc('upsert', { tabela: 'eq_tarefas', row });
        break;
      }
      case 'tarefa_salvar': {
        const r = b.row || {};
        // Gestão atribui para qualquer pessoa; cada um pode criar e editar as próprias tarefas
        const gere = P('gerenciar_tarefas');
        if (!gere) {
          exigir(uuid(r.membro_id) === me.id, 'Você só pode criar tarefas para você mesmo.');
          if (uuid(r.id)) {
            const atual = await rpc('get', { tabela: 'eq_tarefas', id: r.id });
            exigir(atual && atual.membro_id === me.id && atual.criado_por === me.id, 'Só a gestão pode editar tarefas atribuídas a você.');
          }
        }
        const row = {
          membro_id: uuid(r.membro_id), titulo: str(r.titulo, 200), descricao: str(r.descricao),
          prioridade: um(r.prioridade, ['alta', 'media', 'baixa'], 'media'), prazo: data(r.prazo),
          status: um(r.status, ['pendente', 'fazendo', 'feito'], 'pendente'), cliente_id: uuid(r.cliente_id)
        };
        exigir(row.titulo && row.membro_id, 'Preencha o título e o responsável.');
        if (uuid(r.id)) {
          row.id = r.id;
          const atual = await rpc('get', { tabela: 'eq_tarefas', id: r.id });
          exigir(atual, 'Tarefa não encontrada.');
          if (atual.status !== row.status) {
            const agora = new Date().toISOString();
            row.concluido_em = row.status === 'feito' ? agora : null;
            if (row.status !== 'pendente' && !atual.iniciado_em) row.iniciado_em = agora;
          }
        } else {
          row.criado_por = me.id;
          if (row.status === 'feito') row.concluido_em = new Date().toISOString();
          if (row.status !== 'pendente') row.iniciado_em = new Date().toISOString();
        }
        out.row = await rpc('upsert', { tabela: 'eq_tarefas', row });
        break;
      }
      case 'tarefa_excluir': {
        const t = await rpc('get', { tabela: 'eq_tarefas', id: uuid(b.id) });
        exigir(t && (P('gerenciar_tarefas') || (t.membro_id === me.id && t.criado_por === me.id)));
        await rpc('remover', { tabela: 'eq_tarefas', id: t.id });
        break;
      }
      case 'tarefa_erro': {
        exigir(P('gerenciar_tarefas'));
        const t = await rpc('get', { tabela: 'eq_tarefas', id: uuid(b.id) });
        exigir(t, 'Tarefa não encontrada.');
        const texto = str(b.texto, 500);
        exigir(texto, 'Descreva o erro ou ajuste.');
        const erros = (Array.isArray(t.erros) ? t.erros : []).concat({ texto, por: me.id, em: new Date().toISOString() }).slice(-30);
        out.row = await rpc('upsert', { tabela: 'eq_tarefas', row: { id: t.id, erros } });
        break;
      }

      // ---------- CALENDÁRIO ----------
      case 'evento_salvar': {
        exigir(P('gerenciar_calendario'));
        const r = b.row || {};
        const row = {
          titulo: str(r.titulo, 200), tipo: um(r.tipo, ['reuniao', 'entrega', 'prazo', 'outro'], 'reuniao'),
          data: data(r.data), hora: str(r.hora, 5), descricao: str(r.descricao, 1000),
          cliente_id: uuid(r.cliente_id), participantes: uuids(r.participantes)
        };
        exigir(row.titulo && row.data, 'Preencha o título e o dia.');
        if (uuid(r.id)) row.id = r.id; else row.criado_por = me.id;
        out.row = await rpc('upsert', { tabela: 'eq_eventos', row });
        break;
      }
      case 'evento_status': {
        const e = await rpc('get', { tabela: 'eq_eventos', id: uuid(b.id) });
        exigir(e && (P('gerenciar_calendario') || !(e.participantes || []).length || e.participantes.includes(me.id)));
        const concluido = !!b.concluido;
        out.row = await rpc('upsert', { tabela: 'eq_eventos', row: { id: e.id, concluido, concluido_em: concluido ? new Date().toISOString() : null } });
        break;
      }
      case 'evento_excluir':
        exigir(P('gerenciar_calendario'));
        await rpc('remover', { tabela: 'eq_eventos', id: uuid(b.id) });
        break;

      // ---------- OBSERVAÇÕES DA SEMANA ----------
      case 'nota_salvar': {
        const r = b.row || {};
        const row = { tipo: um(r.tipo, ['observacao', 'solicitacao'], 'observacao'), texto: str(r.texto, 2000) };
        exigir(row.texto, 'Escreva a observação.');
        if (uuid(r.id)) {
          const n = await rpc('get', { tabela: 'eq_notas', id: r.id });
          exigir(n && (n.membro_id === me.id || P('editar_clientes')), 'Só quem escreveu pode editar.');
          row.id = r.id;
        } else {
          const c = await rpc('get', { tabela: 'eq_clientes', id: uuid(r.cliente_id) });
          exigir(c && !c.removido, 'Cliente não encontrado.');
          row.cliente_id = c.id; row.membro_id = me.id;
        }
        out.row = await rpc('upsert', { tabela: 'eq_notas', row });
        break;
      }
      case 'nota_excluir': {
        const n = await rpc('get', { tabela: 'eq_notas', id: uuid(b.id) });
        exigir(n && (n.membro_id === me.id || P('editar_clientes')), 'Só quem escreveu pode excluir.');
        await rpc('remover', { tabela: 'eq_notas', id: n.id });
        break;
      }

      // ---------- ARQUIVOS (onboarding e formulário em PDF, enviados em partes) ----------
      case 'arquivo_inicio': {
        exigir(P('gerenciar_clientes'));
        const c = await rpc('get', { tabela: 'eq_clientes', id: uuid(b.cliente_id) });
        exigir(c && !c.removido, 'Cliente não encontrado.');
        exigir(Number(b.tamanho) > 0 && Number(b.tamanho) <= ARQUIVO_MAX, 'O PDF pode ter no máximo 25 MB.');
        const parte = String(b.parte || '');
        exigir(parte.length <= PARTE_MAX && B64.test(parte), 'Parte inválida.');
        const r = await rpc('arquivo_novo', {
          cliente_id: c.id, tipo: um(b.tipo, ['onboarding', 'formulario', 'outro'], 'outro'),
          nome: str(b.nome, 160) || 'documento.pdf', mime: 'application/pdf', enviado_por: me.id, parte
        });
        out.id = r.id;
        break;
      }
      case 'arquivo_parte': {
        exigir(P('gerenciar_clientes'));
        const parte = String(b.parte || '');
        exigir(uuid(b.id) && parte.length <= PARTE_MAX && B64.test(parte), 'Parte inválida.');
        const r = await rpc('arquivo_parte', { id: b.id, parte });
        exigir(r && r.ok, 'Envio interrompido. Tente de novo.');
        break;
      }
      case 'arquivo_fim': {
        exigir(P('gerenciar_clientes'));
        const r = await rpc('arquivo_fim', { id: uuid(b.id) });
        exigir(r, 'Arquivo não encontrado.');
        if (r.tamanho > ARQUIVO_MAX) { await rpc('remover', { tabela: 'eq_arquivos', id: r.id }); exigir(false, 'O PDF pode ter no máximo 25 MB.'); }
        out.row = r;
        break;
      }
      case 'arquivo_excluir':
        exigir(P('gerenciar_clientes'));
        await rpc('remover', { tabela: 'eq_arquivos', id: uuid(b.id) });
        break;

      // ---------- PUBLICAÇÕES ----------
      case 'pub_status': {
        const p = await rpc('get', { tabela: 'eq_publicacoes', id: uuid(b.id) });
        exigir(p && (p.responsavel_id === me.id || P('gerenciar_publicacoes')));
        out.row = await rpc('upsert', { tabela: 'eq_publicacoes', row: { id: p.id, status: um(b.status, ['programado', 'publicado'], 'programado') } });
        break;
      }
      case 'pub_salvar': {
        exigir(P('gerenciar_publicacoes'));
        const r = b.row || {};
        const row = {
          cliente_id: uuid(r.cliente_id), descricao: str(r.descricao, 300), formato: str(r.formato, 60),
          data: data(r.data), hora: str(r.hora, 5), responsavel_id: uuid(r.responsavel_id),
          status: um(r.status, ['programado', 'publicado'], 'programado')
        };
        exigir(row.cliente_id && row.data, 'Escolha o cliente e o dia.');
        if (uuid(r.id)) row.id = r.id;
        out.row = await rpc('upsert', { tabela: 'eq_publicacoes', row });
        break;
      }
      case 'pub_excluir':
        exigir(P('gerenciar_publicacoes'));
        await rpc('remover', { tabela: 'eq_publicacoes', id: uuid(b.id) });
        break;

      // ---------- CLIENTES ----------
      case 'cliente_salvar': {
        const r = b.row || {};
        const novo = !uuid(r.id);
        exigir(novo ? P('gerenciar_clientes') : P('editar_clientes'));
        const row = {
          nome: str(r.nome, 120), nicho: str(r.nicho, 60), servico: str(r.servico, 300), status: str(r.status, 60) || 'Ativo',
          plano: str(r.plano, 120), saude: um(r.saude, ['ok', 'atencao', 'risco', 'novo', 'avaliar'], 'avaliar'),
          resumo: str(r.resumo, 600), rede: !!r.rede, instagram: str(r.instagram, 60).replace(/^@/, ''),
          aprovacao: str(r.aprovacao, 300), aparecem: str(r.aparecem, 300), desde: str(r.desde, 40),
          sobre: lista(r.sobre), objetivo: lista(r.objetivo), posicionamento: lista(r.posicionamento),
          ideias: lista(r.ideias), atencao: lista(r.atencao), como_agir: lista(r.como_agir),
          paleta: str(r.paleta, 400), musica: str(r.musica, 300), tipografia_feed: str(r.tipografia_feed, 200),
          tipografia_story: str(r.tipografia_story, 200), tipografia_muda: str(r.tipografia_muda, 400),
          observacoes: str(r.observacoes, 3000), atualizado_em: new Date().toISOString()
        };
        exigir(row.nome, 'Preencha o nome do cliente.');
        if (novo) row.slug = slugify(row.nome) + '-' + Date.now().toString(36).slice(-4); else row.id = r.id;
        out.row = await rpc('upsert', { tabela: 'eq_clientes', row });
        break;
      }
      case 'cliente_excluir':
        exigir(P('gerenciar_clientes'));
        await rpc('remover', { tabela: 'eq_clientes', id: uuid(b.id) });
        break;

      // ---------- CONTEÚDO (fluxograma, processos, práticas, rituais, atalhos) ----------
      case 'conteudo_salvar': {
        const perm = CHAVE_PERM[b.chave];
        exigir(perm && P(perm));
        exigir(Array.isArray(b.valor) && b.valor.length <= 80, 'Formato inválido.');
        if (!pode(me, 'ver_restrito')) {
          const d = await rpc('dump');
          const atual = d.conteudo[b.chave] || [];
          exigir(!atual.some(i => i && i.restrito), 'Este bloco tem itens restritos. Peça a permissão "Ver conteúdo restrito" para editar.');
        }
        const valor = JSON.parse(JSON.stringify(b.valor));
        exigir(JSON.stringify(valor).length < 60000, 'Conteúdo grande demais.');
        await rpc('conteudo_set', { chave: b.chave, valor });
        break;
      }

      // ---------- EQUIPE E ACESSOS ----------
      case 'membro_salvar': {
        exigir(P('gerenciar_equipe'));
        const r = b.row || {};
        const validas = PERMISSOES.map(p => p.k);
        const row = {
          nome: str(r.nome, 120), funcao: str(r.funcao, 120), email: email(r.email),
          usuario: str(r.usuario, 40).toLowerCase().replace(/[^a-z0-9._-]/g, ''),
          permissoes: (Array.isArray(r.permissoes) ? r.permissoes : []).filter(p => validas.includes(p)),
          ordem: Number(r.ordem) || 0
        };
        exigir(row.nome && row.usuario, 'Preencha nome e usuário.');
        exigir(row.email !== null, 'E-mail inválido.');
        if (uuid(r.id)) {
          const alvo = await rpc('get', { tabela: 'eq_membros', id: r.id });
          exigir(alvo, 'Membro não encontrado.');
          exigir(!alvo.dono || me.dono, 'Só o dono pode alterar o próprio cadastro de dono.');
          row.id = r.id;
        } else {
          exigir(str(b.senha).length >= 6, 'Defina uma senha inicial com pelo menos 6 caracteres.');
        }
        try { out.row = await rpc('upsert', { tabela: 'eq_membros', row }); }
        catch (e) { throw new Negado(/duplicate|unique/i.test(e.message) ? 'Esse usuário já existe. Escolha outro.' : 'Não foi possível salvar.'); }
        if (str(b.senha)) {
          exigir(str(b.senha).length >= 6, 'A senha precisa ter pelo menos 6 caracteres.');
          await rpc('senha', { id: out.row.id, senha: str(b.senha, 100) });
        }
        break;
      }
      case 'membro_excluir': {
        exigir(P('gerenciar_equipe'));
        const alvo = await rpc('get', { tabela: 'eq_membros', id: uuid(b.id) });
        exigir(alvo && !alvo.dono, 'O dono não pode ser removido.');
        exigir(alvo.id !== me.id, 'Você não pode remover a si mesmo.');
        await rpc('remover', { tabela: 'eq_membros', id: alvo.id });
        break;
      }
      case 'meu_email': {
        const e = email(b.email);
        exigir(e !== null, 'E-mail inválido.');
        out.row = await rpc('upsert', { tabela: 'eq_membros', row: { id: me.id, email: e } });
        delete out.row.permissoes;
        break;
      }
      case 'minha_senha': {
        const ok = await rpc('login', { usuario: me.usuario, senha: str(b.atual, 200) });
        exigir(ok, 'Senha atual incorreta.');
        exigir(str(b.nova).length >= 6, 'A nova senha precisa ter pelo menos 6 caracteres.');
        await rpc('senha', { id: me.id, senha: str(b.nova, 100) });
        break;
      }
      default:
        return send(res, 400, { ok: false, erro: 'Ação inválida.' });
    }
    send(res, 200, out);
  } catch (e) {
    if (e instanceof Negado) return send(res, 403, { ok: false, erro: e.message });
    send(res, 500, { ok: false, erro: 'Erro no servidor. Tente de novo.' });
  }
};
