import React from 'react';
import { Home, FilePlus, ListFilter, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { BoliviaMap } from '../../assets/BoliviaMap';
import { useTramites } from '../../context/TramitesContext';

export type TabId = 'dashboard' | 'registro' | 'tramites' | 'reportes' | 'usuarios' | 'configuracion';

interface SidebarProps {
  tabActiva: TabId;
  onCambiarTab: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tabActiva, onCambiarTab }) => {
  const { usuarioActual, logout, esDescarte } = useTramites();

  const todosMenuItems = [
    { id: 'dashboard' as TabId, label: 'Panel principal', icon: Home, visible: true },
    { id: 'registro' as TabId, label: 'Registrar trámite', icon: FilePlus, visible: true },
    { id: 'tramites' as TabId, label: 'Listado de trámites', icon: ListFilter, visible: true },
    { id: 'reportes' as TabId, label: 'Reportes y métricas', icon: BarChart3, visible: !esDescarte },
    { id: 'usuarios' as TabId, label: 'Usuarios y accesos', icon: Users, visible: usuarioActual?.rol === 'ADMINISTRADOR' },
    { id: 'configuracion' as TabId, label: 'Configuración / Sheets', icon: Settings, visible: usuarioActual?.rol === 'ADMINISTRADOR' },
  ];

  const menuItems = todosMenuItems.filter((item) => item.visible);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0A3871] via-[#072E5D] to-[#041F40] text-white flex flex-col justify-between shrink-0 select-none shadow-2xl border-r border-blue-900/50 min-h-screen">
      {/* Sección superior de navegación */}
      <div className="pt-6">
        {/* Espacio para la marca o indicador del menú */}
        <div className="px-6 mb-5">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-200/70">
            Navegación Institucional
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
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-xs transition-all duration-200 text-left active:scale-98 cursor-pointer ${
                  esActivo
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 font-bold'
                    : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${esActivo ? 'text-white' : 'text-blue-200'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sección inferior con silueta de Bolivia, logout e identidad SEGIP */}
      <div className="p-5 space-y-4">
        {/* Botón de cerrar sesión */}
        <button
          type="button"
          onClick={logout}
          className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-blue-100 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-blue-200" />
          <span>Cerrar sesión</span>
        </button>

        {/* Silueta de Bolivia de fondo */}
        <div className="pt-3 border-t border-blue-800/60 flex items-center gap-3">
          <BoliviaMap className="w-10 h-10 text-blue-200/30 shrink-0" />
          <div>
            <div className="text-xs font-black tracking-tight text-white">
              SEGIP
            </div>
            <p className="text-[10px] text-blue-200/70">
              Gabinete Jurídico
            </p>
            {/* Franja tricolor de Bolivia */}
            <div className="flex w-12 h-1 mt-1.5 rounded-full overflow-hidden">
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
