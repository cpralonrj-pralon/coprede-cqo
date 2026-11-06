import type { 
  ActionPlan, 
  AnalystCertification, 
  NotificationAlert 
} from '../types';

export const INITIAL_KPIS = {
  iqo: 96.4,
  iqoMeta: 95.0,
  iqoDelta: 1.2,
  auditoriasRealizadas: 1245,
  auditoriasDelta: 8.0,
  naoConformidades: 84,
  naoConformidadesDelta: -18.0,
  desviosGraves: 7,
  desviosGravesDelta: -50.0,
  reincidencias: 12,
  reincidenciasDelta: -25.0,
  igpFeedbackNoPrazo: 93.0,
  igpMeta: 100.0,
  igpDelta: -4.0,
};

export const EVOLUCAO_IQO = [
  { mes: 'Jan/25', iqo: 95.0, meta: 95.0 },
  { mes: 'Fev/25', iqo: 96.1, meta: 95.0 },
  { mes: 'Mar/25', iqo: 94.3, meta: 95.0 },
  { mes: 'Abr/25', iqo: 96.8, meta: 95.0 },
  { mes: 'Mai/25', iqo: 96.0, meta: 95.0 },
  { mes: 'Jun/25', iqo: 96.4, meta: 95.0 },
];

export const AUDITORIAS_POR_PROCESSO = [
  { name: 'Outages', value: 512, pct: 41, color: '#0284c7' },
  { name: 'Baixas Offline', value: 254, pct: 20, color: '#0d9488' },
  { name: 'Acionamentos', value: 228, pct: 18, color: '#16a34a' },
  { name: 'Escalonamentos', value: 151, pct: 12, color: '#ea580c' },
  { name: 'Outros', value: 100, pct: 9, color: '#9333ea' },
];

export const RESULTADO_AUDITORIAS = [
  { processo: 'Outages', conforme: 495, naoConforme: 25 },
  { processo: 'Baixas Offline', conforme: 230, naoConforme: 24 },
  { processo: 'Acionamentos', conforme: 210, naoConforme: 18 },
  { processo: 'Escalonamentos', conforme: 142, naoConforme: 9 },
];

export const TOP_NAO_CONFORMIDADES = [
  { tipo: 'Escalonamento incorreto', pct: 35, count: 29 },
  { tipo: 'Quantidade de ativos incorreta', pct: 25, count: 21 },
  { tipo: 'Falta de evidência', pct: 15, count: 13 },
  { tipo: 'Fraseologia inadequada', pct: 10, count: 8 },
  { tipo: 'Solução incorreta', pct: 8, count: 7 },
  { tipo: 'Outros', pct: 7, count: 6 },
];

export const RANKING_SUPERVISORES = [
  { rank: 1, supervisor: 'Carlos Mendes', auditorias: 280, iqo: 98.2, status: 'green' },
  { rank: 2, supervisor: 'Fernanda Lima', auditorias: 245, iqo: 97.1, status: 'green' },
  { rank: 3, supervisor: 'Rodrigo Alves', auditorias: 220, iqo: 95.3, status: 'green' },
  { rank: 4, supervisor: 'Juliana Costa', auditorias: 260, iqo: 92.7, status: 'amber' },
  { rank: 5, supervisor: 'Marcelo Prado', auditorias: 240, iqo: 91.8, status: 'amber' },
];

export const TOP_ANALISTAS_NC = [
  { rank: 1, analista: 'João Silva', nc: 12, iqo: 85.0, status: 'red' },
  { rank: 2, analista: 'Maria Santos', nc: 10, iqo: 88.0, status: 'red' },
  { rank: 3, analista: 'Pedro Henrique', nc: 9, iqo: 90.0, status: 'amber' },
  { rank: 4, analista: 'Ana Souza', nc: 8, iqo: 91.0, status: 'amber' },
  { rank: 5, analista: 'Lucas Ferreira', nc: 7, iqo: 92.0, status: 'amber' },
];

export const REINCIDENCIA_ANALISTAS = [
  { ocorrencia: '1ª ocorrência', analistas: 25, fill: '#0284c7' },
  { ocorrencia: '2ª ocorrência', analistas: 8, fill: '#2563eb' },
  { ocorrencia: '3ª ocorrência', analistas: 3, fill: '#ea580c' },
  { ocorrencia: '4ª ocorrência ou mais', analistas: 1, fill: '#dc2626' },
];

export const STATUS_PLANO_ACAO = [
  { name: 'Concluídas', value: 18, color: '#16a34a' },
  { name: 'Em andamento', value: 5, color: '#eab308' },
  { name: 'Atrasadas', value: 3, color: '#dc2626' },
];

export const MATRIZ_QUALIDADE = [
  { processo: 'Outage', abr: 'green', mai: 'green', jun: 'green', tendencia: 'up' },
  { processo: 'Baixa Offline', abr: 'green', mai: 'green', jun: 'green', tendencia: 'up' },
  { processo: 'Acionamento', abr: 'amber', mai: 'red', jun: 'amber', tendencia: 'up' },
  { processo: 'Escalonamento', abr: 'green', mai: 'amber', jun: 'green', tendencia: 'flat' },
  { processo: 'Tratativa GPON', abr: 'green', mai: 'green', jun: 'green', tendencia: 'up' },
];

export const INITIAL_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'PA-2025-0101',
    auditId: 'AUD-8831',
    protocol: 'INC-994821',
    analyst: 'João Silva',
    supervisor: 'Carlos Mendes',
    process: 'Outages',
    deviationType: 'Escalonamento incorreto',
    description: 'Ticket escalonado para N3 sem validação de anel de fibra primário.',
    rootCause: 'Falta de consulta ao mapa de topologia GIS no fechamento de janela.',
    what: 'Reciclagem prática no módulo de roteamento de chamado GIS',
    why: 'Evitar chamados indevidos a especialistas de plantão N3',
    who: 'Carlos Mendes (Supervisor)',
    when: '2025-06-18',
    daysOpen: 11,
    escalationLevel: 2,
    status: 'Escalada D+10',
    createdAt: '2025-06-17',
  },
  {
    id: 'PA-2025-0102',
    auditId: 'AUD-8842',
    protocol: 'INC-995104',
    analyst: 'Maria Santos',
    supervisor: 'Fernanda Lima',
    process: 'Baixas Offline',
    deviationType: 'Quantidade de ativos incorreta',
    description: 'Declarada baixa de 4 switches quando havia 11 elementos afetados.',
    rootCause: 'Fechamento rápido sem checagem de alarmes de correlação no Zabbix.',
    what: 'Revisão do checklist obrigatório de verificação de ativos',
    why: 'Impacto na precisão do indicador de disponibilidade MTTR da regional',
    who: 'Fernanda Lima (Supervisora)',
    when: '2025-06-22',
    daysOpen: 6,
    escalationLevel: 1,
    status: 'Escalada D+5',
    createdAt: '2025-06-22',
  },
  {
    id: 'PA-2025-0103',
    auditId: 'AUD-8859',
    protocol: 'INC-996311',
    analyst: 'Pedro Henrique',
    supervisor: 'Rodrigo Alves',
    process: 'Acionamentos',
    deviationType: 'Falta de evidência',
    description: 'Acionamento de campo sem anexar OTDR ou foto do dio rompido.',
    rootCause: 'Técnico repassou via WhatsApp mas evidência não foi anexada ao chamado oficial.',
    what: 'Procedimento padrão de anexo obrigatório de fotos e teste reflectométrico',
    why: 'Conformidade com SLA de parceiros de infraestrutura externa',
    who: 'Rodrigo Alves (Supervisor)',
    when: '2025-06-27',
    daysOpen: 2,
    escalationLevel: 0,
    status: 'Em andamento',
    createdAt: '2025-06-26',
  },
  {
    id: 'PA-2025-0104',
    auditId: 'AUD-8865',
    protocol: 'INC-997120',
    analyst: 'Ana Souza',
    supervisor: 'Juliana Costa',
    process: 'Escalonamentos',
    deviationType: 'Fraseologia inadequada',
    description: 'Encerramento com gírias internas e termos não técnicos.',
    rootCause: 'Falta de revisão antes do submit de fechamento para o cliente B2B.',
    what: 'Treinamento de comunicação executiva e fraseologia padrão COP',
    why: 'Preservação da imagem corporativa e conformidade de auditoria',
    who: 'Juliana Costa (Supervisora)',
    when: '2025-06-20',
    daysOpen: 1,
    escalationLevel: 0,
    status: 'Concluídas',
    createdAt: '2025-06-20',
  },
  {
    id: 'PA-2025-0105',
    auditId: 'AUD-8877',
    protocol: 'INC-998012',
    analyst: 'Lucas Ferreira',
    supervisor: 'Marcelo Prado',
    process: 'Tratativa GPON',
    deviationType: 'Solução incorreta',
    description: 'Atribuído defeito à OLT quando a causa raiz foi rompimento de drop.',
    rootCause: 'Diagnóstico preliminar não validado com os níveis ópticos de potência.',
    what: 'Treinamento em leitura de potência óptica e status de GPON boards',
    why: 'Reduzir reincidência de abertura de chamados para gerência de rede',
    who: 'Marcelo Prado (Supervisor)',
    when: '2025-06-25',
    daysOpen: 4,
    escalationLevel: 0,
    status: 'Em andamento',
    createdAt: '2025-06-24',
  }
];

export const INITIAL_CERTIFICATIONS: AnalystCertification[] = [
  {
    id: 'CERT-01',
    analyst: 'Beatriz Vasconcelos',
    supervisor: 'Carlos Mendes',
    cluster: 'Cluster Sudeste',
    technology: 'DWDM & Backbone',
    regional: 'Regional SP/RJ',
    tier: 'Diamante',
    iqoScore: 99.4,
    reincidencias: 0,
    trainingsCompletedPct: 100,
    daysWithoutDeviation: 124,
    totalAudits: 88,
    avatarColor: 'bg-cyan-500'
  },
  {
    id: 'CERT-02',
    analyst: 'Gabriel Albuquerque',
    supervisor: 'Fernanda Lima',
    cluster: 'Cluster Sul',
    technology: 'GPON / FTTH',
    regional: 'Regional PR/SC/RS',
    tier: 'Ouro',
    iqoScore: 97.8,
    reincidencias: 0,
    trainingsCompletedPct: 100,
    daysWithoutDeviation: 78,
    totalAudits: 94,
    avatarColor: 'bg-amber-500'
  },
  {
    id: 'CERT-03',
    analyst: 'Camila Nogueira',
    supervisor: 'Rodrigo Alves',
    cluster: 'Cluster Nordeste',
    technology: 'IP Core / MPLS',
    regional: 'Regional BA/PE/CE',
    tier: 'Ouro',
    iqoScore: 96.5,
    reincidencias: 0,
    trainingsCompletedPct: 95,
    daysWithoutDeviation: 64,
    totalAudits: 82,
    avatarColor: 'bg-emerald-500'
  },
  {
    id: 'CERT-04',
    analyst: 'Lucas Ferreira',
    supervisor: 'Marcelo Prado',
    cluster: 'Cluster Centro-Oeste',
    technology: 'Rádio & Micro-ondas',
    regional: 'Regional GO/DF/MT',
    tier: 'Prata',
    iqoScore: 92.0,
    reincidencias: 1,
    trainingsCompletedPct: 88,
    daysWithoutDeviation: 38,
    totalAudits: 79,
    avatarColor: 'bg-slate-400'
  },
  {
    id: 'CERT-05',
    analyst: 'Ana Souza',
    supervisor: 'Juliana Costa',
    cluster: 'Cluster Sudeste',
    technology: 'GPON / FTTH',
    regional: 'Regional MG/ES',
    tier: 'Prata',
    iqoScore: 91.0,
    reincidencias: 2,
    trainingsCompletedPct: 85,
    daysWithoutDeviation: 32,
    totalAudits: 85,
    avatarColor: 'bg-indigo-500'
  },
  {
    id: 'CERT-06',
    analyst: 'Pedro Henrique',
    supervisor: 'Rodrigo Alves',
    cluster: 'Cluster Nordeste',
    technology: 'DWDM & Backbone',
    regional: 'Regional BA/PE/CE',
    tier: 'Bronze',
    iqoScore: 90.0,
    reincidencias: 3,
    trainingsCompletedPct: 75,
    daysWithoutDeviation: 18,
    totalAudits: 73,
    avatarColor: 'bg-amber-700'
  },
  {
    id: 'CERT-07',
    analyst: 'Maria Santos',
    supervisor: 'Fernanda Lima',
    cluster: 'Cluster Sul',
    technology: 'IP Core / MPLS',
    regional: 'Regional PR/SC/RS',
    tier: 'Bronze',
    iqoScore: 88.0,
    reincidencias: 4,
    trainingsCompletedPct: 72,
    daysWithoutDeviation: 16,
    totalAudits: 90,
    avatarColor: 'bg-rose-500'
  },
  {
    id: 'CERT-08',
    analyst: 'João Silva',
    supervisor: 'Carlos Mendes',
    cluster: 'Cluster Sudeste',
    technology: 'GPON / FTTH',
    regional: 'Regional SP/RJ',
    tier: 'Bronze',
    iqoScore: 85.0,
    reincidencias: 4,
    trainingsCompletedPct: 70,
    daysWithoutDeviation: 12,
    totalAudits: 110,
    avatarColor: 'bg-blue-600'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'NOTIF-01',
    timestamp: 'Há 10 minutos',
    title: '🚨 Escalonamento D+10 - Gerente Executivo',
    message: 'Plano PA-2025-0101 (João Silva / Outages) completou 11 dias sem resolução.',
    severity: 'escalation',
    protocol: 'INC-994821',
    recipient: 'Gerência Executiva de Operações',
    read: false,
  },
  {
    id: 'NOTIF-02',
    timestamp: 'Há 2 horas',
    title: '⚠️ Escalonamento D+5 - Notificação ao Gestor',
    message: 'Plano PA-2025-0102 (Maria Santos) atingiu 6 dias sem primeira tratativa.',
    severity: 'warning',
    protocol: 'INC-995104',
    recipient: 'Fernanda Lima (Supervisora)',
    read: false,
  },
  {
    id: 'NOTIF-03',
    timestamp: 'Hoje às 08:30',
    title: '✨ Nova Conquista de Certificação',
    message: 'Beatriz Vasconcelos atingiu a certificação Diamante (124 dias sem desvio)!',
    severity: 'info',
    recipient: 'Todos os Gestores',
    read: true,
  },
  {
    id: 'NOTIF-04',
    timestamp: 'Ontem às 17:15',
    title: 'Alerta Automático - Desvio Registrado',
    message: 'Auditoria AUD-8877 apontou desvio grave no processo de Tratativa GPON.',
    severity: 'critical',
    protocol: 'INC-998012',
    recipient: 'Marcelo Prado (Supervisor)',
    read: true,
  }
];

export const REGIONAIS = ['Todas', 'Regional SP/RJ', 'Regional MG/ES', 'Regional PR/SC/RS', 'Regional BA/PE/CE', 'Regional GO/DF/MT'];
export const CLUSTERS = ['Todos', 'Cluster Sudeste', 'Cluster Sul', 'Cluster Nordeste', 'Cluster Centro-Oeste'];
export const TECNOLOGIAS = ['Todas', 'GPON / FTTH', 'DWDM & Backbone', 'IP Core / MPLS', 'Rádio & Micro-ondas'];
export const SUPERVISORES = ['Todos', 'Carlos Mendes', 'Fernanda Lima', 'Rodrigo Alves', 'Juliana Costa', 'Marcelo Prado'];
export const ANALISTAS = ['Todos', 'Beatriz Vasconcelos', 'Gabriel Albuquerque', 'Camila Nogueira', 'Lucas Ferreira', 'Ana Souza', 'Pedro Henrique', 'Maria Santos', 'João Silva'];
export const PROCESSOS = ['Todos', 'Outages', 'Baixas Offline', 'Acionamentos', 'Escalonamentos', 'Tratativa GPON', 'Outros'];
