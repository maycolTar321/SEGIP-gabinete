import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, UserCheck, ShieldCheck, AlertTriangle, LogOut } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { USUARIOS_AUTORIZADOS } from '../../services/storage';

export const Header: React.FC = () => {
  const { usuarioActual, cambiarUsuario, logout, estadisticas, esDescarte } = useTramites();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200/90 px-6 py-3 sticky top-0 z-30 shadow-xs select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Lado izquierdo: Logotipos oficiales y títulos */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            {/* Logo Presidencia del Estado Plurinacional de Bolivia */}
            <img
              src="/logo-presidencia.png"
              alt="Presidencia del Estado Plurinacional de Bolivia"
              className="h-12 w-auto object-contain shrink-0"
              title="Presidencia del Estado Plurinacional de Bolivia"
            />

            {/* Separador vertical sutil */}
            <div className="h-8 w-[1.5px] bg-slate-200" />

            {/* Logo SEGIP con huella digital */}
            <img
              src="/logo-segip.png"
              alt="SEGIP - Servicio General de Identificación Personal"
              className="h-10 w-auto object-contain shrink-0"
              title="SEGIP - Servicio General de Identificación Personal"
            />
          </div>

          {/* Título institucional */}
          <div className="hidden md:block pl-3 border-l border-slate-200">
            <h1 className="text-base lg:text-lg font-black tracking-tight text-slate-800 leading-tight uppercase">
              Gabinete Jurídico
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sistema de seguimiento de saneamiento de datos
            </p>
          </div>
        </div>

        {/* Lado derecho: Notificaciones y perfil de usuario autenticado */}
        <div className="flex items-center gap-4">
          {/* Campana de notificaciones con pendientes reales */}
          <div className="relative">
            <button
              type="button"
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative"
              title={`${estadisticas.pendientes} trámites pendientes`}
            >
              <Bell className="w-5 h-5" />
              {estadisticas.pendientes > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {estadisticas.pendientes}
                </span>
              )}
            </button>
          </div>

          {/* Selector de perfil de usuario autenticado */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex items-center gap-3 pl-2.5 pr-3 py-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-full bg-segip-700 text-white flex items-center justify-center font-black text-xs shadow-inner">
                {usuarioActual?.nombre.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-black text-slate-800 leading-tight">
                  {usuarioActual?.nombre || 'Usuario'}
                </div>
                <div className="text-[10px] flex items-center gap-1 font-bold mt-0.5">
                  {esDescarte ? (
                    <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200">
                      DESCARTE
                    </span>
                  ) : usuarioActual?.rol === 'ADMINISTRADOR' ? (
                    <span className="text-segip-800 bg-blue-50 px-1.5 py-0.2 rounded-md border border-blue-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-segip-700" />
                      ADMINISTRADOR
                    </span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      OPERADOR
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuAbierto ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú desplegable */}
            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Sesión activa
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {usuarioActual?.nombre}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {usuarioActual?.cargo}
                  </p>
                </div>

                {/* Alternar a otro usuario autorizado */}
                <div className="py-1">
                  <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cambiar operador
                  </div>
                  {USUARIOS_AUTORIZADOS.map((usr) => {
                    const esSeleccionado = usr.id === usuarioActual?.id;
                    return (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => {
                          cambiarUsuario(usr);
                          setMenuAbierto(false);
                        }}
                        className={`w-full px-4 py-2 flex items-center gap-2.5 text-left transition-colors text-xs ${
                          esSeleccionado ? 'bg-blue-50 text-segip-800 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            esSeleccionado
                              ? 'bg-segip-700 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {usr.nombre.charAt(0)}
                        </div>
                        <div className="flex-1 truncate">
                          <span>{usr.nombre}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5 uppercase">
                            ({usr.rol})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Botón de cierre de sesión */}
                <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setMenuAbierto(false);
                      await logout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
