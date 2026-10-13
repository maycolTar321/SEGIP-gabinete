import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import type { UsuarioActivo } from '../../types';

interface UsuarioOption {
  id: string;
  nombre: string;
  cargo: string;
  rol: 'ADMINISTRADOR' | 'OPERADOR' | 'DESCARTE';
}

const USUARIOS_SISTEMA: UsuarioOption[] = [
  {
    id: 'usr-admin',
    nombre: 'Maycol Ávila',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'ADMINISTRADOR',
  },
  {
    id: 'usr-maycol',
    nombre: 'Samuel',
    cargo: 'DESCARTE',
    rol: 'DESCARTE',
  },
  {
    id: 'usr-ximena',
    nombre: 'Ximena Veliz',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'OPERADOR',
  },
];

export const LoginView: React.FC = () => {
  const { cambiarUsuario } = useTramites();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioOption>(USUARIOS_SISTEMA[0]);

  const handleIngresar = () => {
    const usuarioActivo: UsuarioActivo = {
      id: usuarioSeleccionado.id,
      nombre: usuarioSeleccionado.nombre,
      cargo: usuarioSeleccionado.cargo,
      rol: usuarioSeleccionado.rol,
      token: `tok-${usuarioSeleccionado.id}-${Date.now()}`,
    };
    cambiarUsuario(usuarioActivo);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-gradient-to-b from-slate-900 via-[#0A3871] to-[#042450] text-slate-100 p-4 sm:p-6 overflow-y-auto select-none font-sans">
      {/* Cabecera institucional superior */}
      <header className="w-full max-w-md mx-auto pt-3 sm:pt-6 flex flex-col items-center text-center">
        {/* Pastilla blanca de logotipos oficiales (Presidencia + SEGIP) */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl flex items-center justify-center gap-3 border border-white/40 mb-4">
          <img
            src="/logo-presidencia.png"
            alt="Presidencia del Estado Plurinacional de Bolivia"
            className="h-9 sm:h-10 w-auto object-contain"
          />
          <div className="h-6 w-[1.5px] bg-slate-300" />
          <img
            src="/logo-segip.png"
            alt="SEGIP"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-xs">
          Gabinete Jurídico
        </h1>
        <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-0.5">
          Sistema de seguimiento de saneamiento de datos
        </p>
      </header>

      {/* Tarjeta central de selección de usuario */}
      <main className="w-full max-w-md mx-auto my-4 bg-white/95 backdrop-blur-md text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/30 space-y-5">
        <div className="text-center pb-1">
          <div className="inline-flex p-2.5 rounded-2xl bg-blue-50 text-segip-700 mb-2 border border-blue-100">
            <UserCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-lg font-black text-slate-800 leading-tight">
            Seleccione su Usuario
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Elija su perfil institucional para acceder al sistema
          </p>
        </div>

        {/* Lista de perfiles */}
        <div className="grid grid-cols-1 gap-2.5">
          {USUARIOS_SISTEMA.map((usr) => {
            const esActivo = usuarioSeleccionado.id === usr.id;
            return (
              <button
                key={usr.id}
                type="button"
                onClick={() => setUsuarioSeleccionado(usr)}
                className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer active:scale-98 ${
                  esActivo
                    ? 'border-segip-600 bg-blue-50/90 shadow-md ring-2 ring-segip-500/25'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors shadow-xs ${
                      esActivo
                        ? 'bg-segip-700 text-white shadow-segip-900/20'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {usr.nombre.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-800 leading-tight truncate">
                      {usr.nombre}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {usr.cargo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      usr.rol === 'ADMINISTRADOR'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : usr.rol === 'OPERADOR'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {usr.rol}
                  </span>
                  {esActivo ? (
                    <CheckCircle2 className="w-4 h-4 text-segip-600 fill-segip-600/20 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón de ingreso con el usuario seleccionado */}
        <button
          type="button"
          onClick={handleIngresar}
          className="w-full py-3.5 px-4 bg-segip-700 hover:bg-segip-800 active:bg-segip-900 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-segip-900/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>Ingresar como {usuarioSeleccionado.nombre}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      {/* Pie institucional */}
      <footer className="w-full max-w-md mx-auto pt-2 pb-4 text-center text-xs text-blue-200/60 font-medium">
        <p>Servicio General de Identificación Personal • SEGIP</p>
      </footer>
    </div>
  );
};
