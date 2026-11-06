import type { DeviationTypeItem, CreateDeviationTypeInput, UpdateDeviationTypeInput } from '../types';

const STORAGE_KEY = 'cop_rede_cqo_deviation_types_v1';

/**
 * Carga inicial padrão de Tipos e Elementos de Não Conformidade
 * Utilizada como semente (seed) inicial caso o banco de dados / localStorage esteja vazio.
 */
export const DEFAULT_DEVIATION_TYPES: DeviationTypeItem[] = [
  {
    id: 'tnc-001',
    code: 'NC-ESC-01',
    name: 'Escalonamento incorreto',
    category: 'Escalonamentos',
    severityDefault: 'Não Conforme',
    weight: 25,
    description: 'Ticket escalonado para equipes de nível superior ou plantões sem validação preliminar dos checklists ou topologia.',
    active: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'tnc-002',
    code: 'NC-ATV-02',
    name: 'Quantidade de ativos incorreta',
    category: 'Baixas Offline',
    severityDefault: 'Não Conforme',
    weight: 20,
    description: 'Divergência entre os ativos declarados no encerramento e os elementos de rede efetivamente impactados pelo incidente.',
    active: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'tnc-003',
    code: 'NC-EVI-03',
    name: 'Falta de evidência',
    category: 'Acionamentos',
    severityDefault: 'Não Conforme',
    weight: 15,
    description: 'Ausência de fotos, traçados reflectométricos (OTDR), prints de teste de potência óptica ou logs obrigatórios no chamado.',
    active: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'tnc-004',
    code: 'NC-FRA-04',
    name: 'Fraseologia inadequada',
    category: 'Geral',
    severityDefault: 'Não Conforme',
    weight: 10,
    description: 'Uso de termos chulos, jargões internos não técnicos ou registros com ortografia e comunicação fora do padrão corporativo COP.',
    active: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'tnc-005',
    code: 'NC-SOL-05',
    name: 'Solução incorreta',
    category: 'Tratativa GPON',
    severityDefault: 'Desvio Grave',
    weight: 30,
    description: 'Encerramento com causa raiz e procedimento incorretos (ex: declarar troca de drop óptico quando o defeito foi porta de OLT).',
    active: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'tnc-006',
    code: 'NC-SLA-06',
    name: 'Desvio Crítico de SLA',
    category: 'Outages',
    severityDefault: 'Desvio Grave',
    weight: 35,
    description: 'Descumprimento injustificado de janela de contingência ou atraso grave no disparo de acionamento para restabelecimento de serviço.',
    active: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'tnc-007',
    code: 'NC-NOT-07',
    name: 'Falta de Notificação ao Cliente B2B',
    category: 'Outages',
    severityDefault: 'Não Conforme',
    weight: 15,
    description: 'Não emissão do boletim informativo inicial ou de restabelecimento dentro dos prazos acordados em contrato de SLA executivo.',
    active: true,
    createdAt: '2025-01-15T09:30:00.000Z',
    updatedAt: '2025-01-15T09:30:00.000Z',
  },
  {
    id: 'tnc-008',
    code: 'NC-OUT-08',
    name: 'Outros desvios operacionais',
    category: 'Geral',
    severityDefault: 'Não Conforme',
    weight: 10,
    description: 'Outras anomalias ou descumprimentos procedimentais não categorizados nos itens específicos do catálogo de qualidade.',
    active: true,
    createdAt: '2025-01-15T09:30:00.000Z',
    updatedAt: '2025-01-15T09:30:00.000Z',
  },
];

/**
 * Service Layer para Tipos de Não Conformidade.
 * Estruturado com contrato assíncrono para garantir substituição transparente
 * por chamadas HTTP / Prisma / PostgreSQL no backend futuro.
 */
class DeviationTypeService {
  private getStoredItems(): DeviationTypeItem[] {
    if (typeof window === 'undefined') return DEFAULT_DEVIATION_TYPES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEVIATION_TYPES));
        return DEFAULT_DEVIATION_TYPES;
      }
      return JSON.parse(stored);
    } catch (err) {
      console.error('[DeviationTypeService] Erro ao carregar dados do storage:', err);
      return DEFAULT_DEVIATION_TYPES;
    }
  }

  private saveStoredItems(items: DeviationTypeItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('[DeviationTypeService] Erro ao persistir dados no storage:', err);
    }
  }

  /**
   * Retorna todos os tipos de não conformidade cadastrados.
   * Suporta filtro opcional por status ativo e/ou categoria de processo.
   */
  public async getAll(options?: { onlyActive?: boolean; category?: string }): Promise<DeviationTypeItem[]> {
    const items = this.getStoredItems();
    return items.filter((item) => {
      if (options?.onlyActive && !item.active) return false;
      if (options?.category && options.category !== 'Todos' && options.category !== 'Geral' && item.category !== 'Geral' && item.category !== options.category) {
        return false;
      }
      return true;
    });
  }

  /**
   * Busca um tipo de não conformidade pelo ID.
   */
  public async getById(id: string): Promise<DeviationTypeItem | null> {
    const items = this.getStoredItems();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * INCLUIR (Create) - Registra um novo tipo de não conformidade no banco de dados.
   */
  public async create(input: CreateDeviationTypeInput): Promise<DeviationTypeItem> {
    const items = this.getStoredItems();

    // Validação de unicidade do código corporativo
    const codeNormalized = input.code.trim().toUpperCase();
    const existsCode = items.some((item) => item.code.toUpperCase() === codeNormalized);
    if (existsCode) {
      throw new Error(`Já existe um elemento de não conformidade com o código "${codeNormalized}".`);
    }

    const now = new Date().toISOString();
    const newItem: DeviationTypeItem = {
      id: `tnc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code: codeNormalized,
      name: input.name.trim(),
      category: input.category,
      severityDefault: input.severityDefault,
      weight: Number(input.weight) || 10,
      description: input.description.trim(),
      active: input.active !== undefined ? input.active : true,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newItem, ...items];
    this.saveStoredItems(updatedList);
    return newItem;
  }

  /**
   * ALTERAR (Update) - Altera os dados de um tipo de não conformidade existente.
   */
  public async update(id: string, input: UpdateDeviationTypeInput): Promise<DeviationTypeItem> {
    const items = this.getStoredItems();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Tipo de não conformidade com id "${id}" não foi encontrado no banco de dados.`);
    }

    // Se o código foi alterado, valida unicidade
    if (input.code) {
      const codeNormalized = input.code.trim().toUpperCase();
      const codeTaken = items.some((item) => item.id !== id && item.code.toUpperCase() === codeNormalized);
      if (codeTaken) {
        throw new Error(`O código "${codeNormalized}" já está em uso por outro tipo de não conformidade.`);
      }
      input.code = codeNormalized;
    }

    const current = items[index];
    const updatedItem: DeviationTypeItem = {
      ...current,
      ...input,
      id: current.id, // ID imutável
      createdAt: current.createdAt, // Data de criação preservada
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    this.saveStoredItems(items);
    return updatedItem;
  }

  /**
   * EXCLUIR (Delete) - Remove fisicamente o tipo de não conformidade.
   */
  public async delete(id: string): Promise<boolean> {
    const items = this.getStoredItems();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Tipo de não conformidade com id "${id}" não encontrado.`);
    }

    const filtered = items.filter((item) => item.id !== id);
    this.saveStoredItems(filtered);
    return true;
  }

  /**
   * ALTERAÇÃO DE STATUS (Ativar / Inativar) - Soft delete / status switch
   */
  public async toggleActive(id: string): Promise<DeviationTypeItem> {
    const items = this.getStoredItems();
    const item = items.find((i) => i.id === id);
    if (!item) {
      throw new Error(`Tipo de não conformidade com id "${id}" não encontrado.`);
    }
    return this.update(id, { active: !item.active });
  }

  /**
   * Restaura o catálogo para os valores padrão de fábrica
   */
  public async resetToDefaults(): Promise<DeviationTypeItem[]> {
    this.saveStoredItems(DEFAULT_DEVIATION_TYPES);
    return DEFAULT_DEVIATION_TYPES;
  }
}

export const deviationTypeService = new DeviationTypeService();
