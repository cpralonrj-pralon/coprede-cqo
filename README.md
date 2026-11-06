<div align="center">

# 🌐 COP REDE — CQO
### **Central de Qualidade Operacional**
*Processos hoje. Qualidade sempre.*  
*"Mais que auditoria, evolução da operação."*

[![React 19](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL Ready](https://img.shields.io/badge/PostgreSQL-14%2B-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-Ready-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## 📌 Sobre o Projeto

O **CQO (Central de Qualidade Operacional)** é uma plataforma enterprise de **Governança Operacional** desenvolvida para o **COP Rede**. A aplicação transforma a auditoria reativa em um sistema proativo de conformidade e maturidade operacional, semelhante a ferramentas como **Power BI Premium, Microsoft Fabric e ServiceNow**.

### 🎯 Objetivos Estratégicos
- **Garantir aderência** rigorosa aos procedimentos operacionais padrão (POP).
- **Reduzir reincidências** de falhas através de trilhas de reciclagem direcionadas.
- **Melhorar a qualidade dos encerramentos** de chamados técnicos e eventos de rede.
- **Monitorar desvios em tempo real** com escalonamentos automáticos de SLA.
- **Apoiar a liderança** com painéis executivos por Regional, Cluster e Tecnologia.
- **Aumentar a maturidade operacional** contínua do COP Rede.

---

## 🚀 Funcionalidades Principais

### 1. 📊 Dashboard Executivo (Power BI & Fabric Style)
- **Top 6 KPIs**: IQO (Índice de Qualidade Operacional), Auditorias Realizadas, Não Conformidades, Desvios Graves, Reincidências e IGP (Feedback no Prazo).
- **9 Painéis de Análise**:
  - Evolução histórica do IQO vs. Meta (95%).
  - Donut de Auditorias por Processo (*Outages, Baixas Offline, Acionamentos, Escalonamentos, GPON*).
  - Resultado Conforme vs. Não Conforme.
  - Pareto Top 5 Tipos de Não Conformidades.
  - Ranking de Supervisores e Analistas com badges de farol (Verde / Amarelo / Vermelho).
  - Reincidência de analistas (1ª a 4ª ocorrências).
  - Matriz de Qualidade com tendências preditivas ($\nearrow$, $\rightarrow$, $\searrow$).

### 2. 🏆 Programa de Certificação Operacional
- Classificação contínua e meritocrática dos analistas em 4 níveis:
  - **Bronze:** IQO $\ge 85\%$, Reincidência $\le 4$, Treinamentos $\ge 70\%$, Tempo sem desvio $\ge 15$ dias.
  - **Prata:** IQO $\ge 90\%$, Reincidência $\le 2$, Treinamentos $\ge 85\%$, Tempo sem desvio $\ge 30$ dias.
  - **Ouro:** IQO $\ge 95\%$, Reincidência $= 0$, Treinamentos $100\%$, Tempo sem desvio $\ge 60$ dias.
  - **Diamante:** IQO $\ge 98\%$, 0 desvios no trimestre, $100\%$ trilhas + multiplicador, $\ge 90$ dias sem desvios.
- **Simulador Interativo de Elegibilidade**: ajuste os 4 pilares em tempo real para simular o selo conquistado.

### 3. ⚡ Motor de Automações & Escalonamento de Desvios (SLAs)
- **Gatilho D0:** Detectou Não Conformidade ou Desvio Grave $\rightarrow$ Alerta automático ao Gestor e abertura imediata de Plano de Ação 5W2H.
- **Gatilho D+5:** 5 dias sem preenchimento da causa raiz $\rightarrow$ Escalonamento Nível 1 com advertência formal ao Supervisor.
- **Gatilho D+10:** 10 dias sem resolução ou validação $\rightarrow$ Escalonamento Nível 2 para a **Gerência Executiva / Diretoria**.

### 4. 🏷️ Catálogo Dinâmico de Tipos de NC (CRUD Completo)
- Permite **incluir, alterar, ativar/inativar (soft-delete) ou excluir** tipos e elementos de não conformidade.
- Validação de integridade referencial com aviso de auditorias vinculadas.
- Atualização instantânea nos formulários de auditoria e gráficos analíticos.

### 5. 📑 Relatórios & Exportação Multidimensional
- Filtros em cascata por: **Regional**, **Cluster**, **Tecnologia**, **Supervisor**, **Analista** e **Processo**.
- Exportação instantânea em **Excel (`.xlsx`)** e **PDF Executivo (`.pdf`)** formatado para A4 Paisagem.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Componentes & Ícones:** Lucide React, Recharts (visualização de dados)
- **Exportação:** SheetJS (XLSX), jsPDF + AutoTable
- **Banco de Dados (Pronto para Produção):** PostgreSQL 14+, Prisma ORM
- **Governança:** Arquitetura desacoplada em Services/Repositories

---

## 📁 Estrutura do Repositório

```
├── .env.example              # Modelo de variáveis de ambiente
├── database/                 # Recursos de Banco de Dados Relacional
│   ├── schema.sql            # Script DDL PostgreSQL (tabelas, índices, triggers)
│   ├── seed.sql              # Dados de carga inicial (homologação COP Rede)
│   └── README.md             # Documentação de modelagem e ER diagram
├── prisma/
│   └── schema.prisma         # Modelagem type-safe para Prisma ORM
├── src/
│   ├── components/           # Componentes modulares de UI corporativa
│   │   ├── ActionPlansView.tsx      # Gestão de Planos de Ação 5W2H
│   │   ├── AutomationsView.tsx      # Motor de SLAs D0, D+5 e D+10
│   │   ├── CertificationView.tsx    # Painel e Simulador de Certificação
│   │   ├── DashboardView.tsx        # Dashboard executivo principal
│   │   ├── DeviationTypesView.tsx   # Gestão (CRUD) de Tipos de NC
│   │   ├── FooterBanner.tsx         # Rodapé dos 3 Pilares COP Rede
│   │   ├── Header.tsx               # Topbar corporativa e notificações
│   │   ├── NewAuditModal.tsx        # Modal de registro com automação
│   │   ├── ProcessDetailView.tsx    # Visão detalhada por processo
│   │   ├── ReportsView.tsx          # Exportação Excel e PDF
│   │   └── Sidebar.tsx              # Menu lateral corporativo Dark Navy
│   ├── data/                 # Bases simuladas e sementes iniciais
│   ├── services/             # Camada de serviços e persistência
│   │   └── deviationTypeService.ts  # CRUD de tipos de não conformidade
│   ├── types/                # Definições de tipagem TypeScript
│   ├── App.tsx               # Orquestrador da aplicação
│   ├── index.css             # Estilos globais e tokens Tailwind
│   └── main.tsx              # Ponto de entrada React
├── package.json              # Dependências e scripts npm
├── vite.config.ts            # Configuração do Vite e Tailwind
└── README.md                 # Esta documentação
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- **Node.js** v18+ (recomendado v20 ou superior)
- **npm** ou **yarn**

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/cqo-cop-rede.git
cd cqo-cop-rede
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar em ambiente de desenvolvimento
```bash
npm run dev
```
Acesse no navegador: **[http://localhost:5173](http://localhost:5173)**

### 4. Gerar build de produção
```bash
npm run build
```

---

## 📤 Como Subir o Projeto para o GitHub

Caso este repositório ainda não esteja conectado a um remote do GitHub:

```bash
# 1. Inicialize o repositório Git local
git init

# 2. Adicione todos os arquivos preparados
git add .

# 3. Crie o primeiro commit estruturado
git commit -m "feat: implantacao da plataforma CQO COP Rede com CRUD de NCs e estrutura de banco de dados"

# 4. Renomeie a branch principal para main
git branch -M main

# 5. Adicione o seu repositório remoto no GitHub (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/cqo-cop-rede.git

# 6. Envie os arquivos para o GitHub
git push -u origin main
```

---

## 🏛️ Três Pilares da Governança COP Rede

<div align="center">

| 👥 Equipe Mais Preparada | ⚙️ Operação Mais Eficiente | 🤝 Clientes Mais Satisfeitos |
| :---: | :---: | :---: |
| Treinamentos orientados a falhas | Automação de SLAs e redução de retrabalho | Confiabilidade de rede e excelência B2B |

*Qualidade gera confiança, processos geram resultados.*

</div>
