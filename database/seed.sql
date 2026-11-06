-- =============================================================================
-- COP REDE - CQO (CENTRAL DE QUALIDADE OPERACIONAL)
-- SCRIPT DE CARGA INICIAL (SEED DATA)
-- =============================================================================

-- 1. TIPOS DE NÃO CONFORMIDADE (DEVIATION_TYPES)
INSERT INTO deviation_types (id, code, name, category, severity_default, weight, description, active)
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

-- 2. USUÁRIOS E SUPERVISORES (USERS)
INSERT INTO users (id, name, email, role, regional, cluster, technology, avatar_color, active)
VALUES 
('11111111-1111-1111-1111-111111111101', 'Carlos Mendes', 'carlos.mendes@coprede.com.br', 'SUPERVISOR', 'Regional SP/RJ', 'Cluster Sudeste', 'DWDM & Backbone', 'bg-blue-700', true),
('11111111-1111-1111-1111-111111111102', 'Fernanda Lima', 'fernanda.lima@coprede.com.br', 'SUPERVISOR', 'Regional PR/SC/RS', 'Cluster Sul', 'GPON / FTTH', 'bg-purple-700', true),
('11111111-1111-1111-1111-111111111103', 'Rodrigo Alves', 'rodrigo.alves@coprede.com.br', 'SUPERVISOR', 'Regional BA/PE/CE', 'Cluster Nordeste', 'IP Core / MPLS', 'bg-emerald-700', true),
('11111111-1111-1111-1111-111111111104', 'Juliana Costa', 'juliana.costa@coprede.com.br', 'SUPERVISOR', 'Regional MG/ES', 'Cluster Sudeste', 'GPON / FTTH', 'bg-amber-700', true),
('11111111-1111-1111-1111-111111111105', 'Marcelo Prado', 'marcelo.prado@coprede.com.br', 'SUPERVISOR', 'Regional GO/DF/MT', 'Cluster Centro-Oeste', 'Rádio & Micro-ondas', 'bg-rose-700', true)
ON CONFLICT (email) DO NOTHING;

-- 3. AUDITORIAS INICIAIS (AUDITS)
INSERT INTO audits (id, protocol, process, analyst_name, supervisor_name, cluster, technology, regional, score, status, deviation_type_id, deviation_type_name, date, observations)
VALUES 
('AUD-8831', 'INC-994821', 'Outages', 'João Silva', 'Carlos Mendes', 'Cluster Sudeste', 'GPON / FTTH', 'Regional SP/RJ', 80.0, 'Não Conforme', 'tnc-001', 'Escalonamento incorreto', '2025-06-17', 'Ticket escalonado para N3 sem validação de anel de fibra primário.'),
('AUD-8842', 'INC-995104', 'Baixas Offline', 'Maria Santos', 'Fernanda Lima', 'Cluster Sul', 'IP Core / MPLS', 'Regional PR/SC/RS', 75.0, 'Não Conforme', 'tnc-002', 'Quantidade de ativos incorreta', '2025-06-22', 'Declarada baixa de 4 switches quando havia 11 elementos afetados.'),
('AUD-8859', 'INC-996311', 'Acionamentos', 'Pedro Henrique', 'Rodrigo Alves', 'Cluster Nordeste', 'DWDM & Backbone', 'Regional BA/PE/CE', 82.0, 'Não Conforme', 'tnc-003', 'Falta de evidência', '2025-06-26', 'Acionamento de campo sem anexar OTDR ou foto do dio rompido.'),
('AUD-8865', 'INC-997120', 'Escalonamentos', 'Ana Souza', 'Juliana Costa', 'Cluster Sudeste', 'GPON / FTTH', 'Regional MG/ES', 88.0, 'Não Conforme', 'tnc-004', 'Fraseologia inadequada', '2025-06-20', 'Encerramento com gírias internas e termos não técnicos.'),
('AUD-8877', 'INC-998012', 'Tratativa GPON', 'Lucas Ferreira', 'Marcelo Prado', 'Cluster Centro-Oeste', 'Rádio & Micro-ondas', 'Regional GO/DF/MT', 60.0, 'Desvio Grave', 'tnc-005', 'Solução incorreta', '2025-06-24', 'Atribuído defeito à OLT quando a causa raiz foi rompimento de drop.'),
('AUD-8888', 'INC-998240', 'Outages', 'Beatriz Vasconcelos', 'Carlos Mendes', 'Cluster Sudeste', 'DWDM & Backbone', 'Regional SP/RJ', 100.0, 'Conforme', NULL, NULL, '2025-06-28', 'Atendimento e encerramento impecáveis com anexo de traçados e evidências.'),
('AUD-8889', 'INC-998315', 'Acionamentos', 'Gabriel Albuquerque', 'Fernanda Lima', 'Cluster Sul', 'GPON / FTTH', 'Regional PR/SC/RS', 100.0, 'Conforme', NULL, NULL, '2025-06-28', 'Disparo no tempo correto de 8 minutos, documentação técnica anexada.'),
('AUD-8890', 'INC-998419', 'Baixas Offline', 'Camila Nogueira', 'Rodrigo Alves', 'Cluster Nordeste', 'IP Core / MPLS', 'Regional BA/PE/CE', 100.0, 'Conforme', NULL, NULL, '2025-06-27', 'Validação de alarmes cruzados realizada com precisão.')
ON CONFLICT (id) DO NOTHING;

-- 4. PLANOS DE AÇÃO INICIAIS (ACTION_PLANS)
INSERT INTO action_plans (id, audit_id, protocol, analyst_name, supervisor_name, process, deviation_type_name, description, root_cause, what, why, who, target_date, days_open, escalation_level, status, created_at)
VALUES 
('PA-2025-0101', 'AUD-8831', 'INC-994821', 'João Silva', 'Carlos Mendes', 'Outages', 'Escalonamento incorreto', 'Ticket escalonado para N3 sem validação de anel de fibra primário.', 'Falta de consulta ao mapa de topologia GIS no fechamento de janela.', 'Reciclagem prática no módulo de roteamento de chamado GIS', 'Evitar chamados indevidos a especialistas de plantão N3', 'Carlos Mendes (Supervisor)', '2025-06-18', 11, 2, 'Escalada D+10', '2025-06-17 10:00:00Z'),
('PA-2025-0102', 'AUD-8842', 'INC-995104', 'Maria Santos', 'Fernanda Lima', 'Baixas Offline', 'Quantidade de ativos incorreta', 'Declarada baixa de 4 switches quando havia 11 elementos afetados.', 'Fechamento rápido sem checagem de alarmes de correlação no Zabbix.', 'Revisão do checklist obrigatório de verificação de ativos', 'Impacto na precisão do indicador de disponibilidade MTTR da regional', 'Fernanda Lima (Supervisora)', '2025-06-22', 6, 1, 'Escalada D+5', '2025-06-22 14:00:00Z'),
('PA-2025-0103', 'AUD-8859', 'INC-996311', 'Pedro Henrique', 'Rodrigo Alves', 'Acionamentos', 'Falta de evidência', 'Acionamento de campo sem anexar OTDR ou foto do dio rompido.', 'Técnico repassou via WhatsApp mas evidência não foi anexada ao chamado oficial.', 'Procedimento padrão de anexo obrigatório de fotos e teste reflectométrico', 'Conformidade com SLA de parceiros de infraestrutura externa', 'Rodrigo Alves (Supervisor)', '2025-06-27', 2, 0, 'Em andamento', '2025-06-26 11:30:00Z'),
('PA-2025-0104', 'AUD-8865', 'INC-997120', 'Ana Souza', 'Juliana Costa', 'Escalonamentos', 'Fraseologia inadequada', 'Encerramento com gírias internas e termos não técnicos.', 'Falta de revisão antes do submit de fechamento para o cliente B2B.', 'Treinamento de comunicação executiva e fraseologia padrão COP', 'Preservação da imagem corporativa e conformidade de auditoria', 'Juliana Costa (Supervisora)', '2025-06-20', 1, 0, 'Concluídas', '2025-06-20 09:15:00Z'),
('PA-2025-0105', 'AUD-8877', 'INC-998012', 'Lucas Ferreira', 'Marcelo Prado', 'Tratativa GPON', 'Solução incorreta', 'Atribuído defeito à OLT quando a causa raiz foi rompimento de drop.', 'Diagnóstico preliminar não validado com os níveis ópticos de potência.', 'Treinamento em leitura de potência óptica e status de GPON boards', 'Reduzir reincidência de abertura de chamados para gerência de rede', 'Marcelo Prado (Supervisor)', '2025-06-25', 4, 0, 'Em andamento', '2025-06-24 16:45:00Z')
ON CONFLICT (id) DO NOTHING;

-- 5. CERTIFICAÇÕES INICIAIS (CERTIFICATIONS)
INSERT INTO certifications (id, analyst_name, supervisor_name, cluster, technology, regional, tier, iqo_score, reincidencias, trainings_completed_pct, days_without_deviation, total_audits, avatar_color)
VALUES 
('CERT-01', 'Beatriz Vasconcelos', 'Carlos Mendes', 'Cluster Sudeste', 'DWDM & Backbone', 'Regional SP/RJ', 'Diamante', 99.4, 0, 100.0, 124, 88, 'bg-cyan-500'),
('CERT-02', 'Gabriel Albuquerque', 'Fernanda Lima', 'Cluster Sul', 'GPON / FTTH', 'Regional PR/SC/RS', 'Ouro', 97.8, 0, 100.0, 78, 94, 'bg-amber-500'),
('CERT-03', 'Camila Nogueira', 'Rodrigo Alves', 'Cluster Nordeste', 'IP Core / MPLS', 'Regional BA/PE/CE', 'Ouro', 96.5, 0, 95.0, 64, 82, 'bg-emerald-500'),
('CERT-04', 'Lucas Ferreira', 'Marcelo Prado', 'Cluster Centro-Oeste', 'Rádio & Micro-ondas', 'Regional GO/DF/MT', 'Prata', 92.0, 1, 88.0, 38, 79, 'bg-slate-400'),
('CERT-05', 'Ana Souza', 'Juliana Costa', 'Cluster Sudeste', 'GPON / FTTH', 'Regional MG/ES', 'Prata', 91.0, 2, 85.0, 32, 85, 'bg-indigo-500'),
('CERT-06', 'Pedro Henrique', 'Rodrigo Alves', 'Cluster Nordeste', 'DWDM & Backbone', 'Regional BA/PE/CE', 'Bronze', 90.0, 3, 75.0, 18, 73, 'bg-amber-700'),
('CERT-07', 'Maria Santos', 'Fernanda Lima', 'Cluster Sul', 'IP Core / MPLS', 'Regional PR/SC/RS', 'Bronze', 88.0, 4, 72.0, 16, 90, 'bg-rose-500'),
('CERT-08', 'João Silva', 'Carlos Mendes', 'Cluster Sudeste', 'GPON / FTTH', 'Regional SP/RJ', 'Bronze', 85.0, 4, 70.0, 12, 110, 'bg-blue-600')
ON CONFLICT (id) DO NOTHING;
