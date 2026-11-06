import type { NotificationAlert } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

class NotificationService {
  private mapRowToNotif(row: any): NotificationAlert {
    const timeFormatted = row.created_at
      ? new Date(row.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : 'Hoje';

    return {
      id: row.id,
      title: row.title,
      message: row.message,
      severity: row.severity,
      protocol: row.protocol,
      recipient: row.recipient_name || row.recipient,
      read: Boolean(row.read),
      timestamp: timeFormatted,
    };
  }

  /**
   * Busca histórico de notificações e alertas de SLA do Supabase
   */
  public async getAll(): Promise<NotificationAlert[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          return data.map(this.mapRowToNotif);
        }
      } catch (err) {
        console.error('[NotificationService] Erro ao carregar notificações:', err);
      }
    }
    return [];
  }

  /**
   * Cria um alerta de SLA no Supabase
   */
  public async create(notif: Omit<NotificationAlert, 'id' | 'timestamp'>): Promise<NotificationAlert | null> {
    if (isSupabaseConfigured() && supabase) {
      const id = `NOTIF-${Date.now()}`;
      const now = new Date().toISOString();
      const row = {
        id,
        title: notif.title,
        message: notif.message,
        severity: notif.severity,
        protocol: notif.protocol || null,
        recipient_name: notif.recipient,
        read: false,
        created_at: now,
      };

      const { data, error } = await supabase.from('notifications').insert(row).select().single();
      if (error) throw error;
      return data ? this.mapRowToNotif(data) : null;
    }
    return null;
  }

  /**
   * Marca notificação como lida no Supabase
   */
  public async markAsRead(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    }
    return false;
  }
}

export const notificationService = new NotificationService();
