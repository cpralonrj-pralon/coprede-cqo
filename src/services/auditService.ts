import type { AuditRecord, ProcessType, DeviationSeverity } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface CreateAuditInput {
  protocol: string;
  process: ProcessType;
  analyst: string;
  supervisor: string;
  cluster: string;
  technology: string;
  regional: string;
  score: number;
  status: DeviationSeverity;
  deviationTypeId?: string;
  deviationType?: string;
  observations?: string;
  date?: string;
}

class AuditService {
  private mapRowToRecord(row: any): AuditRecord {
    return {
      id: row.id,
      protocol: row.protocol,
      process: row.process as ProcessType,
      analyst: row.analyst_name || row.analyst,
      supervisor: row.supervisor_name || row.supervisor,
      cluster: row.cluster,
      technology: row.technology,
      regional: row.regional,
      score: Number(row.score),
      status: row.status as DeviationSeverity,
      deviationType: row.deviation_type_name || row.deviationType,
      date: row.date ? String(row.date).split('T')[0] : new Date().toISOString().split('T')[0],
      observations: row.observations || '',
    };
  }

  /**
   * Busca todas as auditorias no Supabase com ordenação decrescente de data
   */
  public async getAll(): Promise<AuditRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('audits')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        if (data) {
          return data.map(this.mapRowToRecord);
        }
      } catch (err) {
        console.error('[AuditService] Erro ao carregar auditorias do Supabase:', err);
      }
    }
    return [];
  }

  /**
   * Insere uma nova auditoria no Supabase com relacionamentos e gatilhos de SLA
   */
  public async create(input: CreateAuditInput): Promise<{
    audit: AuditRecord;
    actionPlanId?: string;
    notificationId?: string;
  }> {
    const auditId = `AUD-${Math.floor(8900 + Math.random() * 1000)}`;
    const now = input.date || new Date().toISOString().split('T')[0];

    const auditRow = {
      id: auditId,
      protocol: input.protocol,
      process: input.process,
      analyst_name: input.analyst,
      supervisor_name: input.supervisor,
      cluster: input.cluster,
      technology: input.technology,
      regional: input.regional,
      score: input.score,
      status: input.status,
      deviation_type_id: input.deviationTypeId || null,
      deviation_type_name: input.deviationType || null,
      date: now,
      observations: input.observations || '',
    };

    let createdAudit: AuditRecord = this.mapRowToRecord(auditRow);
    let actionPlanId: string | undefined;
    let notificationId: string | undefined;

    if (isSupabaseConfigured() && supabase) {
      // 1. Salvar Auditoria no Supabase
      const { data, error } = await supabase.from('audits').insert(auditRow).select().single();
      if (error) {
        console.error('[AuditService] Erro ao criar auditoria no Supabase:', error);
        throw new Error(error.message || 'Falha ao registrar auditoria no Supabase.');
      }
      if (data) createdAudit = this.mapRowToRecord(data);

      // 2. Se houver desvio, dispara Gatilho D0: cria Plano de Ação e Alerta no Supabase com chave estrangeira
      if (input.status !== 'Conforme') {
        actionPlanId = `PA-2025-${Math.floor(1000 + Math.random() * 9000)}`;
        notificationId = `NOTIF-${Date.now()}`;

        const planRow = {
          id: actionPlanId,
          audit_id: createdAudit.id,
          protocol: createdAudit.protocol,
          analyst_name: createdAudit.analyst,
          supervisor_name: createdAudit.supervisor,
          process: createdAudit.process,
          deviation_type_name: createdAudit.deviationType || 'Desvio Operacional',
          description: createdAudit.observations,
          root_cause: 'Análise de causa raiz preliminar em andamento pela supervisão técnica.',
          what: `Revisão do procedimento operacional padrão do processo ${createdAudit.process}`,
          why: 'Prevenir reincidência e assegurar conformidade operacional no COP Rede',
          who: createdAudit.supervisor,
          target_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          days_open: 0,
          escalation_level: 0,
          status: 'Em andamento',
          created_at: new Date().toISOString(),
        };

        const notifRow = {
          id: notificationId,
          title: `🚨 Alerta Automático: Desvio em ${createdAudit.process}`,
          message: `Novo desvio registrado para o analista ${createdAudit.analyst}. Plano de Ação ${actionPlanId} aberto e gestor ${createdAudit.supervisor} notificado.`,
          severity: createdAudit.status === 'Desvio Grave' ? 'critical' : 'warning',
          protocol: createdAudit.protocol,
          action_plan_id: actionPlanId,
          recipient_name: createdAudit.supervisor,
          read: false,
          created_at: new Date().toISOString(),
        };

        await supabase.from('action_plans').insert(planRow);
        await supabase.from('notifications').insert(notifRow);
      }
    }

    return { audit: createdAudit, actionPlanId, notificationId };
  }

  /**
   * Exclui auditoria no Supabase
   */
  public async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('audits').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    return false;
  }
}

export const auditService = new AuditService();
