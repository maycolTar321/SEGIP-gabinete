import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';

interface UsuarioOption {
  id: string;
  nombre: string;
  cargo: string;
  rol: 'ADMINISTRADOR' | 'OPERADOR' | 'DESCARTE';
  alias: string;
}

const USUARIOS_SISTEMA: UsuarioOption[] = [
  {
    id: 'usr-admin',
    nombre: 'Maycol Ávila',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'ADMINISTRADOR',
    alias: 'Maycol Á.',
  },
  {
    id: 'usr-ximena',
    nombre: 'Ximena Veliz',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'OPERADOR',
    alias: 'Ximena V.',
  },
  {
    id: 'usr-maycol',
    nombre: 'SAMUEL',
    cargo: 'DESCARTE',
    rol: 'DESCARTE',
    alias: 'SAMUEL',
  },
];

export const LoginView: React.FC = () => {
  const { login } = useTramites();

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioOption | null>(USUARIOS_SISTEMA[0]);
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioSeleccionado) {
      setError('Por favor seleccione su usuario institucional.');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingrese su contraseña institucional.');
      return;
    }

    try {
      setCargando(true);
      setError(null);
      const res = await login(usuarioSeleccionado.id, password);
      if (!res.success) {
        setError(res.message || 'Contraseña incorrecta. Intente nuevamente.');
      }
    } catch (err: any) {
      setError('No se pudo verificar con el servidor de autenticación.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-gradient-to-b from-slate-900 via-[#0A3871] to-[#042450] text-slate-100 p-4 sm:p-6 overflow-y-auto select-none">
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

      {/* Tarjeta central de inicio de sesión */}
      <main className="w-full max-w-md mx-auto my-4 bg-white/95 backdrop-blur-md text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/30 space-y-4">
        <div className="text-center pb-0.5">
          <div className="inline-flex p-2.5 rounded-2xl bg-blue-50 text-segip-700 mb-2 border border-blue-100">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-lg font-black text-slate-800 leading-tight">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Seleccione su usuario e ingrese su contraseña institucional
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Usuario */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
              <span>Seleccione su Usuario</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Paso 1</span>
            </label>

            <div className="grid grid-cols-1 gap-2">
              {USUARIOS_SISTEMA.map((usr) => {
                const esActivo = usuarioSeleccionado?.id === usr.id;
                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => {
                      setUsuarioSeleccionado(usr);
                      setError(null);
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer active:scale-98 ${
                      esActivo
                        ? 'border-segip-600 bg-blue-50/80 shadow-md ring-2 ring-segip-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                          esActivo
                            ? 'bg-segip-700 text-white'
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
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          usr.rol === 'ADMINISTRADOR'
                            ? 'bg-blue-100 text-blue-800'
                            : usr.rol === 'OPERADOR'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
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
          </div>

          {/* Campo de Contraseña */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
              <span>Contraseña Institucional</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Paso 2</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 transition-all shadow-2xs"
                disabled={cargando}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                tabIndex={-1}
                aria-label="Mostrar contraseña"
              >
                {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botón de acceso */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A3871] to-[#1E6AD1] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Nota de seguridad institucional */}
        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 text-[10px] text-slate-500 leading-relaxed text-center">
          Acceso protegido y auditado. Las sesiones expiran automáticamente tras 8 horas de inactividad.
        </div>
      </main>

      {/* Pie de página institucional */}
      <footer className="w-full max-w-md mx-auto pb-3 text-center text-[11px] text-blue-200/70">
        Servicio General de Identificación Personal • Bolivia
      </footer>
    </div>
  );
};
