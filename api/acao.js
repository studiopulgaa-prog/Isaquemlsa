const { rpc } = require('./_db');
const { getUser, send } = require('./_auth');
const { PERMISSOES, CHAVE_PERM, pode } = require('./_perm');

const str = (v, n = 2000) => String(v ?? '').trim().slice(0, n);
const lista = v => (Array.isArray(v) ? v : String(v || '').split('\n')).map(x => str(x, 1000)).filter(Boolean).slice(0, 60);
const data = v => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? v : null);
const uuid = v => (/^[0-9a-f-]{36}$/.test(String(v || '')) ? v : null);
const um = (v, ops, def) => (ops.includes(v) ? v : def);
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
        out.row = await rpc('upsert', { tabela: 'eq_tarefas', row: { id: t.id, status, concluido_em: status === 'feito' ? new Date().toISOString() : null } });
        break;
      }
      case 'tarefa_salvar': {
        exigir(P('gerenciar_tarefas'));
        const r = b.row || {};
        const row = {
          membro_id: uuid(r.membro_id), titulo: str(r.titulo, 200), descricao: str(r.descricao),
          prioridade: um(r.prioridade, ['alta', 'media', 'baixa'], 'media'), prazo: data(r.prazo),
          status: um(r.status, ['pendente', 'fazendo', 'feito'], 'pendente'), cliente_id: uuid(r.cliente_id)
        };
        exigir(row.titulo && row.membro_id, 'Preencha o título e o responsável.');
        if (uuid(r.id)) row.id = r.id; else row.criado_por = me.id;
        out.row = await rpc('upsert', { tabela: 'eq_tarefas', row });
        break;
      }
      case 'tarefa_excluir':
        exigir(P('gerenciar_tarefas'));
        await rpc('remover', { tabela: 'eq_tarefas', id: uuid(b.id) });
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
          ideias: lista(r.ideias), atencao: lista(r.atencao), como_agir: lista(r.como_agir), atualizado_em: new Date().toISOString()
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
          nome: str(r.nome, 120), funcao: str(r.funcao, 120),
          usuario: str(r.usuario, 40).toLowerCase().replace(/[^a-z0-9._-]/g, ''),
          permissoes: (Array.isArray(r.permissoes) ? r.permissoes : []).filter(p => validas.includes(p)),
          ordem: Number(r.ordem) || 0
        };
        exigir(row.nome && row.usuario, 'Preencha nome e usuário.');
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
