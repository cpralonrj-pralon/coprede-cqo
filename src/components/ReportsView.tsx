import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  REGIONAIS, 
  CLUSTERS, 
  TECNOLOGIAS, 
  SUPERVISORES, 
  ANALISTAS, 
  PROCESSOS 
} from '../data/mockData';
import type { AuditRecord } from '../types';

interface ReportsViewProps {
  auditRecords: AuditRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ auditRecords }) => {
  const [selectedRegional, setSelectedRegional] = useState('Todas');
  const [selectedCluster, setSelectedCluster] = useState('Todos');
  const [selectedTecnologia, setSelectedTecnologia] = useState('Todas');
  const [selectedSupervisor, setSelectedSupervisor] = useState('Todos');
  const [selectedAnalista, setSelectedAnalista] = useState('Todos');
  const [selectedProcesso, setSelectedProcesso] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records
  const filteredData = auditRecords.filter((rec) => {
    const matchReg = selectedRegional === 'Todas' || rec.regional === selectedRegional;
    const matchClust = selectedCluster === 'Todos' || rec.cluster === selectedCluster;
    const matchTec = selectedTecnologia === 'Todas' || rec.technology === selectedTecnologia;
    const matchSup = selectedSupervisor === 'Todos' || rec.supervisor === selectedSupervisor;
    const matchAna = selectedAnalista === 'Todos' || rec.analyst === selectedAnalista;
    const matchProc = selectedProcesso === 'Todos' || rec.process === selectedProcesso;
    const matchSearch = rec.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        rec.analyst.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (rec.deviationType && rec.deviationType.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchReg && matchClust && matchTec && matchSup && matchAna && matchProc && matchSearch;
  });

  const resetFilters = () => {
    setSelectedRegional('Todas');
    setSelectedCluster('Todos');
    setSelectedTecnologia('Todas');
    setSelectedSupervisor('Todos');
    setSelectedAnalista('Todos');
    setSelectedProcesso('Todos');
    setSearchTerm('');
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const exportRows = filteredData.map((item) => ({
      Protocolo: item.protocol,
      Data: item.date,
      Processo: item.process,
      Regional: item.regional,
      Cluster: item.cluster,
      Tecnologia: item.technology,
      Supervisor: item.supervisor,
      Analista: item.analyst,
      Nota_IQO: `${item.score}%`,
      Status: item.status,
      Tipo_Desvio: item.deviationType || 'Nenhum',
      Observacoes: item.observations,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auditorias CQO');

    XLSX.writeFile(workbook, `Relatorio_CQO_COP_Rede_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF (.pdf)
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    // Header background
    doc.setFillColor(12, 32, 68); // #0c2044
    doc.rect(0, 0, 842, 60, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('COP REDE - CQO | Relatório de Governança e Qualidade Operacional', 30, 36);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 210, 240);
    doc.text(`Filtros: Regional: ${selectedRegional} | Cluster: ${selectedCluster} | Tecnologia: ${selectedTecnologia} | Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 30, 50);

    // Table data
    const tableData = filteredData.slice(0, 40).map((r) => [
      r.protocol,
      r.date,
      r.process,
      r.analyst,
      r.supervisor,
      r.technology,
      `${r.score}%`,
      r.status,
      r.deviationType || '-',
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Protocolo', 'Data', 'Processo', 'Analista', 'Supervisor', 'Tecnologia', 'Nota IQO', 'Status', 'Desvio']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      margin: { left: 30, right: 30 },
    });

    doc.save(`Relatorio_Executivo_CQO_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Header with Export buttons */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Central de Relatórios e Exportação Multidimensional
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extração de dados consolidada com filtros por <strong>Analista</strong>, <strong>Gestor</strong>, 
            <strong> Cluster</strong>, <strong>Tecnologia</strong> e <strong>Regional</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF (.pdf)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MULTIDIMENSIONAL FILTER BAR (Regional, Cluster, Tecnologia, Gestor, Analista)
         ========================================================================= */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filtros Analíticos de Governança
            </h3>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        </div>

        {/* 6 Dimension Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* 1. Regional */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Regional</label>
            <select
              value={selectedRegional}
              onChange={(e) => setSelectedRegional(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden"
            >
              {REGIONAIS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 2. Cluster */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Cluster</label>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden"
            >
              {CLUSTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 3. Tecnologia */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Tecnologia</label>
            <select
              value={selectedTecnologia}
              onChange={(e) => setSelectedTecnologia(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden"
            >
              {TECNOLOGIAS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 4. Gestor / Supervisor */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Gestor / Supervisor</label>
            <select
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden"
            >
              {SUPERVISORES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 5. Analista */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Analista</label>
            <select
              value={selectedAnalista}
              onChange={(e) => setSelectedAnalista(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden"
            >
              {ANALISTAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* 6. Processo */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Processo Auditado</label>
            <select
              value={selectedProcesso}
              onChange={(e) => setSelectedProcesso(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden"
            >
              {PROCESSOS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Search */}
        <div className="pt-2 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por protocolo, analista ou tipo de desvio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Exibindo <strong>{filteredData.length}</strong> de {auditRecords.length} auditorias
          </span>
        </div>
      </div>

      {/* =========================================================================
          DETAILED DATA TABLE
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-3">Protocolo</th>
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Processo</th>
                <th className="py-3 px-3">Regional & Cluster</th>
                <th className="py-3 px-3">Tecnologia</th>
                <th className="py-3 px-3">Analista</th>
                <th className="py-3 px-3">Supervisor</th>
                <th className="py-3 px-3 text-center">Nota IQO</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Desvio Registrado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.slice(0, 30).map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                    {audit.protocol}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{audit.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{audit.process}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {audit.regional} <span className="text-slate-400">({audit.cluster})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{audit.technology}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{audit.analyst}</td>
                  <td className="py-2.5 px-3 text-slate-600">{audit.supervisor}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                    {audit.score}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      audit.status === 'Conforme'
                        ? 'bg-emerald-100 text-emerald-800'
                        : audit.status === 'Não Conforme'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {audit.deviationType ? (
                      <span className="font-medium text-rose-700">{audit.deviationType}</span>
                    ) : (
                      <span className="text-slate-400 italic">Conforme com processo</span>
                    )}
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
