import React, { useState } from 'react';
import { Bell, Menu, LogOut, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';

interface MobileHeaderProps {
  onAbrirMenu: () => void;
  onVolver?: () => void;
  tituloPersonalizado?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onAbrirMenu,
  onVolver,
  tituloPersonalizado,
}) => {
  const { usuarioActual, logout, estadisticas, esDescarte } = useTramites();
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const getRolBadge = () => {
    if (!usuarioActual) return null;
    if (esDescarte) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
          <AlertTriangle className="w-2.5 h-2.5 text-amber-300" />
          DESCARTE
        </span>
      );
    }
    if (usuarioActual.rol === 'ADMINISTRADOR') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/25 text-blue-200 border border-blue-400/30">
          <ShieldCheck className="w-2.5 h-2.5 text-blue-300" />
          ADMINISTRADOR
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
        <UserCheck className="w-2.5 h-2.5 text-emerald-300" />
        OPERADOR
      </span>
    );
  };

  return (
    <>
      <header className="bg-gradient-to-r from-[#0A3871] via-[#082E60] to-[#042450] text-white px-3.5 pt-3 pb-2.5 sticky top-0 z-40 shadow-md select-none">
        {/* Fila superior: Menú / Logos / Campana */}
        <div className="flex items-center justify-between gap-2">
          {/* Lado izquierdo: Botón menú lateral */}
          <button
            type="button"
            onClick={onVolver || onAbrirMenu}
            className="p-2 -ml-1.5 rounded-2xl text-white hover:bg-white/10 active:bg-white/20 transition-all active:scale-95"
            aria-label="Abrir menú de opciones"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Centro: Pastilla blanca de logotipos oficiales (Presidencia + SEGIP) */}
          <div className="bg-white/95 px-3 py-1 rounded-full shadow-md flex items-center justify-center gap-2.5 border border-white/50 max-w-[210px] shrink-0">
            <img
              src="/logo-presidencia.png"
              alt="Presidencia"
              className="h-6 w-auto object-contain shrink-0"
            />
            <div className="h-3.5 w-[1px] bg-slate-300 shrink-0" />
            <img
              src="/logo-segip.png"
              alt="SEGIP"
              className="h-5 w-auto object-contain shrink-0"
            />
          </div>

          {/* Lado derecho: Notificaciones con contador */}
          <div className="relative">
            <button
              type="button"
              className="p-2 -mr-1.5 rounded-2xl text-white hover:bg-white/10 active:bg-white/20 transition-all relative active:scale-95"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {estadisticas.pendientes > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {estadisticas.pendientes}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Fila inferior: Tarjeta / Pastilla de usuario activo */}
        {!tituloPersonalizado ? (
          <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar circular con inicial */}
              <div className="w-7 h-7 rounded-full bg-white text-[#0A3871] flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                {usuarioActual?.nombre.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight text-white truncate">
                  {usuarioActual?.nombre || 'Usuario'}
                </div>
                <div className="mt-0.5">
                  {getRolBadge()}
                </div>
              </div>
            </div>

            {/* Botón de cierre de sesión */}
            <button
              type="button"
              onClick={() => setConfirmarSalida(true)}
              className="p-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-blue-100 flex items-center gap-1 text-[11px] font-semibold shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        ) : (
          <div className="mt-2 pt-1.5 border-t border-white/15 text-center">
            <h2 className="text-xs font-black text-white uppercase tracking-wider truncate">
              {tituloPersonalizado}
            </h2>
          </div>
        )}
      </header>

      {/* Modal de confirmación de cierre de sesión */}
      {confirmarSalida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 text-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-2">
                <LogOut className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-slate-800">
                ¿Cerrar sesión?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Deberá ingresar nuevamente sus credenciales para acceder al sistema.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmarSalida(false)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setConfirmarSalida(false);
                  await logout();
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 shadow-md shadow-rose-600/20"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
