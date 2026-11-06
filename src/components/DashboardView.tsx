import React from 'react';
import { 
  Target, 
  Search, 
  AlertTriangle, 
  AlertOctagon, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Minus
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import type { DeviationTypeItem, AuditRecord } from '../types';
import {
  INITIAL_KPIS,
  EVOLUCAO_IQO,
  AUDITORIAS_POR_PROCESSO,
  RESULTADO_AUDITORIAS,
  TOP_NAO_CONFORMIDADES,
  RANKING_SUPERVISORES,
  TOP_ANALISTAS_NC,
  REINCIDENCIA_ANALISTAS,
  STATUS_PLANO_ACAO,
  MATRIZ_QUALIDADE
} from '../data/mockData';

interface DashboardViewProps {
  onNavigateTab: (tab: any) => void;
  deviationTypes?: DeviationTypeItem[];
  auditRecords?: AuditRecord[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigateTab,
  deviationTypes = [],
  auditRecords = []
}) => {
  // Cálculo dinâmico do Top Não Conformidades combinando histórico base e auditorias cadastradas
  const computeTopNC = () => {
    if (!auditRecords || auditRecords.length === 0) return TOP_NAO_CONFORMIDADES;

    // Conta auditorias não conformes por tipo
    const countsMap: Record<string, number> = {};
    let totalNC = 0;

    auditRecords.forEach(audit => {
      if (audit.status !== 'Conforme' && audit.deviationType) {
        countsMap[audit.deviationType] = (countsMap[audit.deviationType] || 0) + 1;
        totalNC++;
      }
    });

    // Se temos histórico, podemos mesclar ou exibir os computados
    if (totalNC > 0) {
      const sorted = Object.entries(countsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tipo, count]) => ({
          tipo,
          count,
          pct: Math.round((count / totalNC) * 100),
        }));
      
      if (sorted.length >= 3) {
        return sorted;
      }
    }

    return TOP_NAO_CONFORMIDADES;
  };

  const currentTopNC = computeTopNC();
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-[1700px] mx-auto">
      
      {/* =========================================================================
          TOP 6 KPI CARDS (Matching Reference Layout & Header Color Blocks)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* KPI 1: IQO */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#059669] text-white px-3.5 py-2 flex items-center gap-2">
            <Target className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <span className="text-xs font-bold block">IQO</span>
              <span className="text-[10px] text-emerald-100 block">Índice de Qualidade Operacional</span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {INITIAL_KPIS.iqo.toLocaleString('pt-BR')}%
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500 font-medium">Meta: ≥ 95%</span>
              <span className="text-emerald-700 font-bold flex items-center">
                ▲ +{INITIAL_KPIS.iqoDelta.toLocaleString('pt-BR')}%
              </span>
            </div>
            <p className="text-[9px] text-slate-400 text-right mt-0.5">vs. mês anterior</p>
          </div>
        </div>

        {/* KPI 2: Auditorias Realizadas */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#0284c7] text-white px-3.5 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <span className="text-xs font-bold block">Auditorias Realizadas</span>
              <span className="text-[10px] text-sky-100 block">Amostragem ativa</span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {INITIAL_KPIS.auditoriasRealizadas.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                ▲ +{INITIAL_KPIS.auditoriasDelta}%
              </span>
            </div>
            <p className="text-[9px] text-slate-400 text-right mt-0.5">vs. mês anterior</p>
          </div>
        </div>

        {/* KPI 3: Não Conformidades */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#f59e0b] text-white px-3.5 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <span className="text-xs font-bold block">Não Conformidades</span>
              <span className="text-[10px] text-amber-100 block">Total de apontamentos</span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {INITIAL_KPIS.naoConformidades}
            </div>
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                ▼ {INITIAL_KPIS.naoConformidadesDelta}%
              </span>
            </div>
            <p className="text-[9px] text-slate-400 text-right mt-0.5">vs. mês anterior</p>
          </div>
        </div>

        {/* KPI 4: Desvios Graves */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#dc2626] text-white px-3.5 py-2 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <span className="text-xs font-bold block">Desvios Graves</span>
              <span className="text-[10px] text-rose-100 block">Risco operacional crítico</span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {INITIAL_KPIS.desviosGraves}
            </div>
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                ▼ {INITIAL_KPIS.desviosGravesDelta}%
              </span>
            </div>
            <p className="text-[9px] text-slate-400 text-right mt-0.5">vs. mês anterior</p>
          </div>
        </div>

        {/* KPI 5: Reincidências */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#7c3aed] text-white px-3.5 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <span className="text-xs font-bold block">Reincidências</span>
              <span className="text-[10px] text-purple-100 block">Desvios repetidos</span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {INITIAL_KPIS.reincidencias}
            </div>
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                ▼ {INITIAL_KPIS.reincidenciasDelta}%
              </span>
            </div>
            <p className="text-[9px] text-slate-400 text-right mt-0.5">vs. mês anterior</p>
          </div>
        </div>

        {/* KPI 6: IGP */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#1e3a8a] text-white px-3.5 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <span className="text-xs font-bold block">IGP</span>
              <span className="text-[10px] text-blue-100 block">Feedback no prazo</span>
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {INITIAL_KPIS.igpFeedbackNoPrazo}%
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500 font-medium">Meta: 100%</span>
              <span className="text-rose-600 font-bold flex items-center">
                ▼ {INITIAL_KPIS.igpDelta}%
              </span>
            </div>
            <p className="text-[9px] text-slate-400 text-right mt-0.5">vs. mês anterior</p>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 1: Evolução IQO | Auditorias por Processo | Resultado Auditorias
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Evolução do IQO (últimos 6 meses) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Evolução do IQO (últimos 6 meses)
            </h3>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                <span className="w-2.5 h-0.5 bg-blue-600"></span> IQO
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2.5 h-0.5 bg-emerald-500 border-b border-dashed border-emerald-600"></span> Meta (95%)
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EVOLUCAO_IQO} margin={{ top: 18, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'IQO']} 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <ReferenceLine y={95} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
                <Line 
                  type="monotone" 
                  dataKey="iqo" 
                  stroke="#0284c7" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#0284c7', strokeWidth: 1.5, stroke: '#fff' }}
                  label={{ 
                    position: 'top', 
                    fontSize: 9, 
                    fill: '#1e293b', 
                    fontWeight: 700, 
                    formatter: (v: any) => `${v}%` 
                  }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auditorias por Processo (Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Auditorias por Processo
          </h3>

          <div className="flex-1 flex flex-row items-center justify-between">
            {/* Donut */}
            <div className="relative w-48 h-48 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AUDITORIAS_POR_PROCESSO}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {AUDITORIAS_POR_PROCESSO.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any, name: any) => [`${val} audits`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-slate-800 leading-none">1.245</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Processos</span>
              </div>
            </div>

            {/* Legend list matching screenshot */}
            <div className="space-y-1.5 pl-2 text-xs">
              {AUDITORIAS_POR_PROCESSO.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 font-medium text-[11px]">{item.name}</span>
                  </div>
                  <div className="text-right font-semibold text-slate-800 text-[11px]">
                    {item.value} <span className="text-slate-400 font-normal">({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resultado das Auditorias (Barras Conforme vs Não Conforme) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Resultado das Auditorias
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 bg-[#16a34a] rounded-xs"></span> Conforme
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 bg-[#dc2626] rounded-xs"></span> Não Conforme
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESULTADO_AUDITORIAS} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="processo" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                <YAxis domain={[0, 600]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Bar 
                  dataKey="conforme" 
                  fill="#16a34a" 
                  radius={[3, 3, 0, 0]}
                  label={{ position: 'top', fontSize: 9, fill: '#15803d', fontWeight: 700 }}
                />
                <Bar 
                  dataKey="naoConforme" 
                  fill="#dc2626" 
                  radius={[3, 3, 0, 0]}
                  label={{ position: 'top', fontSize: 9, fill: '#b91c1c', fontWeight: 700 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 2: Top 5 Não Conformidades | Ranking Supervisores | Top 5 Analistas NC
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Top 5 Tipos de Não Conformidades (Horizontal Bars) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Top 5 Tipos de Não Conformidades
            </h3>
            <button
              onClick={() => onNavigateTab('tipos-nc')}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              Gerenciar Tipos
            </button>
          </div>

          <div className="space-y-2.5">
            {currentTopNC.map((item) => (
              <div key={item.tipo} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 font-medium truncate max-w-[200px]" title={item.tipo}>
                    {item.tipo}
                  </span>
                  <span className="text-rose-600 font-bold ml-2 shrink-0">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-rose-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, item.pct * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking de Supervisores (IQO) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ranking de Supervisores (IQO)
            </h3>
            <button 
              onClick={() => onNavigateTab('supervisores')}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              Ver todos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-1.5 px-2">#</th>
                  <th className="py-1.5 px-2">Supervisor</th>
                  <th className="py-1.5 px-2 text-center">Auditorias</th>
                  <th className="py-1.5 px-2 text-right">IQO</th>
                  <th className="py-1.5 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RANKING_SUPERVISORES.map((sup) => (
                  <tr key={sup.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 font-bold text-slate-500">{sup.rank}</td>
                    <td className="py-2 px-2 font-semibold text-slate-800">{sup.supervisor}</td>
                    <td className="py-2 px-2 text-center text-slate-600">{sup.auditorias}</td>
                    <td className="py-2 px-2 text-right font-black text-slate-800">{sup.iqo.toLocaleString('pt-BR')}%</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${sup.status === 'green' ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500 shadow-xs shadow-amber-500/50'}`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Analistas com Mais Não Conformidades */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Top 5 Analistas com Mais Não Conformidades
            </h3>
            <button 
              onClick={() => onNavigateTab('analistas')}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              Ver todos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-1.5 px-2">#</th>
                  <th className="py-1.5 px-2">Analista</th>
                  <th className="py-1.5 px-2 text-center">NC</th>
                  <th className="py-1.5 px-2 text-right">IQO</th>
                  <th className="py-1.5 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TOP_ANALISTAS_NC.map((ana) => (
                  <tr key={ana.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 font-bold text-slate-500">{ana.rank}</td>
                    <td className="py-2 px-2 font-semibold text-slate-800">{ana.analista}</td>
                    <td className="py-2 px-2 text-center font-bold text-rose-600">{ana.nc}</td>
                    <td className="py-2 px-2 text-right font-black text-slate-800">{ana.iqo.toLocaleString('pt-BR')}%</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${ana.status === 'red' ? 'bg-rose-600 shadow-xs shadow-rose-600/50' : 'bg-amber-500 shadow-xs shadow-amber-500/50'}`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 3: Reincidência por Analista | Status Plano de Ação | Matriz de Qualidade
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Reincidência por Analista */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Reincidência por Analista
          </h3>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REINCIDENCIA_ANALISTAS} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="ocorrencia" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                <YAxis domain={[0, 30]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(val: any) => [`${val} analistas`, 'Total']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Bar 
                  dataKey="analistas" 
                  radius={[4, 4, 0, 0]}
                  label={{ position: 'top', fontSize: 10, fill: '#1e293b', fontWeight: 700 }}
                >
                  {REINCIDENCIA_ANALISTAS.map((entry, idx) => (
                    <Cell key={`reinc-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status do Plano de Ação (Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Status do Plano de Ação
            </h3>
            <button
              onClick={() => onNavigateTab('plano-acao')}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              Acessar Tratativas
            </button>
          </div>

          <div className="flex-1 flex flex-row items-center justify-between">
            <div className="relative w-44 h-44 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_PLANO_ACAO}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {STATUS_PLANO_ACAO.map((entry, index) => (
                      <Cell key={`cell-pa-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-slate-800 leading-none">26</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Ações</span>
              </div>
            </div>

            <div className="space-y-2 pl-2 text-xs">
              {STATUS_PLANO_ACAO.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 font-medium text-[11px]">{item.name}</span>
                  </div>
                  <div className="text-right font-bold text-slate-800 text-[11px]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matriz de Qualidade por Processo (Últimos 3 meses) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Matriz de Qualidade por Processo (Últimos 3 meses)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-2">Processo</th>
                  <th className="py-2 px-2 text-center">Abr/25</th>
                  <th className="py-2 px-2 text-center">Mai/25</th>
                  <th className="py-2 px-2 text-center">Jun/25</th>
                  <th className="py-2 px-2 text-center">Tendência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MATRIZ_QUALIDADE.map((row) => (
                  <tr key={row.processo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 font-semibold text-slate-700">{row.processo}</td>
                    
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        row.abr === 'green' ? 'bg-emerald-500' : row.abr === 'amber' ? 'bg-amber-500' : 'bg-rose-600'
                      }`}></span>
                    </td>

                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        row.mai === 'green' ? 'bg-emerald-500' : row.mai === 'amber' ? 'bg-amber-500' : 'bg-rose-600'
                      }`}></span>
                    </td>

                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        row.jun === 'green' ? 'bg-emerald-500' : row.jun === 'amber' ? 'bg-amber-500' : 'bg-rose-600'
                      }`}></span>
                    </td>

                    <td className="py-2 px-2 text-center font-bold">
                      {row.tendencia === 'up' && <span className="text-emerald-600 text-sm">↗</span>}
                      {row.tendencia === 'flat' && <span className="text-slate-400 text-sm">→</span>}
                      {row.tendencia === 'down' && <span className="text-rose-600 text-sm">↘</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
