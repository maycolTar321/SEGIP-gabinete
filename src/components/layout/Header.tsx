import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, UserCheck, ShieldCheck } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { USUARIOS_AUTORIZADOS } from '../../services/storage';

export const Header: React.FC = () => {
  const { usuarioActual, cambiarUsuario, estadisticas } = useTramites();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
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
    <header className="bg-white border-b border-slate-200/90 px-6 py-3.5 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Lado izquierdo: Logotipos oficiales y títulos */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            {/* Logo Presidencia del Estado Plurinacional de Bolivia */}
            <img
              src="/logo-presidencia.png"
              alt="Presidencia del Estado Plurinacional de Bolivia"
              className="h-14 w-auto object-contain shrink-0"
              title="Presidencia del Estado Plurinacional de Bolivia"
            />

            {/* Separador vertical sutil */}
            <div className="h-10 w-[1.5px] bg-slate-200" />

            {/* Logo SEGIP con huella digital */}
            <img
              src="/logo-segip.png"
              alt="SEGIP - Servicio General de Identificación Personal"
              className="h-11 w-auto object-contain shrink-0"
              title="SEGIP - Servicio General de Identificación Personal"
            />
          </div>

          {/* Título institucional */}
          <div className="hidden md:block pl-2 border-l border-slate-200">
            <h1 className="text-lg lg:text-xl font-extrabold tracking-tight text-slate-800 leading-tight">
              GABINETE JURÍDICO
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sistema de seguimiento de saneamiento de datos
            </p>
          </div>
        </div>

        {/* Lado derecho: Notificaciones y selector de usuario conectado */}
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
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
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
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-full bg-segip-700 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                {usuarioActual.nombre.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {usuarioActual.nombre}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  {usuarioActual.rol === 'ADMINISTRADOR' ? (
                    <ShieldCheck className="w-3 h-3 text-segip-700" />
                  ) : (
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                  )}
                  {usuarioActual.cargo.replace(' Gabinete Jurídico', '')}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuAbierto ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú desplegable para alternar entre los 3 usuarios autorizados */}
            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Cambiar usuario de sesión
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Operadores autorizados del Gabinete Jurídico
                  </p>
                </div>

                <div className="py-1">
                  {USUARIOS_AUTORIZADOS.map((usr) => {
                    const esSeleccionado = usr.id === usuarioActual.id;
                    return (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => {
                          cambiarUsuario(usr);
                          setMenuAbierto(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                          esSeleccionado ? 'bg-blue-50 text-segip-800' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            esSeleccionado
                              ? 'bg-segip-700 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {usr.nombre.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${esSeleccionado ? 'text-segip-800' : ''}`}>
                            {usr.nombre}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{usr.cargo}</p>
                        </div>
                        {esSeleccionado && (
                          <div className="w-2 h-2 rounded-full bg-segip-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
