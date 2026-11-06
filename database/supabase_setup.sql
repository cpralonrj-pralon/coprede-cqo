-- =============================================================================
-- COP REDE - CQO (CENTRAL DE QUALIDADE OPERACIONAL)
-- SCRIPT DE INSTALAÇÃO NO SUPABASE (SQL EDITOR)
-- Copie e cole este script diretamente no "SQL Editor" do seu painel Supabase
-- =============================================================================

-- 1. Habilita extensões UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 2. TIPOS ENUMERADOS (ENUMS)
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE process_type AS ENUM (
        'Outages', 
        'Baixas Offline', 
        'Acionamentos', 
        'Escalonamentos', 
        'Tratativa GPON', 
        'Outros'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE deviation_severity AS ENUM (
        'Conforme', 
        'Não Conforme', 
        'Desvio Grave'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE action_plan_status AS ENUM (
        'Em andamento', 
        'Concluídas', 
        'Atrasadas', 
        'Escalada D+5', 
        'Escalada D+10'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE certification_tier AS ENUM (
        'Bronze', 
        'Prata', 
        'Ouro', 
        'Diamante'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notification_severity AS ENUM (
        'info', 
        'warning', 
        'critical', 
        'escalation'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'ADMIN', 
        'AUDITOR_CQO', 
        'GERENTE_EXECUTIVO', 
        'SUPERVISOR', 
        'ANALISTA'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =============================================================================
-- 3. FUNÇÃO PARA ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 4. TABELA: USERS (Usuários, Analistas, Supervisores e Liderança)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'ANALISTA',
    supervisor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    regional VARCHAR(100) NOT NULL,
    cluster VARCHAR(100) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    avatar_color VARCHAR(50) DEFAULT 'bg-blue-600',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. TABELA: DEVIATION_TYPES (Tipos e Elementos de Não Conformidade - CRUD)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.deviation_types (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Geral',
    severity_default VARCHAR(30) NOT NULL DEFAULT 'Não Conforme',
    weight INTEGER NOT NULL DEFAULT 15 CHECK (weight >= 0 AND weight <= 100),
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deviation_types_code ON public.deviation_types(code);
CREATE INDEX IF NOT EXISTS idx_deviation_types_active ON public.deviation_types(active);

CREATE OR REPLACE TRIGGER set_timestamp_deviation_types
BEFORE UPDATE ON public.deviation_types
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 6. TABELA: AUDITS (Auditorias de Qualidade Operacional CQO)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audits (
    id VARCHAR(50) PRIMARY KEY,
    protocol VARCHAR(50) NOT NULL,
    process process_type NOT NULL,
    analyst_name VARCHAR(150) NOT NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    cluster VARCHAR(100) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    regional VARCHAR(100) NOT NULL,
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    status deviation_severity NOT NULL,
    deviation_type_id VARCHAR(50) REFERENCES public.deviation_types(id) ON DELETE SET NULL,
    deviation_type_name VARCHAR(200),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_protocol ON public.audits(protocol);
CREATE INDEX IF NOT EXISTS idx_audits_date ON public.audits(date);
CREATE INDEX IF NOT EXISTS idx_audits_status ON public.audits(status);

CREATE OR REPLACE TRIGGER set_timestamp_audits
BEFORE UPDATE ON public.audits
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 7. TABELA: ACTION_PLANS (Planos de Ação 5W2H e Acompanhamento de SLAs)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.action_plans (
    id VARCHAR(50) PRIMARY KEY,
    audit_id VARCHAR(50) REFERENCES public.audits(id) ON DELETE CASCADE,
    protocol VARCHAR(50) NOT NULL,
    analyst_name VARCHAR(150) NOT NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    process process_type NOT NULL,
    deviation_type_name VARCHAR(200) NOT NULL,
    description TEXT,
    root_cause TEXT NOT NULL,
    what TEXT NOT NULL,
    why TEXT NOT NULL,
    who VARCHAR(150) NOT NULL,
    target_date DATE NOT NULL,
    days_open INTEGER NOT NULL DEFAULT 0,
    escalation_level INTEGER NOT NULL DEFAULT 0 CHECK (escalation_level IN (0, 1, 2)),
    status action_plan_status NOT NULL DEFAULT 'Em andamento',
    first_response_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_plans_status ON public.action_plans(status);
CREATE INDEX IF NOT EXISTS idx_action_plans_escalation ON public.action_plans(escalation_level);

CREATE OR REPLACE TRIGGER set_timestamp_action_plans
BEFORE UPDATE ON public.action_plans
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 8. TABELA: CERTIFICATIONS (Matriz de Certificação dos Analistas)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.certifications (
    id VARCHAR(50) PRIMARY KEY,
    analyst_name VARCHAR(150) NOT NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    cluster VARCHAR(100) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    regional VARCHAR(100) NOT NULL,
    tier certification_tier NOT NULL DEFAULT 'Bronze',
    iqo_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    reincidencias INTEGER NOT NULL DEFAULT 0,
    trainings_completed_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    days_without_deviation INTEGER NOT NULL DEFAULT 0,
    total_audits INTEGER NOT NULL DEFAULT 0,
    avatar_color VARCHAR(50) DEFAULT 'bg-blue-600',
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_tier ON public.certifications(tier);

-- =============================================================================
-- 9. TABELA: NOTIFICATIONS (Histórico de Alertas e Escalonamentos)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    severity notification_severity NOT NULL DEFAULT 'info',
    protocol VARCHAR(50),
    action_plan_id VARCHAR(50) REFERENCES public.action_plans(id) ON DELETE SET NULL,
    recipient_name VARCHAR(150) NOT NULL,
    recipient_email VARCHAR(200),
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_via_teams BOOLEAN NOT NULL DEFAULT false,
    sent_via_email BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) NO SUPABASE
-- Permite leitura e gravação transparente com a Anon Key pública
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deviation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para anon e autenticados
CREATE POLICY "Public Read deviation_types" ON public.deviation_types FOR SELECT USING (true);
CREATE POLICY "Public Insert deviation_types" ON public.deviation_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update deviation_types" ON public.deviation_types FOR UPDATE USING (true);
CREATE POLICY "Public Delete deviation_types" ON public.deviation_types FOR DELETE USING (true);

CREATE POLICY "Public Read audits" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Public Insert audits" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update audits" ON public.audits FOR UPDATE USING (true);

CREATE POLICY "Public Read action_plans" ON public.action_plans FOR SELECT USING (true);
CREATE POLICY "Public Insert action_plans" ON public.action_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update action_plans" ON public.action_plans FOR UPDATE USING (true);

CREATE POLICY "Public Read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public Read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update notifications" ON public.notifications FOR UPDATE USING (true);

CREATE POLICY "Public Read users" ON public.users FOR SELECT USING (true);

-- =============================================================================
-- 11. HABILITAR SUPABASE REALTIME (Alertas e Planos ao Vivo)
-- =============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.deviation_types;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.action_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =============================================================================
-- 12. CARGA INICIAL DE SEED AUTOMÁTICA
-- =============================================================================

INSERT INTO public.deviation_types (id, code, name, category, severity_default, weight, description, active)
VALUES 
('tnc-001', 'NC-ESC-01', 'Escalonamento incorreto', 'Escalonamentos', 'Não Conforme', 25, 'Ticket escalonado para equipes de nível superior ou plantões sem validação preliminar dos checklists ou topologia.', true),
('tnc-002', 'NC-ATV-02', 'Quantidade de ativos incorreta', 'Baixas Offline', 'Não Conforme', 20, 'Divergência entre os ativos declarados no encerramento e os elementos de rede efetivamente impactados pelo incidente.', true),
('tnc-003', 'NC-EVI-03', 'Falta de evidência', 'Acionamentos', 'Não Conforme', 15, 'Ausência de fotos, traçados reflectométricos (OTDR), prints de teste de potência óptica ou logs obrigatórios no chamado.', true),
('tnc-004', 'NC-FRA-04', 'Fraseologia inadequada', 'Geral', 'Não Conforme', 10, 'Uso de termos chulos, jargões internos não técnicos ou registros com ortografia e comunicação fora do padrão corporativo COP.', true),
('tnc-005', 'NC-SOL-05', 'Solução incorreta', 'Tratativa GPON', 'Desvio Grave', 30, 'Encerramento com causa raiz e procedimento incorretos (ex: declarar troca de drop óptico quando o defeito foi porta de OLT).', true),
('tnc-006', 'NC-SLA-06', 'Desvio Crítico de SLA', 'Outages', 'Desvio Grave', 35, 'Descumprimento injustificado de janela de contingência ou atraso grave no disparo de acionamento para restabelecimento de serviço.', true),
('tnc-007', 'NC-NOT-07', 'Falta de Notificação ao Cliente B2B', 'Outages', 'Não Conforme', 15, 'Não emissão do boletim informativo inicial ou de restabelecimento dentro dos prazos acordados em contrato de SLA executivo.', true),
('tnc-008', 'NC-OUT-08', 'Outros desvios operacionais', 'Geral', 'Não Conforme', 10, 'Outras anomalias ou descumprimentos procedimentais não categorizados nos itens específicos do catálogo de qualidade.', true)
ON CONFLICT (id) DO NOTHING;
