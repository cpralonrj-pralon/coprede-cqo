import React from 'react';
import type { AuditRecord } from '../types';

interface ProcessDetailViewProps {
  title: string;
  category: string;
  description: string;
  records: AuditRecord[];
  onOpenNewAudit: () => void;
}

export const ProcessDetailView: React.FC<ProcessDetailViewProps> = ({
  title,
  category,
  description,
  records,
  onOpenNewAudit,
}) => {
  const conformes = records.filter(r => r.status === 'Conforme').length;
  const naoConformes = records.filter(r => r.status === 'Não Conforme').length;
  const desviosGraves = records.filter(r => r.status === 'Desvio Grave').length;
  const iqo = records.length > 0 
    ? (records.reduce((acc, curr) => acc + curr.score, 0) / records.length).toFixed(1)
    : '96.0';

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
            {category}
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1">
            Painel Operacional: {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {description}
          </p>
        </div>

        <button
          onClick={onOpenNewAudit}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
        >
          + Auditar {title}
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">IQO Específico</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{iqo}%</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">Meta: ≥ 95%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Auditado</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{records.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Amostras validadas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Em Conformidade</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{conformes}</div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">
            {((conformes / (records.length || 1)) * 100).toFixed(0)}% de aderência
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Desvios & NC</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{naoConformes + desviosGraves}</div>
          <p className="text-[10px] text-rose-600 font-semibold mt-1">
            {desviosGraves} desvios graves
          </p>
        </div>

      </div>

      {/* Records list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Auditorias Registradas no Processo ({records.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Protocolo</th>
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Analista</th>
                <th className="py-2.5 px-3">Supervisor</th>
                <th className="py-2.5 px-3">Regional / Cluster</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Apontamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.slice(0, 15).map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{rec.protocol}</td>
                  <td className="py-2.5 px-3 text-slate-600">{rec.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{rec.analyst}</td>
                  <td className="py-2.5 px-3 text-slate-600">{rec.supervisor}</td>
                  <td className="py-2.5 px-3 text-slate-600">{rec.regional}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'Conforme'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'Não Conforme'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {rec.deviationType || 'Conforme com as diretrizes do processo.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
