import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  RotateCcw,
  Sliders,
  Search,
  Filter
} from 'lucide-react';
import type { AnalystCertification, CertificationTier } from '../types';

interface CertificationViewProps {
  certifications: AnalystCertification[];
}

export const CertificationView: React.FC<CertificationViewProps> = ({ certifications }) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Simulator state
  const [simScore, setSimScore] = useState<number>(96);
  const [simReincidencias, setSimReincidencias] = useState<number>(0);
  const [simTreinamentos, setSimTreinamentos] = useState<number>(100);
  const [simDiasSemDesvio, setSimDiasSemDesvio] = useState<number>(65);

  // Compute tier dynamically based on the 4 business pillars
  const calculateTier = (
    score: number, 
    reinc: number, 
    train: number, 
    days: number
  ): { tier: CertificationTier; color: string; desc: string } => {
    if (score >= 98 && reinc === 0 && train >= 100 && days >= 90) {
      return { tier: 'Diamante', color: 'from-cyan-500 to-blue-600', desc: 'Excelência Operacional Absoluta' };
    }
    if (score >= 95 && reinc === 0 && train >= 95 && days >= 60) {
      return { tier: 'Ouro', color: 'from-amber-400 to-yellow-600', desc: 'Alto Padrão de Qualidade' };
    }
    if (score >= 90 && reinc <= 2 && train >= 85 && days >= 30) {
      return { tier: 'Prata', color: 'from-slate-300 to-slate-500', desc: 'Aderência Sólida aos Processos' };
    }
    if (score >= 85 && reinc <= 4 && train >= 70 && days >= 15) {
      return { tier: 'Bronze', color: 'from-amber-700 to-amber-900', desc: 'Conformidade Inicial em Evolução' };
    }
    return { tier: 'Bronze', color: 'from-rose-500 to-rose-700', desc: 'Abaixo dos critérios mínimos para certificação' };
  };

  const simResult = calculateTier(simScore, simReincidencias, simTreinamentos, simDiasSemDesvio);

  const filtered = certifications.filter(item => {
    const matchesTier = selectedTierFilter === 'all' || item.tier.toLowerCase() === selectedTierFilter.toLowerCase();
    const matchesSearch = item.analyst.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const tierCounts = {
    diamante: certifications.filter(c => c.tier === 'Diamante').length,
    ouro: certifications.filter(c => c.tier === 'Ouro').length,
    prata: certifications.filter(c => c.tier === 'Prata').length,
    bronze: certifications.filter(c => c.tier === 'Bronze').length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Title & Governance intro */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Programa de Certificação Operacional CQO
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Reconhecimento contínuo e meritocrático da maturidade operacional do COP Rede. 
            A pontuação avalia quatro pilares fundamentais: <strong>Nota CQO (IQO)</strong>, 
            <strong> Reincidência de Desvios</strong>, <strong>Aderência a Treinamentos</strong> e 
            <strong> Tempo Contínuo Sem Desvio</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Total Auditados: {certifications.length} Analistas
          </span>
        </div>
      </div>

      {/* =========================================================================
          TIER CRITERIA CARDS (Bronze, Prata, Ouro, Diamante)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* BRONZE */}
        <div className="bg-white rounded-xl border border-amber-900/20 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-black tracking-wide">BRONZE</h3>
              </div>
              <span className="text-xs font-bold bg-amber-950/60 text-amber-200 px-2 py-0.5 rounded">
                {tierCounts.bronze} analistas
              </span>
            </div>
            <p className="text-[11px] text-amber-200 mt-1">Conformidade Inicial</p>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nota CQO Mínima:</span>
              <span className="font-bold text-slate-800">≥ 85,0%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Reincidência (30d):</span>
              <span className="font-bold text-slate-800">≤ 4 desvios</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Treinamentos:</span>
              <span className="font-bold text-slate-800">≥ 70%</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Tempo sem Desvio:</span>
              <span className="font-bold text-slate-800">≥ 15 dias</span>
            </div>
          </div>
        </div>

        {/* PRATA */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="bg-gradient-to-r from-slate-500 to-slate-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-200" />
                <h3 className="text-base font-black tracking-wide">PRATA</h3>
              </div>
              <span className="text-xs font-bold bg-slate-900/60 text-slate-200 px-2 py-0.5 rounded">
                {tierCounts.prata} analistas
              </span>
            </div>
            <p className="text-[11px] text-slate-200 mt-1">Aderência Sólida</p>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nota CQO Mínima:</span>
              <span className="font-bold text-slate-800">≥ 90,0%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Reincidência (30d):</span>
              <span className="font-bold text-slate-800">≤ 2 desvios</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Treinamentos:</span>
              <span className="font-bold text-slate-800">≥ 85%</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Tempo sem Desvio:</span>
              <span className="font-bold text-slate-800">≥ 30 dias</span>
            </div>
          </div>
        </div>

        {/* OURO */}
        <div className="bg-white rounded-xl border border-amber-400 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-100" />
                <h3 className="text-base font-black tracking-wide">OURO</h3>
              </div>
              <span className="text-xs font-bold bg-amber-950/60 text-yellow-200 px-2 py-0.5 rounded">
                {tierCounts.ouro} analistas
              </span>
            </div>
            <p className="text-[11px] text-yellow-100 mt-1">Alta Performance</p>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nota CQO Mínima:</span>
              <span className="font-bold text-slate-800">≥ 95,0%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Reincidência (30d):</span>
              <span className="font-bold text-emerald-700">0 desvios</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Treinamentos:</span>
              <span className="font-bold text-slate-800">100%</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Tempo sem Desvio:</span>
              <span className="font-bold text-slate-800">≥ 60 dias</span>
            </div>
          </div>
        </div>

        {/* DIAMANTE */}
        <div className="bg-white rounded-xl border border-cyan-400 shadow-xs overflow-hidden flex flex-col justify-between ring-2 ring-cyan-500/20">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <h3 className="text-base font-black tracking-wide">DIAMANTE</h3>
              </div>
              <span className="text-xs font-bold bg-cyan-950/70 text-cyan-200 px-2 py-0.5 rounded">
                {tierCounts.diamante} analista
              </span>
            </div>
            <p className="text-[11px] text-cyan-200 mt-1">Excelência Operacional COP</p>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nota CQO Mínima:</span>
              <span className="font-bold text-slate-800">≥ 98,0%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Reincidência (30d):</span>
              <span className="font-bold text-emerald-700">0 desvios</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Treinamentos:</span>
              <span className="font-bold text-slate-800">100% + Multiplicador</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Tempo sem Desvio:</span>
              <span className="font-bold text-cyan-700 font-black">≥ 90 dias</span>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SIMULADOR INTERATIVO DE CERTIFICAÇÃO CQO
         ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-xl p-5 border border-slate-700 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Simulador Interativo de Elegibilidade de Certificação
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Ajuste os 4 pilares em tempo real para simular a certificação automática
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          
          {/* Slider 1: Nota CQO */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Nota CQO (IQO):</span>
              <span className="font-bold text-cyan-400">{simScore.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="70" 
              max="100" 
              step="0.5"
              value={simScore}
              onChange={(e) => setSimScore(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 2: Reincidência */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Reincidência (últimos 30d):</span>
              <span className="font-bold text-cyan-400">{simReincidencias} ocorrências</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="6" 
              step="1"
              value={simReincidencias}
              onChange={(e) => setSimReincidencias(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 3: Treinamentos */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Treinamentos Concluídos:</span>
              <span className="font-bold text-cyan-400">{simTreinamentos}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="100" 
              step="5"
              value={simTreinamentos}
              onChange={(e) => setSimTreinamentos(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 4: Dias sem desvio */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Tempo sem Desvio:</span>
              <span className="font-bold text-cyan-400">{simDiasSemDesvio} dias</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="150" 
              step="5"
              value={simDiasSemDesvio}
              onChange={(e) => setSimDiasSemDesvio(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

        </div>

        {/* Simulator Output Box */}
        <div className="mt-5 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${simResult.color} text-white font-black text-sm uppercase tracking-wider shadow-md`}>
              Nível Obtido: {simResult.tier}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{simResult.desc}</p>
              <p className="text-[10px] text-slate-400">Atende integralmente a política de governança do COP Rede.</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setSimScore(99);
              setSimReincidencias(0);
              setSimTreinamentos(100);
              setSimDiasSemDesvio(110);
            }}
            className="text-xs bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-700/60 transition-colors"
          >
            Preencher Perfil Diamante
          </button>
        </div>
      </div>

      {/* =========================================================================
          QUADRO DE ANALISTAS CERTIFICADOS
         ========================================================================= */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Quadro de Analistas e Selos Vigentes
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Buscar analista ou supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-56 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Filter Tier */}
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-hidden"
            >
              <option value="all">Todos os Níveis</option>
              <option value="Diamante">Apenas Diamante</option>
              <option value="Ouro">Apenas Ouro</option>
              <option value="Prata">Apenas Prata</option>
              <option value="Bronze">Apenas Bronze</option>
            </select>
          </div>
        </div>

        {/* Table of Certified Analysts */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold bg-slate-50">
                <th className="py-2.5 px-3">Analista & Squad</th>
                <th className="py-2.5 px-3 text-center">Nível Atual</th>
                <th className="py-2.5 px-3 text-center">Nota CQO (IQO)</th>
                <th className="py-2.5 px-3 text-center">Reincidência (30d)</th>
                <th className="py-2.5 px-3 text-center">Treinamentos</th>
                <th className="py-2.5 px-3 text-center">Dias Sem Desvio</th>
                <th className="py-2.5 px-3 text-center">Auditorias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Analyst info */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${item.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
                        {item.analyst.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{item.analyst}</div>
                        <div className="text-[10px] text-slate-500">
                          {item.supervisor} • {item.technology} ({item.regional})
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tier Badge */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      item.tier === 'Diamante' 
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' 
                        : item.tier === 'Ouro'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : item.tier === 'Prata'
                        ? 'bg-slate-100 text-slate-800 border border-slate-300'
                        : 'bg-orange-100 text-amber-900 border border-amber-200'
                    }`}>
                      {item.tier === 'Diamante' && <Sparkles className="w-3.5 h-3.5 text-cyan-600" />}
                      {item.tier === 'Ouro' && <Trophy className="w-3.5 h-3.5 text-amber-600" />}
                      {item.tier === 'Prata' && <Award className="w-3.5 h-3.5 text-slate-600" />}
                      {item.tier === 'Bronze' && <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />}
                      {item.tier}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.iqoScore >= 95 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700'}`}>
                      {item.iqoScore.toFixed(1)}%
                    </span>
                  </td>

                  {/* Reincidencias */}
                  <td className="py-3 px-3 text-center">
                    <span className={`font-bold ${item.reincidencias === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.reincidencias} {item.reincidencias === 1 ? 'vez' : 'vezes'}
                    </span>
                  </td>

                  {/* Treinamentos */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium text-slate-700">{item.trainingsCompletedPct}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${item.trainingsCompletedPct >= 95 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${item.trainingsCompletedPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Dias sem desvio */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {item.daysWithoutDeviation} dias
                    </span>
                  </td>

                  {/* Total Audits */}
                  <td className="py-3 px-3 text-center text-slate-600 font-medium">
                    {item.totalAudits}
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
