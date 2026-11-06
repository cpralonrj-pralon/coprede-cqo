-- =============================================================================
-- COP REDE - CQO (CENTRAL DE QUALIDADE OPERACIONAL)
-- SCRIPT DE ESTRUTURA DO BANCO DE DADOS (DDL)
-- Compatibilidade: PostgreSQL 14+ / 15+ / 16+ / AWS RDS / Supabase
-- =============================================================================

-- Habilita extensões para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. TIPOS ENUMERADOS (ENUMS)
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
-- 2. FUNÇÃO E TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 3. TABELA: USERS (Usuários, Analistas, Supervisores e Liderança)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'ANALISTA',
    supervisor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    regional VARCHAR(100) NOT NULL,
    cluster VARCHAR(100) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    avatar_color VARCHAR(50) DEFAULT 'bg-blue-600',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_supervisor_id ON users(supervisor_id);

CREATE OR REPLACE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 4. TABELA: DEVIATION_TYPES (Tipos e Elementos de Não Conformidade - CRUD)
-- =============================================================================

CREATE TABLE IF NOT EXISTS deviation_types (
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

CREATE INDEX IF NOT EXISTS idx_deviation_types_code ON deviation_types(code);
CREATE INDEX IF NOT EXISTS idx_deviation_types_active ON deviation_types(active);
CREATE INDEX IF NOT EXISTS idx_deviation_types_category ON deviation_types(category);

CREATE OR REPLACE TRIGGER set_timestamp_deviation_types
BEFORE UPDATE ON deviation_types
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 5. TABELA: AUDITS (Auditorias de Qualidade Operacional CQO)
-- =============================================================================

CREATE TABLE IF NOT EXISTS audits (
    id VARCHAR(50) PRIMARY KEY,
    protocol VARCHAR(50) NOT NULL,
    process process_type NOT NULL,
    analyst_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    analyst_name VARCHAR(150) NOT NULL,
    supervisor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    cluster VARCHAR(100) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    regional VARCHAR(100) NOT NULL,
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    status deviation_severity NOT NULL,
    deviation_type_id VARCHAR(50) REFERENCES deviation_types(id) ON DELETE SET NULL,
    deviation_type_name VARCHAR(200),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_protocol ON audits(protocol);
CREATE INDEX IF NOT EXISTS idx_audits_date ON audits(date);
CREATE INDEX IF NOT EXISTS idx_audits_process ON audits(process);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_analyst_name ON audits(analyst_name);
CREATE INDEX IF NOT EXISTS idx_audits_supervisor_name ON audits(supervisor_name);

CREATE OR REPLACE TRIGGER set_timestamp_audits
BEFORE UPDATE ON audits
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 6. TABELA: ACTION_PLANS (Planos de Ação 5W2H e Acompanhamento de SLAs)
-- =============================================================================

CREATE TABLE IF NOT EXISTS action_plans (
    id VARCHAR(50) PRIMARY KEY,
    audit_id VARCHAR(50) REFERENCES audits(id) ON DELETE CASCADE,
    protocol VARCHAR(50) NOT NULL,
    analyst_id UUID REFERENCES users(id) ON DELETE SET NULL,
    analyst_name VARCHAR(150) NOT NULL,
    supervisor_id UUID REFERENCES users(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_action_plans_status ON action_plans(status);
CREATE INDEX IF NOT EXISTS idx_action_plans_escalation_level ON action_plans(escalation_level);
CREATE INDEX IF NOT EXISTS idx_action_plans_audit_id ON action_plans(audit_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_protocol ON action_plans(protocol);

CREATE OR REPLACE TRIGGER set_timestamp_action_plans
BEFORE UPDATE ON action_plans
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 7. TABELA: CERTIFICATIONS (Matriz de Certificação dos Analistas)
-- =============================================================================

CREATE TABLE IF NOT EXISTS certifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_certifications_tier ON certifications(tier);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);

CREATE OR REPLACE TRIGGER set_timestamp_certifications
BEFORE UPDATE ON certifications
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 8. TABELA: NOTIFICATIONS (Histórico de Alertas e Escalonamentos D0, D+5 e D+10)
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    severity notification_severity NOT NULL DEFAULT 'info',
    protocol VARCHAR(50),
    action_plan_id VARCHAR(50) REFERENCES action_plans(id) ON DELETE SET NULL,
    recipient_name VARCHAR(150) NOT NULL,
    recipient_email VARCHAR(200),
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_via_teams BOOLEAN NOT NULL DEFAULT false,
    sent_via_email BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_severity ON notifications(severity);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- =============================================================================
-- 9. VIEWS ANALÍTICAS DE GOVERNANÇA (KPIs Consolidados)
-- =============================================================================

-- View de Evolução Mensal do IQO
CREATE OR REPLACE VIEW vw_iqo_mensal AS
SELECT 
    TO_CHAR(date, 'Mon/YY') AS mes,
    DATE_TRUNC('month', date) AS mes_ordem,
    ROUND(AVG(score), 1) AS iqo_medio,
    95.0 AS iqo_meta,
    COUNT(*) AS total_auditorias,
    SUM(CASE WHEN status = 'Conforme' THEN 1 ELSE 0 END) AS total_conformes,
    SUM(CASE WHEN status = 'Não Conforme' THEN 1 ELSE 0 END) AS total_nao_conformes,
    SUM(CASE WHEN status = 'Desvio Grave' THEN 1 ELSE 0 END) AS total_desvios_graves
FROM audits
GROUP BY TO_CHAR(date, 'Mon/YY'), DATE_TRUNC('month', date)
ORDER BY mes_ordem ASC;

-- View do Ranking de Supervisores
CREATE OR REPLACE VIEW vw_ranking_supervisores AS
SELECT 
    supervisor_name,
    COUNT(*) AS total_auditorias,
    ROUND(AVG(score), 1) AS iqo_medio,
    SUM(CASE WHEN status = 'Desvio Grave' THEN 1 ELSE 0 END) AS desvios_graves,
    CASE 
        WHEN AVG(score) >= 95 THEN 'green'
        WHEN AVG(score) >= 90 THEN 'amber'
        ELSE 'red'
    END AS status_farol
FROM audits
GROUP BY supervisor_name
ORDER BY iqo_medio DESC;
