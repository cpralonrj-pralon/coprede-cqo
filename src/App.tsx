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

// Serviços Conectados ao Supabase (Zero Mocks)
import { auditService } from './services/auditService';
import { actionPlanService } from './services/actionPlanService';
import { certificationService } from './services/certificationService';
import { notificationService } from './services/notificationService';
import { deviationTypeService } from './services/deviationTypeService';

import type { 
  AuditRecord, 
  ActionPlan, 
  NotificationAlert, 
  AnalystCertification,
  DeviationTypeItem,
  CreateDeviationTypeInput,
  UpdateDeviationTypeInput
} from './types';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('visao-geral');
  const [selectedPeriod, setSelectedPeriod] = useState('Jun/2025');
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados Dinâmicos Alimentados pelo Supabase
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [certifications, setCertifications] = useState<AnalystCertification[]>([]);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [deviationTypes, setDeviationTypes] = useState<DeviationTypeItem[]>([]);
  
  // Executive Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Carrega todas as entidades diretamente do Supabase na inicialização
  const loadAllDataFromSupabase = async () => {
    try {
      setIsLoading(true);
      const [types, audits, plans, certs, notifs] = await Promise.all([
        deviationTypeService.getAll(),
        auditService.getAll(),
        actionPlanService.getAll(),
        certificationService.getAll(),
        notificationService.getAll(),
      ]);

      setDeviationTypes(types);
      setAuditRecords(audits);
      setActionPlans(plans);
      setCertifications(certs);
      setNotifications(notifs);
    } catch (err) {
      console.error('Erro ao carregar dados do Supabase:', err);
      showToast('Erro ao sincronizar com o Supabase. Verifique a conexão.', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllDataFromSupabase();
  }, []);

  // ==========================================
  // CRUD DE TIPOS DE NÃO CONFORMIDADE
  // ==========================================
  const handleAddDeviationType = async (input: CreateDeviationTypeInput) => {
    const newItem = await deviationTypeService.create(input);
    setDeviationTypes(prev => [newItem, ...prev]);
    showToast(`Elemento "${newItem.name}" (${newItem.code}) gravado no Supabase!`, 'success');
  };

  const handleUpdateDeviationType = async (id: string, input: UpdateDeviationTypeInput) => {
    const updated = await deviationTypeService.update(id, input);
    setDeviationTypes(prev => prev.map(item => item.id === id ? updated : item));
    showToast(`Elemento "${updated.name}" atualizado no Supabase!`, 'success');
  };

  const handleDeleteDeviationType = async (id: string) => {
    const itemToDelete = deviationTypes.find(d => d.id === id);
    await deviationTypeService.delete(id);
    setDeviationTypes(prev => prev.filter(item => item.id !== id));
    showToast(`Elemento "${itemToDelete?.name || id}" excluído no Supabase.`, 'alert');
  };

  const handleToggleActiveDeviationType = async (id: string) => {
    const toggled = await deviationTypeService.toggleActive(id);
    setDeviationTypes(prev => prev.map(item => item.id === id ? toggled : item));
    showToast(`Elemento "${toggled.name}" ${toggled.active ? 'ativado' : 'inativado'} no Supabase.`, 'success');
  };

  const handleResetDefaultsDeviationTypes = async () => {
    const defaults = await deviationTypeService.resetToDefaults();
    setDeviationTypes(defaults);
    showToast('Catálogo de tipos de não conformidade restaurado com sucesso.', 'success');
  };

  // ==========================================
  // AUDITORIAS & GATILHOS DE SLAS NO SUPABASE
  // ==========================================
  const handleNewAuditSubmit = async (newAudit: Partial<AuditRecord>) => {
    try {
      const selectedType = deviationTypes.find(d => d.name === newAudit.deviationType);

      const result = await auditService.create({
        protocol: newAudit.protocol || `INC-${Math.floor(100000 + Math.random() * 900000)}`,
        process: newAudit.process || 'Outages',
        analyst: newAudit.analyst || 'João Silva',
        supervisor: newAudit.supervisor || 'Carlos Mendes',
        cluster: newAudit.cluster || 'Cluster Sudeste',
        technology: newAudit.technology || 'GPON / FTTH',
        regional: newAudit.regional || 'Regional SP/RJ',
        score: newAudit.score || 100,
        status: newAudit.status || 'Conforme',
        deviationTypeId: selectedType?.id,
        deviationType: newAudit.deviationType,
        observations: newAudit.observations || '',
        date: newAudit.date || new Date().toISOString().split('T')[0],
      });

      // Recarrega os dados do Supabase para refletir os relacionamentos
      setAuditRecords(prev => [result.audit, ...prev]);

      if (result.actionPlanId) {
        // Recarrega planos e notificações gerados pelo trigger D0
        const [updatedPlans, updatedNotifs] = await Promise.all([
          actionPlanService.getAll(),
          notificationService.getAll(),
        ]);
        setActionPlans(updatedPlans);
        setNotifications(updatedNotifs);
        showToast(`Desvio gravado no Supabase! Plano ${result.actionPlanId} e Alerta D0 criados automaticamente.`, 'alert');
      } else {
        showToast(`Auditoria ${result.audit.protocol} gravada com 100% de conformidade no Supabase!`, 'success');
      }
    } catch (err: any) {
      console.error('Erro ao salvar auditoria no Supabase:', err);
      showToast(err.message || 'Erro ao salvar auditoria no Supabase.', 'alert');
    }
  };

  // Simulação de Desvio D0
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

  // Simulação de Escalonamento D+5 no Supabase
  const handleSimulateEscalateD5 = async () => {
    if (actionPlans.length === 0) return;
    const targetPlan = actionPlans[0];

    await actionPlanService.updateEscalation(targetPlan.id, 6, 1, 'Escalada D+5');
    await notificationService.create({
      title: '⚠️ Escalonamento D+5: 5 dias sem tratativa do gestor',
      message: `Plano ${targetPlan.id} (${targetPlan.analyst}) sem causa raiz há 6 dias. Supervisor advertido.`,
      severity: 'warning',
      protocol: targetPlan.protocol,
      recipient: targetPlan.supervisor,
      read: false,
    });

    const [updatedPlans, updatedNotifs] = await Promise.all([
      actionPlanService.getAll(),
      notificationService.getAll(),
    ]);
    setActionPlans(updatedPlans);
    setNotifications(updatedNotifs);

    showToast('Gatilho D+5 acionado no Supabase! Alerta de escalonamento enviado ao supervisor imediato.', 'alert');
  };

  // Simulação de Escalonamento D+10 no Supabase
  const handleSimulateEscalateD10 = async () => {
    if (actionPlans.length === 0) return;
    const targetPlan = actionPlans[0];

    await actionPlanService.updateEscalation(targetPlan.id, 11, 2, 'Escalada D+10');
    await notificationService.create({
      title: '🚨 Escalonamento D+10: Desvio sem resolução',
      message: `Plano ${targetPlan.id} atingiu 11 dias sem resolução. Escalonado para Gerência Executiva COP.`,
      severity: 'escalation',
      protocol: targetPlan.protocol,
      recipient: 'Gerência Executiva de Operações',
      read: false,
    });

    const [updatedPlans, updatedNotifs] = await Promise.all([
      actionPlanService.getAll(),
      notificationService.getAll(),
    ]);
    setActionPlans(updatedPlans);
    setNotifications(updatedNotifs);

    showToast('Gatilho D+10 acionado no Supabase! Desvio escalado para a Diretoria / Gerência Executiva.', 'alert');
  };

  // Conclusão de Plano de Ação no Supabase
  const handleCompletePlan = async (id: string) => {
    try {
      await actionPlanService.complete(id);
      setActionPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'Concluídas' } : p));
      showToast(`Plano de Ação ${id} concluído e validado no Supabase!`, 'success');
    } catch (err: any) {
      showToast('Erro ao concluir plano no Supabase.', 'alert');
    }
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

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-slate-500">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sincronizando com o Supabase...
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Carregando governança, auditorias e relacionamentos em tempo real</p>
            </div>
          ) : (
            <>
              {/* VIEW: VISÃO GERAL (Dashboard Executivo Real) */}
              {currentTab === 'visao-geral' && (
                <DashboardView 
                  onNavigateTab={setCurrentTab} 
                  deviationTypes={deviationTypes}
                  auditRecords={auditRecords}
                  actionPlans={actionPlans}
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
            </>
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
