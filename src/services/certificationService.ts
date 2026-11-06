import type { AnalystCertification, CertificationTier } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

class CertificationService {
  private mapRowToCertification(row: any): AnalystCertification {
    return {
      id: row.id,
      analyst: row.analyst_name || row.analyst,
      supervisor: row.supervisor_name || row.supervisor,
      cluster: row.cluster,
      technology: row.technology,
      regional: row.regional,
      tier: row.tier as CertificationTier,
      iqoScore: Number(row.iqo_score || row.iqoScore || 0),
      reincidencias: Number(row.reincidencias || 0),
      trainingsCompletedPct: Number(row.trainings_completed_pct || row.trainingsCompletedPct || 0),
      daysWithoutDeviation: Number(row.days_without_deviation || row.daysWithoutDeviation || 0),
      totalAudits: Number(row.total_audits || row.totalAudits || 0),
      avatarColor: row.avatar_color || row.avatarColor || 'bg-blue-600',
    };
  }

  /**
   * Busca todas as certificações salvas no Supabase ordenadas por IQO
   */
  public async getAll(): Promise<AnalystCertification[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('iqo_score', { ascending: false });

        if (error) throw error;
        if (data) {
          return data.map(this.mapRowToCertification);
        }
      } catch (err) {
        console.error('[CertificationService] Erro ao carregar certificações do Supabase:', err);
      }
    }
    return [];
  }
}

export const certificationService = new CertificationService();
