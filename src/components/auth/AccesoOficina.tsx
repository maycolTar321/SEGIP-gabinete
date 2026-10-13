import React, { useState } from 'react';
import { Shield, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

const CLAVE_PROTECCION = 'SanJorge2026';

interface AccesoOficinaProps {
  onDesbloqueado: () => void;
}

export const AccesoOficina: React.FC<AccesoOficinaProps> = ({ onDesbloqueado }) => {
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const claveTrim = clave.trim();

    if (!claveTrim) {
      setError('Por favor ingrese la clave de acceso para continuar.');
      return;
    }

    setProcesando(true);
    setError(null);

    setTimeout(() => {
      if (claveTrim === CLAVE_PROTECCION) {
        onDesbloqueado();
      } else {
        setError('Clave de acceso incorrecta.');
        setProcesando(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-slate-900 text-slate-100 p-4 sm:p-6 select-none font-sans">
      {/* Cabecera neutra sin logos ni nombres institucionales */}
      <header className="w-full max-w-sm mx-auto pt-8 sm:pt-14 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-slate-800 text-blue-400 border border-slate-700/80 shadow-lg mb-3">
          <Shield className="w-7 h-7 stroke-[2]" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Portal de Administración
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Acceso privado para personal autorizado
        </p>
      </header>

      {/* Tarjeta de validación de clave única */}
      <main className="w-full max-w-sm mx-auto my-auto bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-700/60 space-y-4">
        <div className="text-left pb-1">
          <h2 className="text-sm font-semibold text-slate-200">
            Control de Seguridad
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingrese la clave de protección para habilitar el sistema
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Clave de Acceso
            </label>
            <div className="relative">
              <input
                type={mostrarClave ? 'text' : 'password'}
                value={clave}
                onChange={(e) => {
                  setClave(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                aria-label={mostrarClave ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={procesando}
            className="w-full mt-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {procesando ? (
              <span>Verificando...</span>
            ) : (
              <>
                <span>Ingresar al Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </main>

      {/* Pie neutro sin identificadores */}
      <footer className="w-full max-w-sm mx-auto pb-6 text-center text-[11px] text-slate-500">
        <p>Sistema Privado de Gestión Interna • Uso Exclusivo</p>
      </footer>
    </div>
  );
};
