import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verifica se as variáveis foram preenchidas com valores reais do Supabase
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('sua-url-do-supabase') &&
    !supabaseAnonKey.includes('sua-chave-anon-key')
  );
};

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.info('[Supabase] Conexão inicializada com sucesso com o projeto:', supabaseUrl);
  } catch (error) {
    console.error('[Supabase] Falha ao inicializar cliente Supabase:', error);
  }
} else {
  console.info(
    '[Supabase] Modo Offline / Local Ativo. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu arquivo .env para sincronizar com o Supabase.'
  );
}

export const supabase = client;
