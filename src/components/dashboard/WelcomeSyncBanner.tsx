import React from 'react';
import { BarChart2, RefreshCw, Radio } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';

export const WelcomeSyncBanner: React.FC = () => {
  const { usuarioActual, sincronizando, ultimaSincronizacion, conexionActiva, forzarSincronizacion } = useTramites();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Información de bienvenida */}
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-segip-50 border border-segip-100 flex items-center justify-center text-segip-700 shrink-0 shadow-inner">
          <BarChart2 className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Panel de seguimiento
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Bienvenido, <span className="font-semibold text-slate-700">{usuarioActual.nombre}</span>. Aquí puedes registrar, consultar y hacer seguimiento a los trámites de saneamiento de datos del Gabinete Jurídico.
          </p>
        </div>
      </div>

      {/* Estado de sincronización en tiempo real */}
      <div className="flex items-center self-end md:self-center gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            {conexionActiva ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                Sincronización activa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Modo local
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 font-medium">
            Última actualización: {ultimaSincronizacion}
          </span>
        </div>

        {/* Botón de refresco manual */}
        <button
          type="button"
          onClick={() => forzarSincronizacion()}
          disabled={sincronizando}
          className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-xs ${
            sincronizando ? 'cursor-not-allowed opacity-70' : 'active:scale-95'
          }`}
          title="Forzar sincronización inmediata"
        >
          <RefreshCw className={`w-4 h-4 ${sincronizando ? 'animate-spin text-segip-600' : ''}`} />
        </button>
      </div>
    </div>
  );
};
