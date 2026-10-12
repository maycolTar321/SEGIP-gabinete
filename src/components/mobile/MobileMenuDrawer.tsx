import React from 'react';
import { X, Home, FilePlus, ListFilter, BarChart3, Users, Settings } from 'lucide-react';
import { BoliviaMap } from '../../assets/BoliviaMap';
import type { TabId } from '../layout/Sidebar';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tabActiva: TabId;
  onSeleccionarTab: (tab: TabId) => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  tabActiva,
  onSeleccionarTab,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard' as TabId, label: 'Panel principal', icon: Home },
    { id: 'registro' as TabId, label: 'Registrar trámite', icon: FilePlus },
    { id: 'tramites' as TabId, label: 'Listado de trámites', icon: ListFilter },
    { id: 'reportes' as TabId, label: 'Reportes y Estadísticas', icon: BarChart3 },
    { id: 'usuarios' as TabId, label: 'Usuarios y Accesos', icon: Users },
    { id: 'configuracion' as TabId, label: 'Configuración / Sheets', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo oscuro backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Menú deslizable lateral */}
      <div className="relative w-4/5 max-w-xs bg-[#0A3871] text-white flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          {/* Cabecera del drawer con logos */}
          <div className="flex items-center justify-between pb-4 border-b border-blue-900/60">
            <div className="bg-white/95 px-2.5 py-1 rounded-full shadow-xs flex items-center gap-2">
              <img src="/logo-presidencia.png" alt="Presidencia" className="h-6 w-auto" />
              <div className="h-3.5 w-[1px] bg-slate-300" />
              <img src="/logo-segip.png" alt="SEGIP" className="h-5 w-auto" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className="mt-5 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const esActivo = tabActiva === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSeleccionarTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-xs text-left transition-colors ${
                    esActivo
                      ? 'bg-blue-600/90 text-white font-bold shadow-md'
                      : 'text-blue-100/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Identidad institucional inferior */}
        <div className="pt-4 border-t border-blue-900/60 flex items-center gap-3">
          <BoliviaMap className="w-12 h-12 text-blue-200/40" />
          <div>
            <p className="text-xs font-bold text-white">SEGIP Gabinete Jurídico</p>
            <p className="text-[10px] text-blue-200/80">Identidad que nos une</p>
          </div>
        </div>
      </div>
    </div>
  );
};
