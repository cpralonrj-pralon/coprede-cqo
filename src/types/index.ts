export type ProcessType = 
  | 'Outages' 
  | 'Baixas Offline' 
  | 'Acionamentos' 
  | 'Escalonamentos' 
  | 'Tratativa GPON' 
  | 'Outros';

export type DeviationSeverity = 'Conforme' | 'Não Conforme' | 'Desvio Grave';

export type CertificationTier = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';

export interface DeviationTypeItem {
  id: string; // Identificador único compatível com chave primária de Banco de Dados (UUID / Serial)
  code: string; // Código corporativo único (ex: NC-ESC-01, NC-ATV-02)
  name: string; // Título do tipo / elemento de não conformidade
  category: ProcessType | 'Geral'; // Processo ao qual o elemento pertence ou se é transversal
  severityDefault: 'Não Conforme' | 'Desvio Grave'; // Severidade padrão associada
  weight: number; // Peso percentual de impacto no cálculo da nota CQO
  description: string; // Descrição técnica e critério objetivo de apontamento
  active: boolean; // Flag de ativação (permite soft-delete e controle de vigência)
  createdAt: string; // Data/Hora de inclusão (ISO string)
  updatedAt: string; // Data/Hora da última alteração (ISO string)
}

export type CreateDeviationTypeInput = Omit<DeviationTypeItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDeviationTypeInput = Partial<CreateDeviationTypeInput>;

export interface AuditRecord {
  id: string;
  protocol: string;
  process: ProcessType;
  analyst: string;
  supervisor: string;
  cluster: string;
  technology: string;
  regional: string;
  score: number;
  status: DeviationSeverity;
  deviationType?: string;
  date: string;
  observations: string;
  actionPlanId?: string;
}

export interface ActionPlan {
  id: string;
  auditId: string;
  protocol: string;
  analyst: string;
  supervisor: string;
  process: ProcessType;
  deviationType: string;
  description: string;
  rootCause: string;
  what: string;
  why: string;
  who: string;
  when: string;
  daysOpen: number;
  escalationLevel: 0 | 1 | 2; // 0: Normal, 1: Escalonado D+5 (Gestor), 2: Escalonado D+10 (Gerente Executivo)
  status: 'Em andamento' | 'Concluídas' | 'Atrasadas' | 'Escalada D+5' | 'Escalada D+10';
  createdAt: string;
}

export interface AnalystCertification {
  id: string;
  analyst: string;
  supervisor: string;
  cluster: string;
  technology: string;
  regional: string;
  tier: CertificationTier;
  iqoScore: number;
  reincidencias: number;
  trainingsCompletedPct: number;
  daysWithoutDeviation: number;
  totalAudits: number;
  avatarColor: string;
}

export interface NotificationAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'escalation';
  protocol?: string;
  recipient: string;
  read: boolean;
}

export interface FilterState {
  regional: string;
  cluster: string;
  technology: string;
  supervisor: string;
  analyst: string;
  startDate: string;
  endDate: string;
}
