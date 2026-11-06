import React, { useState } from 'react';
import { 
  Calendar, 
  Bell, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import type { NotificationAlert } from '../types';

interface HeaderProps {
  notifications: NotificationAlert[];
  onOpenNewAudit: () => void;
  selectedPeriod: string;
  onChangePeriod: (period: string) => void;
  onNavigateToAutomations: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onOpenNewAudit,
  selectedPeriod,
  onChangePeriod,
  onNavigateToAutomations,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-2.5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Titles */}
        <div className="flex items-center gap-6">
          {/* Logo COP REDE */}
          <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md shadow-blue-950/20">
              <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-slate-900 text-lg leading-none">COP REDE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase tracking-tight">SaaS Pro</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                CONECTIVIDADE QUE APROXIMA
              </p>
            </div>
          </div>

          {/* Central Title */}
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              CQO – Central de Qualidade Operacional
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Processos hoje. <span className="text-blue-700 font-semibold">Qualidade sempre.</span>
            </p>
          </div>

          {/* Cursive quote */}
          <div className="hidden xl:block pl-6 border-l border-slate-100">
            <span className="text-base italic font-serif text-blue-900 tracking-tight block">
              "Mais que auditoria, evolução da operação."
            </span>
          </div>
        </div>

        {/* Right side controls: Period selector, Notifications, Action Button */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          
          {/* Period Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs shadow-xs">
            <div className="flex items-center gap-2 px-2.5 py-1 text-slate-600 font-semibold">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Período</span>
            </div>
            <div className="flex items-center bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-medium">
              <span>01/06/2025</span>
              <span className="mx-2 text-slate-400">→</span>
              <span>30/06/2025</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => onChangePeriod(e.target.value)}
              className="bg-transparent text-slate-600 text-xs font-medium pl-1 pr-2 py-1 outline-hidden cursor-pointer"
            >
              <option value="Jun/2025">Junho/2025 (Atual)</option>
              <option value="Mai/2025">Maio/2025</option>
              <option value="Abr/2025">Abril/2025</option>
              <option value="Q2/2025">2º Trimestre / 2025</option>
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white"
              title="Notificações e Escalonamentos"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">Alertas e Escalonamentos</span>
                    <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} novos
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateToAutomations();
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Ver Central
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        {notif.severity === 'escalation' && <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                        {notif.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        {notif.severity === 'info' && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />}
                        {notif.severity === 'critical' && <ShieldAlert className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />}
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{notif.title}</p>
                          <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                            <span>Destinatário: {notif.recipient}</span>
                            <span>{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* New Audit CTA */}
          <button
            onClick={onOpenNewAudit}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-md shadow-blue-700/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Auditoria</span>
          </button>
        </div>

      </div>
    </header>
  );
};
