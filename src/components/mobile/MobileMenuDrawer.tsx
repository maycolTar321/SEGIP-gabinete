import React from 'react';
import { X, Home, FilePlus, ListFilter, BarChart3, Users, Settings, LogOut, ShieldCheck, AlertTriangle } from 'lucide-react';
import { BoliviaMap } from '../../assets/BoliviaMap';
import type { TabId } from '../layout/Sidebar';
import { useTramites } from '../../context/TramitesContext';

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
  const { usuarioActual, logout, esDescarte } = useTramites();

  if (!isOpen) return null;

  const todosMenuItems = [
    { id: 'dashboard' as TabId, label: 'Panel principal', icon: Home, visible: true },
    { id: 'registro' as TabId, label: 'Registrar trámite', icon: FilePlus, visible: true },
    { id: 'tramites' as TabId, label: 'Listado de trámites', icon: ListFilter, visible: true },
    { id: 'reportes' as TabId, label: 'Reportes y Estadísticas', icon: BarChart3, visible: !esDescarte },
    { id: 'usuarios' as TabId, label: 'Usuarios y Accesos', icon: Users, visible: usuarioActual?.rol === 'ADMINISTRADOR' },
    { id: 'configuracion' as TabId, label: 'Configuración / Sheets', icon: Settings, visible: usuarioActual?.rol === 'ADMINISTRADOR' },
  ];

  const menuItems = todosMenuItems.filter((item) => item.visible);

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-150">
      {/* Fondo oscuro backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Menú deslizable lateral */}
      <div className="relative w-4/5 max-w-xs bg-gradient-to-b from-[#0A3871] via-[#072B56] to-[#041D3C] text-white flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
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
              className="p-1.5 text-blue-200 hover:text-white rounded-xl active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Información del usuario autenticado */}
          <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-[#0A3871] flex items-center justify-center font-black text-xs shadow-xs">
                {usuarioActual?.nombre.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {usuarioActual?.nombre || 'Usuario'}
                </p>
                <div className="mt-0.5">
                  {esDescarte ? (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/30">
                      DESCARTE
                    </span>
                  ) : usuarioActual?.rol === 'ADMINISTRADOR' ? (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      ADMINISTRADOR
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      OPERADOR
                    </span>
                  )}
                </div>
              </div>
            </div>
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
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-xs text-left transition-all active:scale-98 ${
                    esActivo
                      ? 'bg-blue-600/90 text-white font-bold shadow-md shadow-blue-950/30'
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

        {/* Sección inferior con botón de cerrar sesión e identidad SEGIP */}
        <div className="pt-4 border-t border-blue-900/60 space-y-3">
          <button
            type="button"
            onClick={async () => {
              onClose();
              await logout();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>

          <div className="flex items-center gap-2.5 pt-1 text-blue-200/50">
            <BoliviaMap className="w-8 h-8 opacity-40 shrink-0" />
            <div className="text-[10px] leading-tight">
              <p className="font-bold text-white/80">SEGIP Gabinete Jurídico</p>
              <p>Identidad que nos une</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
