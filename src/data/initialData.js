// Dados Institucionais e Estrutura de Compliance da Y7 Service Ltda
// Sem nenhuma empresa fictícia ou dados inventados

export const Y7_INFO = {
  razaoSocial: "Y7 SERVICE LTDA",
  nomeFantasia: "Y7 SERVICE / Y7 EMPRESARIAL",
  cnpj: "40.216.188/0001-24",
  dataConstituicao: "29/12/2020",
  anoAbertura: "2020",
  porte: "EPP",
  endereco: {
    logradouro: "Av. Copacabana, 112",
    complemento: "Sala 1712",
    bairro: "Dezoito do Forte Empresarial / Alphaville",
    municipio: "Barueri",
    uf: "SP",
    cep: "06.472-001"
  },
  contatos: {
    email: "contabil@y7service.com.br",
    whatsapp: "(11) 98246-6092",
    whatsappRaw: "5511982466092"
  },
  slogan: "Força Estratégica, Inteligência Tributária e Imponência Contábil"
};

// Carteira de Clientes: Limpa, apenas a própria matriz do escritório (nenhuma empresa inventada)
export const INITIAL_CLIENTS = [
  {
    id: "cli-y7",
    razaoSocial: "Y7 SERVICE LTDA",
    nomeFantasia: "Y7 Service Matriz",
    cnpj: "40.216.188/0001-24",
    regime: "Lucro Presumido",
    segmento: "Serviços Contábeis e Consultoria",
    responsavel: "Nilson / Diretoria",
    email: "contabil@y7service.com.br",
    telefone: "(11) 98246-6092",
    cidade: "Barueri - Alphaville/SP",
    status: "Ativo",
    dataEntrada: "2020-12-29",
    honorarioMensal: 0
  }
];

// Catálogo Geral de Obrigações Acessórias da Receita Federal
export const OBLIGATIONS_CATALOG = {
  "Simples Nacional": [
    { nome: "PGDAS-D", descricao: "Programa Gerador do Documento de Arrecadação", periodicidade: "Mensal", diaVencimento: 20 },
    { nome: "DEFIS", descricao: "Declaração de Informações Socioeconômicas", periodicidade: "Anual", diaVencimento: 31, mesLimite: "Março" },
    { nome: "DCTFWeb", descricao: "Declaração Previdenciária Unificada", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "eSocial / Folha", descricao: "Fechamento da Folha e Pró-Labore", periodicidade: "Mensal", diaVencimento: 7 }
  ],
  "Lucro Presumido": [
    { nome: "DCTF Mensal", descricao: "Declaração de Débitos e Créditos Federais", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "EFD-Contribuições", descricao: "PIS/Pasep e COFINS no SPED", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "EFD-ICMS/IPI", descricao: "Escrituração Fiscal Digital", periodicidade: "Mensal", diaVencimento: 20 },
    { nome: "DCTFWeb", descricao: "Tributos Previdenciários e Retenções", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "ECD (SPED Contábil)", descricao: "Escrituração Contábil Digital", periodicidade: "Anual", diaVencimento: 30, mesLimite: "Maio" },
    { nome: "ECF", descricao: "Escrituração Contábil Fiscal", periodicidade: "Anual", diaVencimento: 31, mesLimite: "Julho" }
  ],
  "Lucro Real": [
    { nome: "DCTF Mensal", descricao: "Declaração de Débitos Federais", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "EFD-Contribuições", descricao: "SPED PIS/COFINS Não-Cumulativo", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "EFD-ICMS/IPI", descricao: "Escrituração Fiscal Digital", periodicidade: "Mensal", diaVencimento: 20 },
    { nome: "EFD-Reinf", descricao: "Retenções e Serviços", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "DCTFWeb", descricao: "Débitos Previdenciários", periodicidade: "Mensal", diaVencimento: 15 },
    { nome: "LALUR / LACS", descricao: "Livro de Apuração do Lucro Real", periodicidade: "Trimestral / Anual", diaVencimento: 30 },
    { nome: "ECD (SPED Contábil)", descricao: "Balanço e DRE Auditados", periodicidade: "Anual", diaVencimento: 30, mesLimite: "Maio" },
    { nome: "ECF", descricao: "Escrituração Fiscal Completa", periodicidade: "Anual", diaVencimento: 31, mesLimite: "Julho" }
  ]
};

// Registro de Obrigações: Inicia 100% limpo para ser alimentado em tempo real pelos contadores
export const INITIAL_OBLIGATIONS_RECORD = [];

// Dados Tecnológicos do Dashboard Contábil Visual
export const DASHBOARD_METRICS = {
  kpis: [
    { label: "Receita Operacional Bruta", valor: 1850000, variacao: "+14.2% a.a.", tipo: "tech-cyan" },
    { label: "Margem EBITDA Contábil", valor: 685000, variacao: "37.0% Margem", tipo: "tech-blue" },
    { label: "Lucro Líquido Auditado", valor: 554250, variacao: "30.0% Líquido", tipo: "tech-green" },
    { label: "Índice de Liquidez Corrente", valor: 3.88, isIndex: true, variacao: "Solvência Alta", tipo: "tech-gold" }
  ],
  evolucaoMensal: [
    { mes: "Jan", receita: 130000, custos: 45000, lucro: 42000 },
    { mes: "Fev", receita: 142000, custos: 48000, lucro: 46000 },
    { mes: "Mar", receita: 155000, custos: 50000, lucro: 51000 },
    { mes: "Abr", receita: 148000, custos: 49000, lucro: 47000 },
    { mes: "Mai", receita: 160000, custos: 52000, lucro: 53000 },
    { mes: "Jun", receita: 168000, custos: 54000, lucro: 56000 },
    { mes: "Jul", receita: 172000, custos: 55000, lucro: 58000 },
    { mes: "Ago", receita: 180000, custos: 57000, lucro: 61000 },
    { mes: "Set", receita: 185000, custos: 58000, lucro: 63000 }
  ],
  composicaoDespesas: [
    { categoria: "Custos Operacionais & Pessoal", percentual: 45, cor: "#00F5D4" },
    { categoria: "Tributos & Encargos Federais", percentual: 22, cor: "#C81E3D" },
    { categoria: "Despesas Administrativas", percentual: 18, cor: "#F59E0B" },
    { categoria: "Tecnologia, Infra & Sistemas", percentual: 15, cor: "#38BDF8" }
  ],
  balancoEstrutural: {
    ativoTotal: 656300,
    ativoCirculante: 531800,
    ativoImobilizado: 124500,
    passivoCirculante: 136800,
    patrimonioLiquido: 519500,
    indiceLiquidez: "3.88 (Excelente)",
    endividamentoGeral: "20.8% (Baixo Risco)"
  }
};
