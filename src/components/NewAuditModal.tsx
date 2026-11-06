import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, PlusCircle, Settings } from 'lucide-react';
import type { ProcessType, DeviationSeverity, AuditRecord, DeviationTypeItem } from '../types';
import { PROCESSOS, REGIONAIS, CLUSTERS, TECNOLOGIAS, SUPERVISORES, ANALISTAS } from '../data/mockData';

interface NewAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (audit: Partial<AuditRecord>) => void;
  deviationTypes: DeviationTypeItem[];
  onNavigateToDeviationTypes?: () => void;
}

export const NewAuditModal: React.FC<NewAuditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  deviationTypes,
  onNavigateToDeviationTypes 
}) => {
  if (!isOpen) return null;

  // Filtrar apenas tipos ativos
  const activeDeviationTypes = deviationTypes.filter(d => d.active);

  const [protocol, setProtocol] = useState(`INC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [process, setProcess] = useState<ProcessType>('Outages');
  const [analyst, setAnalyst] = useState('João Silva');
  const [supervisor, setSupervisor] = useState('Carlos Mendes');
  const [regional, setRegional] = useState('Regional SP/RJ');
  const [cluster, setCluster] = useState('Cluster Sudeste');
  const [technology, setTechnology] = useState('GPON / FTTH');
  const [status, setStatus] = useState<DeviationSeverity>('Não Conforme');
  const [deviationType, setDeviationType] = useState(
    activeDeviationTypes.length > 0 ? activeDeviationTypes[0].name : 'Escalonamento incorreto'
  );
  const [score, setScore] = useState(85);
  const [observations, setObservations] = useState('');

  // Sincroniza deviationType se a lista mudar
  useEffect(() => {
    if (activeDeviationTypes.length > 0 && !activeDeviationTypes.some(d => d.name === deviationType)) {
      setDeviationType(activeDeviationTypes[0].name);
    }
  }, [deviationTypes]);

  // Ao mudar o tipo de desvio, ajusta severidade sugerida e nota estimada
  const handleSelectDeviationType = (typeName: string) => {
    setDeviationType(typeName);
    const selected = activeDeviationTypes.find(d => d.name === typeName);
    if (selected) {
      if (selected.severityDefault === 'Desvio Grave') {
        setStatus('Desvio Grave');
        setScore(Math.max(40, 100 - selected.weight * 2));
      } else {
        setStatus('Não Conforme');
        setScore(Math.max(60, 100 - selected.weight));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      protocol,
      process,
      analyst,
      supervisor,
      regional,
      cluster,
      technology,
      status,
      deviationType: status === 'Conforme' ? undefined : deviationType,
      score,
      observations: observations || 'Auditoria registrada via console CQO COP Rede.',
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in duration-200 my-8">
        
        {/* Header */}
        <div className="bg-[#0c2044] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold">Registrar Nova Auditoria CQO</h3>
              <p className="text-xs text-slate-300">Entrada oficial de dados para governança operacional</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Protocolo */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Protocolo / Ticket</label>
              <input 
                type="text"
                required
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Processo */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Processo Operacional</label>
              <select
                value={process}
                onChange={(e) => setProcess(e.target.value as ProcessType)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                {PROCESSOS.filter(p => p !== 'Todos').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Analista */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Analista Auditado</label>
              <select
                value={analyst}
                onChange={(e) => setAnalyst(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                {ANALISTAS.filter(a => a !== 'Todos').map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Supervisor */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Supervisor Responsável</label>
              <select
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                {SUPERVISORES.filter(s => s !== 'Todos').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Regional */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Regional</label>
              <select
                value={regional}
                onChange={(e) => setRegional(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden"
              >
                {REGIONAIS.filter(r => r !== 'Todas').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Tecnologia */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tecnologia</label>
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden"
              >
                {TECNOLOGIAS.filter(t => t !== 'Todas').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Resultado & Status */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-2">Resultado da Auditoria</label>
            <div className="grid grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => { setStatus('Conforme'); setScore(100); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Conforme'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Conforme (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => { setStatus('Não Conforme'); setScore(80); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Não Conforme'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Não Conforme</span>
              </button>

              <button
                type="button"
                onClick={() => { setStatus('Desvio Grave'); setScore(50); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Desvio Grave'
                    ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Desvio Grave</span>
              </button>

            </div>
          </div>

          {/* Conditional Deviation Fields */}
          {status !== 'Conforme' && (
            <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 space-y-3">
              <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Gatilho de Automação: Será criado Plano de Ação e Alerta ao Gestor</span>
                </div>
                {onNavigateToDeviationTypes && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToDeviationTypes();
                    }}
                    className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Gerenciar Tipos de NC</span>
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Elemento de Não Conformidade (Catálogo Dinâmico)
                </label>
                <select
                  value={deviationType}
                  onChange={(e) => handleSelectDeviationType(e.target.value)}
                  className="w-full text-xs bg-white border border-rose-200 rounded-lg p-2.5 text-slate-800 font-medium focus:outline-hidden focus:border-rose-500"
                >
                  {activeDeviationTypes.map((item) => (
                    <option key={item.id} value={item.name}>
                      [{item.code}] {item.name} ({item.category} • {item.severityDefault})
                    </option>
                  ))}
                  {activeDeviationTypes.length === 0 && (
                    <option value="Outros desvios operacionais">Outros desvios operacionais</option>
                  )}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Os elementos são mantidos no catálogo de Não Conformidades com histórico auditável.
                </p>
              </div>
            </div>
          )}

          {/* Observations */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Observações do Auditor CQO</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Descreva detalhes da análise técnica realizada..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-md transition-colors cursor-pointer"
            >
              Confirmar e Disparar Governança
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
