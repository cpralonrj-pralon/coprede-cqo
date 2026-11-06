import React from 'react';
import { 
  Home, 
  Radio, 
  Wrench, 
  Share2, 
  FileText, 
  User, 
  Users, 
  RotateCw, 
  ClipboardList, 
  TrendingUp, 
  Lightbulb,
  Award,
  Zap,
  FileSpreadsheet,
  Tags,
  Quote
} from 'lucide-react';

export type NavTab = 
  | 'visao-geral'
  | 'outages'
  | 'acionamentos'
  | 'escalonamentos'
  | 'baixas-offline'
  | 'analistas'
  | 'supervisores'
  | 'reincidencia'
  | 'plano-acao'
  | 'tendencias'
  | 'fcca'
  | 'certificacao'
  | 'automacoes'
  | 'relatorios'
  | 'tipos-nc';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  openActionPlansCount: number;
  deviationTypesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openActionPlansCount,
  deviationTypesCount,
}) => {
  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: Home, category: 'core' },
    { id: 'outages', label: 'Outages', icon: Radio, category: 'process' },
    { id: 'acionamentos', label: 'Acionamentos', icon: Wrench, category: 'process' },
    { id: 'escalonamentos', label: 'Escalonamentos', icon: Share2, category: 'process' },
    { id: 'baixas-offline', label: 'Baixas Offline', icon: FileText, category: 'process' },
    { id: 'analistas', label: 'Analistas', icon: User, category: 'people' },
    { id: 'supervisores', label: 'Supervisores', icon: Users, category: 'people' },
    { id: 'reincidencia', label: 'Reincidência', icon: RotateCw, category: 'quality' },
    { 
      id: 'plano-acao', 
      label: 'Plano de Ação', 
      icon: ClipboardList, 
      category: 'quality',
      badge: openActionPlansCount 
    },
    { id: 'tendencias', label: 'Tendências', icon: TrendingUp, category: 'quality' },
    { id: 'fcca', label: 'FCCA', icon: Lightbulb, category: 'quality' },
    { 
      id: 'certificacao', 
      label: 'Certificação', 
      icon: Award, 
      category: 'saas',
      highlight: true 
    },
    { 
      id: 'automacoes', 
      label: 'Automações & SLAs', 
      icon: Zap, 
      category: 'saas',
      highlight: true 
    },
    { 
      id: 'relatorios', 
      label: 'Relatórios (PDF/XLS)', 
      icon: FileSpreadsheet, 
      category: 'saas',
      highlight: true 
    },
    { 
      id: 'tipos-nc', 
      label: 'Tipos de NC (CRUD)', 
      icon: Tags, 
      category: 'saas',
      badge: deviationTypesCount,
      highlight: true 
    },
  ];

  return (
    <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col shrink-0 min-h-screen select-none border-r border-slate-800/80 shadow-xl">
      
      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Módulos de Gestão
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/30 text-white border-l-4 border-cyan-400 font-semibold shadow-inner'
                  : item.highlight
                  ? 'text-cyan-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}

              {item.highlight && !item.badge && (
                <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-1 py-0.2 rounded font-mono">
                  SaaS
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Motivational Quote - matching image */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 space-y-3">
        <div className="flex items-start gap-2">
          <Quote className="w-5 h-5 text-cyan-400 shrink-0 opacity-70" />
          <p className="text-[11px] italic text-slate-300 leading-snug font-serif">
            "Qualidade não é um ato, é um hábito."
          </p>
        </div>
        <div className="border-t border-slate-800/80 pt-2">
          <p className="text-[10px] font-medium text-cyan-300 tracking-wide uppercase">
            Processos corretos.
          </p>
          <p className="text-[10px] text-slate-400">
            Clientes mais satisfeitos.
          </p>
        </div>
      </div>

    </aside>
  );
};
