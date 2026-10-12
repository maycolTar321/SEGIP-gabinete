import React, { useState } from 'react';
import { Bell, Menu, ChevronDown } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { USUARIOS_AUTORIZADOS } from '../../services/storage';

interface MobileHeaderProps {
  onAbrirMenu: () => void;
  onVolver?: () => void;
  tituloPersonalizado?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onAbrirMenu, onVolver, tituloPersonalizado }) => {
  const { usuarioActual, cambiarUsuario, estadisticas } = useTramites();
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-[#0A3871] to-[#042450] text-white px-3 py-2.5 sticky top-0 z-40 shadow-md">
        <div className="flex items-center justify-between gap-2">
          {/* Lado izquierdo: Botón menú o botón volver */}
          <button
            type="button"
            onClick={onVolver || onAbrirMenu}
            className="p-2 -ml-1 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            aria-label="Menú principal"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Centro: Logotipos oficiales en pastilla blanca de alta resolución */}
          <div className="bg-white/95 px-2.5 py-1 rounded-full shadow-xs flex items-center gap-2 max-w-[210px] sm:max-w-none">
            <img
              src="/logo-presidencia.png"
              alt="Presidencia"
              className="h-7 w-auto object-contain shrink-0"
            />
            <div className="h-4 w-[1px] bg-slate-300" />
            <img
              src="/logo-segip.png"
              alt="SEGIP"
              className="h-6 w-auto object-contain shrink-0"
            />
          </div>

          {/* Lado derecho: Notificaciones */}
          <div className="relative">
            <button
              type="button"
              className="p-2 -mr-1 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {estadisticas.pendientes > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {estadisticas.pendientes}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de usuario activo en móvil */}
        {!tituloPersonalizado ? (
          <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setModalUsuarioAbierto(true)}
              className="flex items-center gap-2 py-1 px-2 -ml-1 rounded-lg hover:bg-white/10 text-left active:scale-98 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-white text-segip-800 flex items-center justify-center font-bold text-xs shadow-xs">
                {usuarioActual.nombre.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold leading-tight flex items-center gap-1 text-white">
                  {usuarioActual.nombre}
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                </span>
                <span className="text-[10px] text-blue-200/90 font-medium block">
                  {usuarioActual.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Operador'}
                </span>
              </div>
            </button>

            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-blue-100 font-semibold">
                Saneamiento
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-2 pt-1 border-t border-white/15 text-center">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate">
              {tituloPersonalizado}
            </h2>
          </div>
        )}
      </header>

      {/* Modal móvil para cambiar usuario */}
      {modalUsuarioAbierto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Cambiar de operador</h3>
              <button
                type="button"
                onClick={() => setModalUsuarioAbierto(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cerrar
              </button>
            </div>

            <div className="py-3 space-y-2">
              {USUARIOS_AUTORIZADOS.map((usr) => {
                const esActivo = usr.id === usuarioActual.id;
                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => {
                      cambiarUsuario(usr);
                      setModalUsuarioAbierto(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${
                      esActivo ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        esActivo ? 'bg-segip-700 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {usr.nombre.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{usr.nombre}</p>
                      <p className="text-[11px] text-slate-500 truncate">{usr.cargo}</p>
                    </div>
                    {esActivo && <div className="w-2.5 h-2.5 rounded-full bg-segip-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
