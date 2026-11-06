import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Search, 
  Calendar,
  User,
  ArrowUpRight
} from 'lucide-react';
import type { ActionPlan } from '../types';

interface ActionPlansViewProps {
  actionPlans: ActionPlan[];
  onCompletePlan: (id: string) => void;
}

export const ActionPlansView: React.FC<ActionPlansViewProps> = ({
  actionPlans,
  onCompletePlan,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = actionPlans.filter((p) => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchSearch = p.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.analyst.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.deviationType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Gestão de Planos de Ação (5W2H / CAPA)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tratativa estruturada de não conformidades com acompanhamento de prazos, causa raiz e escalonamento automático de SLA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Total em Acompanhamento: {actionPlans.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar protocolo, analista ou causa raiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({actionPlans.length})
          </button>
          <button
            onClick={() => setFilterStatus('Em andamento')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'Em andamento' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Em Andamento
          </button>
          <button
            onClick={() => setFilterStatus('Escalada D+5')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'Escalada D+5' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Escalados D+5
          </button>
          <button
            onClick={() => setFilterStatus('Escalada D+10')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'Escalada D+10' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Escalados D+10
          </button>
          <button
            onClick={() => setFilterStatus('Concluídas')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'Concluídas' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Concluídos
          </button>
        </div>
      </div>

      {/* Grid of Action Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
              plan.escalationLevel === 2
                ? 'border-red-400 ring-2 ring-red-500/10'
                : plan.escalationLevel === 1
                ? 'border-amber-400'
                : 'border-slate-200'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-900">{plan.id}</span>
                  <p className="text-[11px] font-semibold text-blue-700">{plan.protocol} • {plan.process}</p>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  plan.status === 'Escalada D+10' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  plan.status === 'Escalada D+5' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  plan.status === 'Concluídas' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {plan.status}
                </span>
              </div>

              {/* Deviation description */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Desvio Identificado</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{plan.deviationType}</p>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{plan.description}</p>
              </div>

              {/* 5W2H Highlights */}
              <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">Causa Raiz:</span>
                  <span className="text-slate-700 text-[11px]">{plan.rootCause}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">Ação Proposta (O quê):</span>
                  <span className="text-slate-800 font-medium text-[11px]">{plan.what}</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Analista:</span>
                  <span className="font-semibold text-slate-700">{plan.analyst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Responsável Tratativa:</span>
                  <span className="font-semibold text-slate-700">{plan.who}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prazo Limite:</span>
                  <span className="font-semibold text-slate-700">{plan.when}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo em Aberto:</span>
                  <span className={`font-bold ${plan.daysOpen >= 10 ? 'text-rose-600' : plan.daysOpen >= 5 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {plan.daysOpen} dias
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {plan.status !== 'Concluídas' ? (
                <button
                  onClick={() => onCompletePlan(plan.id)}
                  className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Validar e Concluir Ação</span>
                </button>
              ) : (
                <div className="w-full text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
                  Ação Concluída e Auditada pelo CQO
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
