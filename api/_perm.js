// Permissões que podem ser dadas a cada login (aparecem descritas na tela de Acessos)
const PERMISSOES = [
  { k: 'acesso_gestao', grupo: 'Acesso', t: 'Painel de gestão', d: 'Entra no painel de gestão (/admin). Sem isso, a pessoa só vê o site da equipe, mesmo tendo outras permissões de edição.' },
  { k: 'ver_restrito', grupo: 'Visualização', t: 'Ver conteúdo restrito', d: 'Vê tudo que está marcado como "Restrito": etapas comerciais da jornada (Lead, Proposta, Contrato), atalhos de Propostas, Formulário e Portal do cliente, e práticas internas da liderança.' },
  { k: 'ver_tarefas_equipe', grupo: 'Visualização', t: 'Ver tarefas de todos', d: 'Vê as tarefas de toda a equipe. Sem isso, cada um vê só as próprias tarefas.' },
  { k: 'gerenciar_tarefas', grupo: 'Gestão', t: 'Gerenciar tarefas', d: 'Cria, edita, atribui, define prioridade e prazo, e exclui tarefas de qualquer pessoa.' },
  { k: 'gerenciar_publicacoes', grupo: 'Gestão', t: 'Gerenciar agenda de publicações', d: 'Cria, edita e exclui as publicações da semana (cliente, formato, dia, horário e responsável).' },
  { k: 'editar_clientes', grupo: 'Clientes', t: 'Editar fichas de clientes', d: 'Altera serviço, status, plano, saúde, sobre, objetivo, posicionamento, ideias, pontos de atenção e como agir.' },
  { k: 'gerenciar_clientes', grupo: 'Clientes', t: 'Adicionar e remover clientes', d: 'Cadastra clientes novos e remove clientes da lista.' },
  { k: 'editar_fluxograma', grupo: 'Conteúdo', t: 'Editar fluxograma', d: 'Edita, escreve, adiciona, exclui e muda a ordem das etapas (jornada, produção e stories).' },
  { k: 'editar_processos', grupo: 'Conteúdo', t: 'Editar processos', d: 'Edita o checklist de qualidade, os padrões, o playbook por nicho e a divisão de papéis.' },
  { k: 'editar_praticas', grupo: 'Conteúdo', t: 'Editar boas práticas', d: 'Edita, adiciona, exclui e marca como restritas as boas práticas.' },
  { k: 'editar_inicio', grupo: 'Conteúdo', t: 'Editar rituais e atalhos', d: 'Edita os rituais da semana, os atalhos da tela inicial e o texto da Rede Conceito.' },
  { k: 'gerenciar_equipe', grupo: 'Administração', t: 'Gerenciar equipe e acessos', d: 'Adiciona e remove membros, cria logins, redefine senhas e define as permissões de cada um.' }
];

// Qual permissão edita cada bloco de conteúdo
const CHAVE_PERM = {
  jornada: 'editar_fluxograma', producao: 'editar_fluxograma', stories: 'editar_fluxograma',
  padroes: 'editar_processos', papeis: 'editar_processos', qa: 'editar_processos', nichos: 'editar_processos',
  boasPraticas: 'editar_praticas',
  rituais: 'editar_inicio', links: 'editar_inicio', redeConceito: 'editar_inicio'
};

function pode(me, p) { return !!me && (me.dono || (me.permissoes || []).includes(p)); }

module.exports = { PERMISSOES, CHAVE_PERM, pode };
