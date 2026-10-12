import React from 'react';
import { Home, FileText, Plus, BarChart3, Menu } from 'lucide-react';
import type { TabId } from '../layout/Sidebar';

interface MobileBottomNavProps {
  tabActiva: TabId;
  onCambiarTab: (tab: TabId) => void;
  onAbrirRegistro: () => void;
  onAbrirMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  tabActiva,
  onCambiarTab,
  onAbrirRegistro,
  onAbrirMenu,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Inicio */}
        <button
          type="button"
          onClick={() => onCambiarTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            tabActiva === 'dashboard' ? 'text-segip-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${tabActiva === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>

        {/* Trámites */}
        <button
          type="button"
          onClick={() => onCambiarTab('tramites')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            tabActiva === 'tramites' ? 'text-segip-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className={`w-5 h-5 ${tabActiva === 'tramites' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Trámites</span>
        </button>

        {/* Botón flotante central: (+) Nuevo Trámite */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            type="button"
            onClick={onAbrirRegistro}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#0A3871] to-[#1E6AD1] text-white flex items-center justify-center shadow-lg shadow-blue-900/30 active:scale-95 transition-transform border-4 border-slate-100"
            title="Registrar nuevo trámite"
            aria-label="Registrar nuevo trámite"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </div>

        {/* Reportes */}
        <button
          type="button"
          onClick={() => onCambiarTab('reportes')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            tabActiva === 'reportes' ? 'text-segip-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${tabActiva === 'reportes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Reportes</span>
        </button>

        {/* Más */}
        <button
          type="button"
          onClick={onAbrirMenu}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5">Más</span>
        </button>
      </div>
    </nav>
  );
};
