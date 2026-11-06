import React, { useState } from 'react';
import { 
  Tags, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Sliders,
  Scale,
  Layers,
  Info
} from 'lucide-react';
import type { 
  DeviationTypeItem, 
  CreateDeviationTypeInput, 
  UpdateDeviationTypeInput, 
  ProcessType,
  AuditRecord
} from '../types';
import { PROCESSOS } from '../data/mockData';

interface DeviationTypesViewProps {
  deviationTypes: DeviationTypeItem[];
  auditRecords: AuditRecord[];
  onAddDeviationType: (item: CreateDeviationTypeInput) => Promise<void>;
  onUpdateDeviationType: (id: string, item: UpdateDeviationTypeInput) => Promise<void>;
  onDeleteDeviationType: (id: string) => Promise<void>;
  onToggleActive: (id: string) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

export const DeviationTypesView: React.FC<DeviationTypesViewProps> = ({
  deviationTypes,
  auditRecords,
  onAddDeviationType,
  onUpdateDeviationType,
  onDeleteDeviationType,
  onToggleActive,
  onResetDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [severityFilter, setSeverityFilter] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeviationTypeItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<DeviationTypeItem | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProcessType | 'Geral'>('Geral');
  const [severityDefault, setSeverityDefault] = useState<'Não Conforme' | 'Desvio Grave'>('Não Conforme');
  const [weight, setWeight] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setCode(`NC-${Math.floor(10 + Math.random() * 89)}`);
    setName('');
    setCategory('Geral');
    setSeverityDefault('Não Conforme');
    setWeight(20);
    setDescription('');
    setActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: DeviationTypeItem) => {
    setEditingItem(item);
    setCode(item.code);
    setName(item.name);
    setCategory(item.category);
    setSeverityDefault(item.severityDefault);
    setWeight(item.weight);
    setDescription(item.description);
    setActive(item.active);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!code.trim() || !name.trim()) {
      setFormError('Código e Título do tipo de não conformidade são obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await onUpdateDeviationType(editingItem.id, {
          code,
          name,
          category,
          severityDefault,
          weight: Number(weight),
          description,
          active,
        });
      } else {
        await onAddDeviationType({
          code,
          name,
          category,
          severityDefault,
          weight: Number(weight),
          description,
          active,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar o tipo de não conformidade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter items
  const filteredItems = deviationTypes.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'Todos' || item.category === categoryFilter;
    const matchesSeverity = severityFilter === 'Todas' || item.severityDefault === severityFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && item.active) || 
      (statusFilter === 'inactive' && !item.active);

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  // Calculate stats
  const totalActive = deviationTypes.filter(d => d.active).length;
  const totalDesviosGraves = deviationTypes.filter(d => d.severityDefault === 'Desvio Grave').length;
  const avgWeight = deviationTypes.length > 0 
    ? (deviationTypes.reduce((acc, curr) => acc + curr.weight, 0) / deviationTypes.length).toFixed(0)
    : 0;

  // Check how many audits use this deviation type
  const countAuditsUsing = (typeName: string) => {
    return auditRecords.filter(a => a.deviationType === typeName).length;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Tags className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Catálogo de Tipos e Elementos de Não Conformidade
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gestão centralizada de parâmetros de auditoria CQO. Inclusão, alteração e exclusão preparadas para sincronização com banco de dados corporativo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetDefaults}
            title="Restaurar catálogo inicial padrão"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-blue-700/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Tipo de NC</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Deviation Management */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Tipos Cadastrados</span>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{deviationTypes.length}</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">{totalActive} ativos em produção</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Classificação Grave</span>
            <div className="text-2xl font-black text-rose-600 mt-0.5">{totalDesviosGraves}</div>
            <p className="text-[10px] text-slate-400 mt-1">Disparam gatilho crítico imediato</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Impacto Médio (Peso)</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{avgWeight}%</div>
            <p className="text-[10px] text-slate-400 mt-1">Desconto na nota CQO</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Auditadas no Período</span>
            <div className="text-2xl font-black text-slate-800 mt-0.5">
              {auditRecords.filter(a => a.status !== 'Conforme').length}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Auditorias com apontamentos</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código, nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Categoria */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
            >
              <option value="Todos">Todas as Categorias</option>
              <option value="Geral">Geral (Transversal)</option>
              {PROCESSOS.filter(p => p !== 'Todos').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Severidade */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
            >
              <option value="Todas">Todas as Severidades</option>
              <option value="Não Conforme">Apenas Não Conforme</option>
              <option value="Desvio Grave">Apenas Desvio Grave</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Apenas Ativos</option>
              <option value="inactive">Apenas Inativos</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span>Mostrando <strong>{filteredItems.length}</strong> de {deviationTypes.length} elementos cadastrados</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            Alterações refletem instantaneamente no formulário de Nova Auditoria e nos Relatórios.
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Elemento de Não Conformidade</th>
                <th className="py-3 px-4">Categoria / Processo</th>
                <th className="py-3 px-4 text-center">Severidade Padrão</th>
                <th className="py-3 px-4 text-center">Impacto (Peso)</th>
                <th className="py-3 px-4 text-center">Auditorias Vinculadas</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    Nenhum tipo de não conformidade encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const auditsCount = countAuditsUsing(item.name);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Código */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {item.code}
                      </td>

                      {/* Nome e Descrição */}
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-bold text-slate-800 text-xs">{item.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1" title={item.description}>
                          {item.description || 'Sem descrição cadastrada.'}
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      {/* Severidade */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.severityDefault === 'Desvio Grave'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {item.severityDefault === 'Desvio Grave' ? (
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                          )}
                          {item.severityDefault}
                        </span>
                      </td>

                      {/* Peso */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-700">{item.weight}%</span>
                      </td>

                      {/* Auditorias Vinculadas */}
                      <td className="py-3 px-4 text-center">
                        {auditsCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {auditsCount} ocorrência{auditsCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Nenhuma</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleActive(item.id)}
                          title={item.active ? 'Clique para inativar' : 'Clique para ativar'}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            item.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-600' : 'bg-slate-500'}`}></span>
                          {item.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Alterar elemento de não conformidade"
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmItem(item)}
                            title="Excluir elemento de não conformidade"
                            className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL DE INCLUSÃO / ALTERAÇÃO DE TIPO DE NÃO CONFORMIDADE
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in duration-200 my-8">
            
            {/* Modal Header */}
            <div className="bg-[#0c2044] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Tags className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    {editingItem ? 'Alterar Elemento de Não Conformidade' : 'Incluir Novo Elemento de Não Conformidade'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Defina o código, severidade e impacto no cálculo CQO
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Código */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Código Corporativo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: NC-ESC-01"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Identificador padronizado no banco</span>
                </div>

                {/* Impacto / Peso */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Peso de Impacto (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Penalidade na nota da auditoria</span>
                </div>

              </div>

              {/* Título / Nome do Elemento */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Título do Tipo / Elemento de Desvio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Escalonamento incorreto sem validação"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Categoria / Processo */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Processo / Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
                  >
                    <option value="Geral">Geral (Todos os Processos)</option>
                    {PROCESSOS.filter(p => p !== 'Todos').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Severidade Padrão */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Severidade Padrão
                  </label>
                  <select
                    value={severityDefault}
                    onChange={(e) => setSeverityDefault(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
                  >
                    <option value="Não Conforme">Não Conforme (Moderado)</option>
                    <option value="Desvio Grave">Desvio Grave (Crítico)</option>
                  </select>
                </div>

              </div>

              {/* Descrição do Critério */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Critério de Auditoria & Descrição Técnica
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva quando este desvio deve ser apontado pelo auditor..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Checkbox Ativo */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="activeCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Elemento Ativo para Seleção em Novas Auditorias
                </label>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Salvando...' : editingItem ? 'Salvar Alterações' : 'Cadastrar Elemento'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
         ========================================================================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in duration-200 space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirmar Exclusão de Elemento</h3>
                <p className="text-xs text-slate-500">Operação de exclusão no catálogo CQO</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-400 font-medium">Elemento:</span>{' '}
                <strong className="text-slate-800">{deleteConfirmItem.name}</strong> ({deleteConfirmItem.code})
              </div>
              <div>
                <span className="text-slate-400 font-medium">Categoria:</span>{' '}
                <span className="text-slate-700">{deleteConfirmItem.category}</span>
              </div>
            </div>

            {countAuditsUsing(deleteConfirmItem.name) > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Atenção à Integridade do Banco:</strong> Existem{' '}
                  <span className="font-bold underline">{countAuditsUsing(deleteConfirmItem.name)} auditoria(s)</span>{' '}
                  registradas com este tipo de não conformidade. Se você preferir manter o histórico sem permitir novas seleções, considere apenas <strong>inativar</strong> o elemento.
                </div>
              </div>
            )}

            <p className="text-xs text-slate-600">
              Tem certeza de que deseja excluir permanentemente este elemento de não conformidade?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteDeviationType(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Sim, Excluir Elemento
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
