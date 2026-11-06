import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, type NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CertificationView } from './components/CertificationView';
import { AutomationsView } from './components/AutomationsView';
import { ActionPlansView } from './components/ActionPlansView';
import { ReportsView } from './components/ReportsView';
import { ProcessDetailView } from './components/ProcessDetailView';
import { DeviationTypesView } from './components/DeviationTypesView';
import { FooterBanner } from './components/FooterBanner';
import { NewAuditModal } from './components/NewAuditModal';
import { 
  INITIAL_ACTION_PLANS, 
  INITIAL_CERTIFICATIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { INITIAL_AUDIT_RECORDS } from './data/mockAudits';
import { deviationTypeService, DEFAULT_DEVIATION_TYPES } from './services/deviationTypeService';
import type { 
  AuditRecord, 
  ActionPlan, 
  NotificationAlert, 
  AnalystCertification,
  DeviationTypeItem,
  CreateDeviationTypeInput,
  UpdateDeviationTypeInput
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('visao-geral');
  const [selectedPeriod, setSelectedPeriod] = useState('Jun/2025');
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);

  // Core state
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(INITIAL_ACTION_PLANS);
  const [certifications, setCertifications] = useState<AnalystCertification[]>(INITIAL_CERTIFICATIONS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);
  const [deviationTypes, setDeviationTypes] = useState<DeviationTypeItem[]>(DEFAULT_DEVIATION_TYPES);
  
  // Executive Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  // Carrega os tipos de não conformidade do service/repositório
  useEffect(() => {
    const loadDeviationTypes = async () => {
      try {
        const types = await deviationTypeService.getAll();
        setDeviationTypes(types);
      } catch (err) {
        console.error('Erro ao carregar tipos de não conformidade:', err);
      }
    };
    loadDeviationTypes();
  }, []);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // ==========================================
  // CRUD DE TIPOS DE NÃO CONFORMIDADE
  // ==========================================
  const handleAddDeviationType = async (input: CreateDeviationTypeInput) => {
    const newItem = await deviationTypeService.create(input);
    setDeviationTypes(prev => [newItem, ...prev]);
    showToast(`Elemento "${newItem.name}" (${newItem.code}) incluído com sucesso no catálogo!`, 'success');
  };

  const handleUpdateDeviationType = async (id: string, input: UpdateDeviationTypeInput) => {
    const updated = await deviationTypeService.update(id, input);
    setDeviationTypes(prev => prev.map(item => item.id === id ? updated : item));
    showToast(`Elemento "${updated.name}" alterado com sucesso!`, 'success');
  };

  const handleDeleteDeviationType = async (id: string) => {
    const itemToDelete = deviationTypes.find(d => d.id === id);
    await deviationTypeService.delete(id);
    setDeviationTypes(prev => prev.filter(item => item.id !== id));
    showToast(`Elemento "${itemToDelete?.name || id}" excluído com sucesso do catálogo.`, 'alert');
  };

  const handleToggleActiveDeviationType = async (id: string) => {
    const toggled = await deviationTypeService.toggleActive(id);
    setDeviationTypes(prev => prev.map(item => item.id === id ? toggled : item));
    showToast(`Elemento "${toggled.name}" foi ${toggled.active ? 'ativado' : 'inativado'}.`, 'success');
  };

  const handleResetDefaultsDeviationTypes = async () => {
    const defaults = await deviationTypeService.resetToDefaults();
    setDeviationTypes(defaults);
    showToast('Catálogo de tipos de não conformidade restaurado para os padrões do COP Rede.', 'success');
  };

  // Record new audit with instant automated triggers
  const handleNewAuditSubmit = (newAudit: Partial<AuditRecord>) => {
    const auditId = `AUD-${Math.floor(8900 + Math.random() * 1000)}`;
    const fullAudit: AuditRecord = {
      id: auditId,
      protocol: newAudit.protocol || `INC-${Math.floor(100000 + Math.random() * 900000)}`,
      process: newAudit.process || 'Outages',
      analyst: newAudit.analyst || 'João Silva',
      supervisor: newAudit.supervisor || 'Carlos Mendes',
      cluster: newAudit.cluster || 'Cluster Sudeste',
      technology: newAudit.technology || 'GPON / FTTH',
      regional: newAudit.regional || 'Regional SP/RJ',
      score: newAudit.score || 100,
      status: newAudit.status || 'Conforme',
      deviationType: newAudit.deviationType,
      date: newAudit.date || new Date().toISOString().split('T')[0],
      observations: newAudit.observations || '',
    };

    setAuditRecords(prev => [fullAudit, ...prev]);

    // Check if deviation exists: TRIGGER D0 AUTOMATIONS
    if (fullAudit.status !== 'Conforme') {
      const planId = `PA-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newPlan: ActionPlan = {
        id: planId,
        auditId: fullAudit.id,
        protocol: fullAudit.protocol,
        analyst: fullAudit.analyst,
        supervisor: fullAudit.supervisor,
        process: fullAudit.process,
        deviationType: fullAudit.deviationType || 'Desvio Operacional',
        description: fullAudit.observations,
        rootCause: 'Análise de causa raiz preliminar em andamento pelo supervisor.',
        what: `Revisão do procedimento operacional do processo ${fullAudit.process}`,
        why: 'Prevenir reincidência e assegurar conformidade do COP Rede',
        who: fullAudit.supervisor,
        when: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysOpen: 0,
        escalationLevel: 0,
        status: 'Em andamento',
        createdAt: fullAudit.date,
      };

      const newNotif: NotificationAlert = {
        id: `NOTIF-${Date.now()}`,
        timestamp: 'Agora mesmo',
        title: `🚨 Alerta Automático: Desvio em ${fullAudit.process}`,
        message: `Novo desvio registrado para ${fullAudit.analyst}. Plano de Ação ${planId} gerado e gestor ${fullAudit.supervisor} notificado.`,
        severity: fullAudit.status === 'Desvio Grave' ? 'critical' : 'warning',
        protocol: fullAudit.protocol,
        recipient: fullAudit.supervisor,
        read: false,
      };

      setActionPlans(prev => [newPlan, ...prev]);
      setNotifications(prev => [newNotif, ...prev]);
      showToast(`Desvio detectado! Alerta gerado e Plano de Ação ${planId} criado automaticamente para o gestor.`, 'alert');
    } else {
      showToast(`Auditoria ${fullAudit.protocol} registrada com 100% de conformidade!`, 'success');
    }
  };

  // Simulators for SLA triggers
  const handleSimulateDeviation = () => {
    handleNewAuditSubmit({
      protocol: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
      process: 'Outages',
      analyst: 'João Silva',
      supervisor: 'Carlos Mendes',
      cluster: 'Cluster Sudeste',
      technology: 'DWDM & Backbone',
      regional: 'Regional SP/RJ',
      score: 65,
      status: 'Desvio Grave',
      deviationType: 'Escalonamento incorreto',
      observations: 'Simulação de desvio D0 disparada pelo painel de governança.',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSimulateEscalateD5 = () => {
    setActionPlans(prev => prev.map((plan, index) => {
      if (index === 0) {
        return {
          ...plan,
          daysOpen: 6,
          escalationLevel: 1,
          status: 'Escalada D+5',
        };
      }
      return plan;
    }));

    const alertD5: NotificationAlert = {
      id: `NOTIF-D5-${Date.now()}`,
      timestamp: 'Agora mesmo',
      title: '⚠️ Escalonamento D+5: 5 dias sem tratativa do gestor',
      message: 'Plano de ação sem apontamento de causa raiz há 6 dias. Supervisor advertido.',
      severity: 'warning',
      recipient: 'Carlos Mendes (Supervisor)',
      read: false,
    };

    setNotifications(prev => [alertD5, ...prev]);
    showToast('Gatilho D+5 acionado! Alerta de escalonamento enviado ao supervisor imediato.', 'alert');
  };

  const handleSimulateEscalateD10 = () => {
    setActionPlans(prev => prev.map((plan, index) => {
      if (index === 0) {
        return {
          ...plan,
          daysOpen: 11,
          escalationLevel: 2,
          status: 'Escalada D+10',
        };
      }
      return plan;
    }));

    const alertD10: NotificationAlert = {
      id: `NOTIF-D10-${Date.now()}`,
      timestamp: 'Agora mesmo',
      title: '🚨 Escalonamento D+10: Desvio sem resolução',
      message: 'Plano atingiu 11 dias sem validação de fechamento. Escalonado para Gerência Executiva COP.',
      severity: 'escalation',
      recipient: 'Gerência Executiva de Operações',
      read: false,
    };

    setNotifications(prev => [alertD10, ...prev]);
    showToast('Gatilho D+10 acionado! Desvio escalado para a Diretoria / Gerência Executiva.', 'alert');
  };

  const handleCompletePlan = (id: string) => {
    setActionPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'Concluídas' } : p));
    showToast(`Plano de Ação ${id} concluído e auditado pelo CQO com sucesso!`, 'success');
  };

  const openActionPlansCount = actionPlans.filter(p => p.status !== 'Concluídas').length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      
      {/* Top Corporate Header */}
      <Header 
        notifications={notifications}
        onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
        selectedPeriod={selectedPeriod}
        onChangePeriod={setSelectedPeriod}
        onNavigateToAutomations={() => setCurrentTab('automacoes')}
      />

      {/* Main Workspace: Sidebar + Dynamic View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navy Left Sidebar */}
        <Sidebar 
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          openActionPlansCount={openActionPlansCount}
          deviationTypesCount={deviationTypes.length}
        />

        {/* View Switcher */}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          
          {/* TOAST POPUP */}
          {toast && (
            <div className="fixed top-16 right-6 z-50 animate-in slide-in-from-top duration-300">
              <div className={`p-4 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
                toast.type === 'alert' 
                  ? 'bg-rose-900 text-white border-rose-700' 
                  : 'bg-emerald-900 text-white border-emerald-700'
              }`}>
                {toast.type === 'alert' ? <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {/* VIEW: VISÃO GERAL (O Dashboard da imagem) */}
          {currentTab === 'visao-geral' && (
            <DashboardView 
              onNavigateTab={setCurrentTab} 
              deviationTypes={deviationTypes}
              auditRecords={auditRecords}
            />
          )}

          {/* VIEW: CERTIFICAÇÃO (Bronze, Prata, Ouro, Diamante) */}
          {currentTab === 'certificacao' && (
            <CertificationView certifications={certifications} />
          )}

          {/* VIEW: AUTOMAÇÕES & SLAS (D0 -> D+5 -> D+10) */}
          {currentTab === 'automacoes' && (
            <AutomationsView 
              notifications={notifications}
              actionPlans={actionPlans}
              onSimulateDeviation={handleSimulateDeviation}
              onSimulateEscalateD5={handleSimulateEscalateD5}
              onSimulateEscalateD10={handleSimulateEscalateD10}
            />
          )}

          {/* VIEW: PLANOS DE AÇÃO (5W2H) */}
          {currentTab === 'plano-acao' && (
            <ActionPlansView 
              actionPlans={actionPlans}
              onCompletePlan={handleCompletePlan}
            />
          )}

          {/* VIEW: RELATÓRIOS (Exportação PDF e Excel) */}
          {currentTab === 'relatorios' && (
            <ReportsView auditRecords={auditRecords} />
          )}

          {/* VIEW: TIPOS E ELEMENTOS DE NÃO CONFORMIDADE (CRUD COMPLETO) */}
          {currentTab === 'tipos-nc' && (
            <DeviationTypesView 
              deviationTypes={deviationTypes}
              auditRecords={auditRecords}
              onAddDeviationType={handleAddDeviationType}
              onUpdateDeviationType={handleUpdateDeviationType}
              onDeleteDeviationType={handleDeleteDeviationType}
              onToggleActive={handleToggleActiveDeviationType}
              onResetDefaults={handleResetDefaultsDeviationTypes}
            />
          )}

          {/* PROCESS VIEWS */}
          {currentTab === 'outages' && (
            <ProcessDetailView 
              title="Outages"
              category="Processo Crítico"
              description="Acompanhamento da qualidade operacional no isolamento, contingenciamento e restabelecimento de incidentes de rede de alta severidade."
              records={auditRecords.filter(r => r.process === 'Outages')}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'acionamentos' && (
            <ProcessDetailView 
              title="Acionamentos"
              category="Campo e Infraestrutura"
              description="Auditoria de acionamento tempestivo de equipes de campo, validação de SLA e preenchimento de checklist de despacho."
              records={auditRecords.filter(r => r.process === 'Acionamentos')}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'escalonamentos' && (
            <ProcessDetailView 
              title="Escalonamentos"
              category="Fluxo de Tratativa"
              description="Controle de rotas de acionamento N2, N3 e parceiros terceiros sem retenção indevida ou encaminhamento sem triagem técnica."
              records={auditRecords.filter(r => r.process === 'Escalonamentos')}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'baixas-offline' && (
            <ProcessDetailView 
              title="Baixas Offline"
              category="Encerramento de Chamados"
              description="Controle rigoroso dos encerramentos offline, conferência da quantidade de elementos restabelecidos e testes de certificação."
              records={auditRecords.filter(r => r.process === 'Baixas Offline')}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'analistas' && (
            <CertificationView certifications={certifications} />
          )}

          {currentTab === 'supervisores' && (
            <ProcessDetailView 
              title="Governança de Supervisores"
              category="Liderança Operacional"
              description="Acompanhamento individualizado de IQO por equipe, tempo médio de resposta aos planos de ação e redução de reincidências."
              records={auditRecords}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'reincidencia' && (
            <ProcessDetailView 
              title="Matriz de Reincidência"
              category="Prevenção de Falhas"
              description="Mapeamento de desvios repetidos pelo mesmo analista ou processo em janela de 30 dias para reciclagem direcionada."
              records={auditRecords.filter(r => r.status !== 'Conforme')}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'tendencias' && (
            <ProcessDetailView 
              title="Tendências e Previsibilidade"
              category="Analytics Avançado"
              description="Curvas preditivas de aderência operacional e correlação entre treinamentos e redução de falhas de processo."
              records={auditRecords}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {currentTab === 'fcca' && (
            <ProcessDetailView 
              title="FCCA (Failure Cause & Corrective Action)"
              category="Causa Raiz & Engenharia"
              description="Comitê de falhas graves, análise de 5 porquês e retroalimentação dos procedimentos operacionais padrão (POP)."
              records={auditRecords.filter(r => r.status === 'Desvio Grave')}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Corporate Footer matching image */}
      <FooterBanner />

      {/* New Audit Modal */}
      <NewAuditModal
        isOpen={isNewAuditModalOpen}
        onClose={() => setIsNewAuditModalOpen(false)}
        onSubmit={handleNewAuditSubmit}
        deviationTypes={deviationTypes}
        onNavigateToDeviationTypes={() => setCurrentTab('tipos-nc')}
      />

    </div>
  );
}

export default App;
