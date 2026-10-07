// Conteúdo inicial (usado só na primeira carga; depois tudo é editado pelo painel de gestão)
// Formato de cada bloco: lista de itens { titulo, texto, restrito? } (+ campos extras por bloco)

module.exports = {
  clientes: [],

  conteudo: {
    /* ---- FLUXOGRAMA ---- */
    jornada: [
      { titulo: 'Lead', texto: 'Primeiro contato. Entender o negócio, o momento e o que a pessoa procura.', restrito: true },
      { titulo: 'Proposta', texto: 'Montar e enviar a proposta pelo site de propostas. Acompanhar a resposta.', restrito: true },
      { titulo: 'Contrato', texto: 'Contrato assinado e primeira cobrança emitida.', restrito: true },
      { titulo: 'Onboarding', texto: 'Cliente preenche o formulário de onboarding. Criar a ficha do cliente no painel.' },
      { titulo: 'Planejamento', texto: 'Definir objetivo, posicionamento, linhas editoriais e calendário do mês.' },
      { titulo: 'Produção', texto: 'Roteiro, captação, edição e design seguindo o fluxo de produção.' },
      { titulo: 'Aprovação', texto: 'Enviar para o cliente aprovar dentro do prazo combinado.' },
      { titulo: 'Publicação', texto: 'Agendar ou publicar conforme a agenda de publicações.' },
      { titulo: 'Relatório', texto: 'Fechar o mês com resultados, aprendizados e próximos passos.' }
    ],
    producao: [
      { titulo: 'Pauta', texto: 'Ideia aprovada no planejamento, com objetivo claro.' },
      { titulo: 'Roteiro / copy', texto: 'Texto, gancho e chamada para ação.' },
      { titulo: 'Captação', texto: 'Gravação ou fotos, seguindo o roteiro.' },
      { titulo: 'Edição / design', texto: 'Montagem da peça final no padrão visual do cliente.' },
      { titulo: 'Revisão', texto: 'Passar no checklist de qualidade antes de enviar.' },
      { titulo: 'Aprovação do cliente', texto: 'Enviar e registrar o retorno.' },
      { titulo: 'Agendamento', texto: 'Programar na agenda de publicações.' }
    ],
    stories: [
      { titulo: 'Bastidores', texto: 'Mostrar o dia a dia e as pessoas por trás do negócio.' },
      { titulo: 'Interação', texto: 'Enquetes, caixinhas e perguntas para gerar conversa.' },
      { titulo: 'Oferta', texto: 'Chamada clara para o produto ou serviço, com link.' }
    ],

    /* ---- PROCESSOS ---- */
    qa: [
      { titulo: 'Texto revisado', texto: 'Sem erros de português, com tom de voz do cliente.' },
      { titulo: 'Identidade visual', texto: 'Cores, fontes e logo no padrão do cliente.' },
      { titulo: 'Formato certo', texto: 'Tamanho e duração corretos para a rede e o formato.' },
      { titulo: 'Chamada para ação', texto: 'A peça diz o que a pessoa deve fazer em seguida.' },
      { titulo: 'Legenda e hashtags', texto: 'Legenda pronta e revisada junto da peça.' }
    ],
    padroes: [
      { titulo: 'Prazos', texto: 'Material para aprovação com pelo menos 2 dias úteis de antecedência.' },
      { titulo: 'Nomes de arquivo', texto: 'cliente_formato_data (ex.: loja_reels_2026-10-07).' }
    ],
    nichos: [
      { titulo: 'Exemplo de nicho', texto: 'Descreva aqui o que funciona melhor para este tipo de cliente.' }
    ],
    papeis: [
      { titulo: 'Direção', texto: 'Estratégia, comercial e decisões finais.' },
      { titulo: 'Criação', texto: 'Ideias, roteiros e direção criativa.' },
      { titulo: 'Operações', texto: 'Prazos, agenda e organização da equipe.' },
      { titulo: 'Social media', texto: 'Planejamento, legendas, publicação e interação.' },
      { titulo: 'Vídeo', texto: 'Captação e edição de vídeos.' },
      { titulo: 'Design', texto: 'Peças estáticas, carrosséis e identidade visual.' }
    ],

    /* ---- BOAS PRÁTICAS ---- */
    boasPraticas: [
      { titulo: 'Comunicação com o cliente', categoria: 'Atendimento', texto: 'Responder no mesmo dia útil, mesmo que seja para dizer quando vai ter a resposta completa.' },
      { titulo: 'Organização dos arquivos', categoria: 'Produção', texto: 'Tudo na pasta do cliente, com o nome no padrão combinado.' }
    ],

    /* ---- INÍCIO ---- */
    rituais: [
      { titulo: 'Reunião de planejamento', quando: 'Segunda', texto: 'Prioridades da semana e distribuição das tarefas.' },
      { titulo: 'Revisão de entregas', quando: 'Quinta', texto: 'Checar o que está atrasado e o que vai para aprovação.' }
    ],
    links: [
      { titulo: 'Site Studio Pulga', url: 'https://studiopulga.com.br' },
      { titulo: 'Propostas', url: 'https://proposta.studiopulga.com.br', restrito: true },
      { titulo: 'Formulário de onboarding', url: 'https://formulario.studiopulga.com.br', restrito: true }
    ],
    redeConceito: [
      { titulo: 'Rede Conceito', texto: 'Escreva aqui o que é a Rede Conceito e como a equipe deve tratar os clientes que fazem parte dela.' }
    ]
  }
};
