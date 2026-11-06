import React from 'react';
import { BarChart3, Users, Settings, Handshake } from 'lucide-react';

export const FooterBanner: React.FC = () => {
  return (
    <footer className="bg-[#0c2044] text-white border-t border-slate-800 px-6 py-3 select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left tagline */}
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs md:text-sm font-semibold tracking-wide text-slate-100">
            Qualidade gera confiança, processos geram resultados.
          </span>
        </div>

        {/* Right 3 pillars */}
        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">Equipe mais preparada</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">Operação mais eficiente</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
            <Handshake className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">Clientes mais satisfeitos</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
