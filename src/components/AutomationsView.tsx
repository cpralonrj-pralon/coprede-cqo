import React, { useState } from 'react';
import { 
  Zap, 
  Bell, 
  UserCheck, 
  FileText, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Play,
  RotateCcw,
  Send,
  Building2,
  Users
} from 'lucide-react';
import type { NotificationAlert, ActionPlan } from '../types';

interface AutomationsViewProps {
  notifications: NotificationAlert[];
  actionPlans: ActionPlan[];
  onSimulateDeviation: () => void;
  onSimulateEscalateD5: () => void;
  onSimulateEscalateD10: () => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  notifications,
  actionPlans,
  onSimulateDeviation,
  onSimulateEscalateD5,
  onSimulateEscalateD10,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'logs'>('pipeline');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Title Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Motor de Automações & Escalonamento de Desvios (SLAs)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Governança proativa programada. Monitoramento contínuo com geração instantânea de planos de ação, 
            notificação a lideranças e escalonamento multinível automático com <strong>5 dias sem tratativa</strong> e 
            <strong> 10 dias sem resolução</strong>.
          </p>
        </div>

        {/* Live Simulation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSimulateDeviation}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simular Desvio D0</span>
          </button>

          <button
            onClick={onSimulateEscalateD5}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Simular D+5 (Gestor)</span>
          </button>

          <button
            onClick={onSimulateEscalateD10}
            className="flex items-center gap-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simular D+10 (Diretoria)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          WORKFLOW SLA PIPELINE (D0 -> D+5 -> D+10)
         ========================================================================= */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Fluxo de Automação Parametrizado (CQO Governance Engine)
          </h3>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Motor Ativo em Tempo Real
          </span>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1: D0 Detecção */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px]">Gatilho D0</span>
                <span className="text-slate-400">Tempo 0</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Apontamento de Desvio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auditoria registrada com Não Conformidade ou Desvio Grave no sistema CQO.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bloqueio preventivo</span>
              </div>
            </div>
          </div>

          {/* Step 2: D0 Ações Imediatas */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">Automação D0</span>
                <span className="text-slate-400">Instantâneo</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Disparo em Cadeia</h4>
              <ul className="text-xs text-slate-600 space-y-1 mt-2">
                <li className="flex items-center gap-1.5">
                  <Bell className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Criar alerta corporativo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <UserCheck className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Notificar Gestor imediato</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Gerar Plano de Ação 5W2H</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] text-blue-800 font-semibold">
              SLA inicial de 5 dias iniciado
            </div>
          </div>

          {/* Step 3: D+5 Escalonamento N1 */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px]">Gatilho D+5</span>
                <span className="text-amber-800 font-bold">5 dias sem tratativa</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Escalonamento Nível 1</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se o gestor não preencher a causa raiz e a ação corretiva em até 5 dias úteis:
              </p>
              <ul className="text-xs text-amber-900 space-y-1 mt-2 font-medium">
                <li className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Aviso de advertência ao Supervisor</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Reincidência marcada no squad</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] text-amber-800 font-semibold">
              Status muda para "Escalada D+5"
            </div>
          </div>

          {/* Step 4: D+10 Escalonamento N2 */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px]">Gatilho D+10</span>
                <span className="text-rose-800 font-bold">10 dias sem resolução</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Escalonamento Executivo</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Desvio grave não solucionado ou validado em 10 dias corridos:
              </p>
              <ul className="text-xs text-rose-950 space-y-1 mt-2 font-medium">
                <li className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Notificar Gestor Acima (Gerente Executivo)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Inclusão em Pauta de Governança COP</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200 text-[11px] text-rose-800 font-semibold">
              Status muda para "Escalada D+10"
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          NOTIFICATIONS & AUDIT LOG FEED
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Alerts List */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Histórico de Alertas e Disparos Automáticos
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {notifications.length} registros
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className="py-3 flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  notif.severity === 'escalation' ? 'bg-rose-100 text-rose-700' :
                  notif.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                  notif.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {notif.severity === 'escalation' ? <ShieldAlert className="w-4 h-4" /> :
                   notif.severity === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   notif.severity === 'critical' ? <AlertTriangle className="w-4 h-4" /> :
                   <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                    <span>Destinatário: <strong className="text-slate-700">{notif.recipient}</strong></span>
                    {notif.protocol && (
                      <span>Protocolo: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">{notif.protocol}</code></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plans under SLA Monitor */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Controle de Envelhecimento dos Planos (Aging SLA)
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {actionPlans.length} planos ativos
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {actionPlans.map((plan) => (
              <div key={plan.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{plan.id}</span>
                    <span className="text-[10px] text-slate-500">({plan.protocol})</span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                      {plan.process}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{plan.deviationType} - {plan.analyst}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Resp: {plan.who} | Criado: {plan.createdAt}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-xs font-black px-2 py-0.5 rounded-full inline-block ${
                    plan.escalationLevel === 2 ? 'bg-red-100 text-red-800 border border-red-300' :
                    plan.escalationLevel === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    plan.status === 'Concluídas' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {plan.status}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">
                    {plan.daysOpen} dias decorridos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
