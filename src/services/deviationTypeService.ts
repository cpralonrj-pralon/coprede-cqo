import type { DeviationTypeItem, CreateDeviationTypeInput, UpdateDeviationTypeInput } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

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
 * Conecta com o Supabase quando configurado e possui fallback transparente em localStorage.
 */
class DeviationTypeService {
  // Helper para mapear linha do Supabase (snake_case) para camelCase
  private mapRowToItem(row: any): DeviationTypeItem {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      category: row.category,
      severityDefault: row.severity_default || row.severityDefault || 'Não Conforme',
      weight: Number(row.weight) || 15,
      description: row.description || '',
      active: row.active !== undefined ? row.active : true,
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    };
  }

  // Helper para mapear objeto TypeScript para colunas do Supabase
  private mapItemToRow(item: Partial<DeviationTypeItem>): any {
    const row: any = {};
    if (item.id !== undefined) row.id = item.id;
    if (item.code !== undefined) row.code = item.code;
    if (item.name !== undefined) row.name = item.name;
    if (item.category !== undefined) row.category = item.category;
    if (item.severityDefault !== undefined) row.severity_default = item.severityDefault;
    if (item.weight !== undefined) row.weight = item.weight;
    if (item.description !== undefined) row.description = item.description;
    if (item.active !== undefined) row.active = item.active;
    if (item.updatedAt !== undefined) row.updated_at = item.updatedAt;
    return row;
  }

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
   */
  public async getAll(options?: { onlyActive?: boolean; category?: string }): Promise<DeviationTypeItem[]> {
    // 1. Tenta carregar do Supabase se configurado
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('deviation_types').select('*').order('created_at', { ascending: false });

        if (options?.onlyActive) {
          query = query.eq('active', true);
        }
        if (options?.category && options.category !== 'Todos' && options.category !== 'Geral') {
          query = query.or(`category.eq.${options.category},category.eq.Geral`);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          const items = data.map(this.mapRowToItem);
          this.saveStoredItems(items); // Sincroniza cache local
          return items;
        }
      } catch (err) {
        console.warn('[DeviationTypeService] Supabase offline ou tabela vazia. Usando dados locais.', err);
      }
    }

    // 2. Fallback para localStorage
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
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('deviation_types').select('*').eq('id', id).single();
        if (!error && data) return this.mapRowToItem(data);
      } catch (err) {
        console.warn('[DeviationTypeService] Falha ao buscar no Supabase:', err);
      }
    }

    const items = this.getStoredItems();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * INCLUIR (Create) - Registra um novo tipo de não conformidade no Supabase / Banco de Dados.
   */
  public async create(input: CreateDeviationTypeInput): Promise<DeviationTypeItem> {
    const codeNormalized = input.code.trim().toUpperCase();
    const now = new Date().toISOString();
    const newItem: DeviationTypeItem = {
      id: `tnc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code: codeNormalized,
      name: input.name.trim(),
      category: input.category,
      severityDefault: input.severityDefault,
      weight: Number(input.weight) || 15,
      description: input.description.trim(),
      active: input.active !== undefined ? input.active : true,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Persistir no Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const dbRow = this.mapItemToRow(newItem);
        dbRow.created_at = now;
        const { data, error } = await supabase.from('deviation_types').insert(dbRow).select().single();
        if (error) throw error;
        if (data) {
          const created = this.mapRowToItem(data);
          const current = this.getStoredItems();
          this.saveStoredItems([created, ...current]);
          return created;
        }
      } catch (err: any) {
        console.error('[DeviationTypeService] Erro ao inserir no Supabase:', err);
        throw new Error(err.message || 'Erro ao salvar no banco de dados Supabase.');
      }
    }

    // 2. Persistir localmente
    const items = this.getStoredItems();
    const existsCode = items.some((item) => item.code.toUpperCase() === codeNormalized);
    if (existsCode) {
      throw new Error(`Já existe um elemento de não conformidade com o código "${codeNormalized}".`);
    }

    const updatedList = [newItem, ...items];
    this.saveStoredItems(updatedList);
    return newItem;
  }

  /**
   * ALTERAR (Update) - Altera os dados de um tipo de não conformidade no Supabase / Banco de Dados.
   */
  public async update(id: string, input: UpdateDeviationTypeInput): Promise<DeviationTypeItem> {
    const now = new Date().toISOString();

    // 1. Atualizar no Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const rowUpdates = this.mapItemToRow(input);
        rowUpdates.updated_at = now;
        const { data, error } = await supabase
          .from('deviation_types')
          .update(rowUpdates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          const updated = this.mapRowToItem(data);
          const items = this.getStoredItems();
          const idx = items.findIndex((i) => i.id === id);
          if (idx !== -1) items[idx] = updated;
          this.saveStoredItems(items);
          return updated;
        }
      } catch (err: any) {
        console.error('[DeviationTypeService] Erro ao atualizar no Supabase:', err);
        throw new Error(err.message || 'Erro ao atualizar no banco de dados Supabase.');
      }
    }

    // 2. Atualizar localmente
    const items = this.getStoredItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Tipo de não conformidade com id "${id}" não encontrado.`);
    }

    const current = items[index];
    const updatedItem: DeviationTypeItem = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: now,
    };

    items[index] = updatedItem;
    this.saveStoredItems(items);
    return updatedItem;
  }

  /**
   * EXCLUIR (Delete) - Remove fisicamente o tipo de não conformidade no Supabase / Banco de Dados.
   */
  public async delete(id: string): Promise<boolean> {
    // 1. Excluir no Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('deviation_types').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error('[DeviationTypeService] Erro ao excluir no Supabase:', err);
        throw new Error(err.message || 'Erro ao excluir no banco de dados Supabase.');
      }
    }

    // 2. Excluir localmente
    const items = this.getStoredItems();
    const filtered = items.filter((item) => item.id !== id);
    this.saveStoredItems(filtered);
    return true;
  }

  /**
   * ALTERAÇÃO DE STATUS (Ativar / Inativar) - Soft delete / status switch
   */
  public async toggleActive(id: string): Promise<DeviationTypeItem> {
    const item = await this.getById(id);
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
