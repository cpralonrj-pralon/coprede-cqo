# 🗄️ Arquitetura de Banco de Dados — CQO COP Rede

Este diretório contém os scripts formais de **Definição de Dados (DDL)** e **Carga Inicial (DML / Seed)** para o banco de dados corporativo do **CQO (Central de Qualidade Operacional)**.

---

## 📋 Sumário dos Recursos

| Arquivo | Descrição |
| :--- | :--- |
| `database/schema.sql` | Script SQL DDL nativo para **PostgreSQL 14+ / Supabase / AWS RDS** com enums, tabelas, constraints, índices e triggers automáticos de `updated_at`. |
| `database/seed.sql` | Dados iniciais estruturados para homologação e testes de aderência com a base operacional do COP Rede. |
| `prisma/schema.prisma` | Modelo type-safe compatível com **Prisma ORM** para desenvolvimento com TypeScript / Node.js. |
| `.env.example` | Exemplo de variáveis de conexão (`DATABASE_URL`, credenciais, webhooks). |

---

## 🏛️ Entidades & Relacionamentos

```mermaid
erDiagram
    USERS ||--o{ AUDITS : "analyst / supervisor"
    USERS ||--o{ ACTION_PLANS : "supervisor responsável"
    USERS ||--o{ CERTIFICATIONS : "possui certificação"
    DEVIATION_TYPES ||--o{ AUDITS : "classifica"
    AUDITS ||--o{ ACTION_PLANS : "origina tratativa"
    ACTION_PLANS ||--o{ NOTIFICATIONS : "dispara alertas D0/D+5/D+10"

    DEVIATION_TYPES {
        varchar id PK
        varchar code UK
        varchar name
        varchar category
        varchar severity_default
        int weight
        text description
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    AUDITS {
        varchar id PK
        varchar protocol
        process_type process
        uuid analyst_id FK
        uuid supervisor_id FK
        varchar regional
        varchar cluster
        varchar technology
        numeric score
        deviation_severity status
        varchar deviation_type_id FK
        date date
        text observations
    }

    ACTION_PLANS {
        varchar id PK
        varchar audit_id FK
        varchar protocol
        varchar deviation_type_name
        text root_cause
        text what
        text why
        varchar who
        date target_date
        int days_open
        int escalation_level
        action_plan_status status
    }

    CERTIFICATIONS {
        varchar id PK
        uuid user_id FK
        certification_tier tier
        numeric iqo_score
        int reincidencias
        numeric trainings_completed_pct
        int days_without_deviation
    }
```

---

## 🚀 Como Executar Localmente com Docker e PostgreSQL

### 1. Subir instância local do PostgreSQL
```bash
docker run --name postgres-cqo \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=sua_senha_segura \
  -e POSTGRES_DB=cqo_cop_rede \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 2. Executar o Schema e o Seed
```bash
# Executa a criação das tabelas e índices
psql -h localhost -U postgres -d cqo_cop_rede -f database/schema.sql

# Executa a carga inicial de dados
psql -h localhost -U postgres -d cqo_cop_rede -f database/seed.sql
```

### 3. Ou utilizando Prisma ORM
```bash
# Instalar prisma CLI
npm install -D prisma @prisma/client

# Gerar o banco e aplicar migrações automaticamente
npx prisma db push

# Visualizar os dados pelo Prisma Studio
npx prisma studio
```
