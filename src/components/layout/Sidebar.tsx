import React from 'react';
import { Home, FilePlus, ListFilter, BarChart3, Users, Settings } from 'lucide-react';
import { BoliviaMap } from '../../assets/BoliviaMap';

export type TabId = 'dashboard' | 'registro' | 'tramites' | 'reportes' | 'usuarios' | 'configuracion';

interface SidebarProps {
  tabActiva: TabId;
  onCambiarTab: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tabActiva, onCambiarTab }) => {
  const menuItems = [
    { id: 'dashboard' as TabId, label: 'Panel principal', icon: Home },
    { id: 'registro' as TabId, label: 'Registrar trámite', icon: FilePlus },
    { id: 'tramites' as TabId, label: 'Listado de trámites', icon: ListFilter },
    { id: 'reportes' as TabId, label: 'Reportes', icon: BarChart3 },
    { id: 'usuarios' as TabId, label: 'Usuarios', icon: Users },
    { id: 'configuracion' as TabId, label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A3871] text-white flex flex-col justify-between shrink-0 select-none shadow-xl border-r border-blue-900/50 min-h-screen">
      {/* Sección superior de navegación */}
      <div className="pt-6">
        {/* Espacio para la marca o indicador del menú */}
        <div className="px-6 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
            Navegación del Sistema
          </span>
        </div>

        <nav className="space-y-1.5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const esActivo = tabActiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onCambiarTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  esActivo
                    ? 'bg-blue-600/90 text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${esActivo ? 'text-white' : 'text-blue-200'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sección inferior con silueta de Bolivia e identidad SEGIP */}
      <div className="p-6 relative overflow-hidden">
        {/* Silueta de Bolivia de fondo */}
        <div className="relative flex flex-col items-start pt-4 border-t border-blue-800/60">
          <div className="mb-2 text-blue-200/40">
            <BoliviaMap className="w-24 h-24" />
          </div>

          <div className="z-10 mt-1">
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-lg">
              <span>SEGIP</span>
            </div>
            <p className="text-xs text-blue-200/80 font-normal mt-0.5">
              Identidad que nos une
            </p>
            {/* Franja tricolor de Bolivia */}
            <div className="flex w-16 h-1 mt-2.5 rounded-full overflow-hidden">
              <span className="w-1/3 bg-[#D52B1E]" />
              <span className="w-1/3 bg-[#FCD116]" />
              <span className="w-1/3 bg-[#007934]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
