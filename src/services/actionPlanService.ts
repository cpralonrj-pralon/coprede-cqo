import type { ActionPlan, ProcessType } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

class ActionPlanService {
  private mapRowToPlan(row: any): ActionPlan {
    return {
      id: row.id,
      auditId: row.audit_id || row.auditId,
      protocol: row.protocol,
      analyst: row.analyst_name || row.analyst,
      supervisor: row.supervisor_name || row.supervisor,
      process: row.process as ProcessType,
      deviationType: row.deviation_type_name || row.deviationType,
      description: row.description || '',
      rootCause: row.root_cause || row.rootCause || '',
      what: row.what || '',
      why: row.why || '',
      who: row.who || '',
      when: row.target_date ? String(row.target_date).split('T')[0] : (row.when || ''),
      daysOpen: Number(row.days_open) || 0,
      escalationLevel: (row.escalation_level as 0 | 1 | 2) || 0,
      status: row.status as ActionPlan['status'],
      createdAt: row.created_at ? String(row.created_at).split('T')[0] : new Date().toISOString().split('T')[0],
    };
  }

  /**
   * Busca todos os planos de ação do Supabase com ordenação decrescente de criação
   */
  public async getAll(): Promise<ActionPlan[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('action_plans')
          .select('*, audits(protocol, process, score, status)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          return data.map(this.mapRowToPlan);
        }
      } catch (err) {
        console.error('[ActionPlanService] Erro ao carregar planos do Supabase:', err);
      }
    }
    return [];
  }

  /**
   * Conclui um plano de ação no Supabase (resolução técnica CQO)
   */
  public async complete(id: string): Promise<ActionPlan | null> {
    if (isSupabaseConfigured() && supabase) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('action_plans')
        .update({
          status: 'Concluídas',
          resolved_at: now,
          updated_at: now,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[ActionPlanService] Erro ao concluir plano:', error);
        throw new Error(error.message);
      }
      return data ? this.mapRowToPlan(data) : null;
    }
    return null;
  }

  /**
   * Atualiza o nível de escalonamento D+5 ou D+10 no Supabase
   */
  public async updateEscalation(
    id: string,
    daysOpen: number,
    escalationLevel: 0 | 1 | 2,
    status: 'Em andamento' | 'Escalada D+5' | 'Escalada D+10'
  ): Promise<ActionPlan | null> {
    if (isSupabaseConfigured() && supabase) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('action_plans')
        .update({
          days_open: daysOpen,
          escalation_level: escalationLevel,
          status,
          updated_at: now,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? this.mapRowToPlan(data) : null;
    }
    return null;
  }
}

export const actionPlanService = new ActionPlanService();
