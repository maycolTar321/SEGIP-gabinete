import React from 'react';
import { Plus, Clock, CheckCircle2, Database, Layers, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import type { Tramite } from '../../types';

interface MobileHomeViewProps {
  onAbrirRegistro: () => void;
  onVerTodos: () => void;
  onVerDetalle: (tramite: Tramite) => void;
}

export const MobileHomeView: React.FC<MobileHomeViewProps> = ({
  onAbrirRegistro,
  onVerTodos,
  onVerDetalle,
}) => {
  const { estadisticas, tramites, enmascararCI, formatearHora } = useTramites();
  const recientes = tramites.slice(0, 5);

  const porc = (val: number) => {
    return estadisticas.total > 0 ? `${Math.round((val / estadisticas.total) * 100)}%` : '0%';
  };

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return (nombre.trim().slice(0, 2) || 'CI').toUpperCase();
  };

  return (
    <div className="space-y-4 pb-24 p-4 max-w-md mx-auto select-none">
      {/* Título y subtítulo del sistema */}
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
          Gabinete Jurídico
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Sistema de seguimiento de saneamiento de datos
        </p>
      </div>

      {/* Tarjeta Principal: Total de trámites con ilustración gráfica de barras */}
      <div className="bg-gradient-to-br from-[#0A3871] via-[#0D478A] to-[#1559AC] rounded-3xl p-5 text-white shadow-xl shadow-blue-950/20 relative overflow-hidden border border-blue-400/20">
        {/* Gráfico decorativo de fondo */}
        <div className="absolute right-4 bottom-4 flex items-end gap-1.5 opacity-25 pointer-events-none">
          <div className="w-2.5 h-8 bg-white rounded-t-sm" />
          <div className="w-2.5 h-14 bg-white rounded-t-sm" />
          <div className="w-2.5 h-10 bg-white rounded-t-sm" />
          <div className="w-2.5 h-20 bg-white rounded-t-sm" />
          <div className="w-2.5 h-16 bg-white rounded-t-sm" />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              Total de trámites
            </span>
            <div className="text-4xl font-black text-white leading-none mt-1 tracking-tight">
              {estadisticas.total}
            </div>

            {/* Pastilla indicadora (+12% este mes / Activo) */}
            <div className="mt-3.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                <TrendingUp className="w-3 h-3" />
                +12% este mes
              </span>
              <span className="text-[11px] text-blue-200/80 font-medium">
                Saneamiento
              </span>
            </div>
          </div>

          {/* Gráfico de barras mini institucional a la derecha */}
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/15 flex items-end gap-1 h-16 shrink-0 shadow-inner">
            <div className="w-1.5 h-6 bg-blue-300/70 rounded-full" />
            <div className="w-1.5 h-10 bg-blue-200/90 rounded-full" />
            <div className="w-1.5 h-7 bg-blue-300/70 rounded-full" />
            <div className="w-1.5 h-12 bg-white rounded-full shadow-xs" />
            <div className="w-1.5 h-9 bg-blue-200/90 rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid 2x2 para las sub-métricas (Pendientes, Finalizados, Consolidados, No consolidados) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pendientes */}
        <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Pendientes</span>
            <div className="p-1 rounded-lg bg-amber-100 text-amber-700">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-amber-950 leading-none">
              {estadisticas.pendientes}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-md">
              {porc(estadisticas.pendientes)}
            </span>
          </div>
        </div>

        {/* Finalizados */}
        <div className="bg-emerald-50/80 rounded-2xl p-3.5 border border-emerald-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Finalizados</span>
            <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-emerald-950 leading-none">
              {estadisticas.finalizados}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
              {porc(estadisticas.finalizados)}
            </span>
          </div>
        </div>

        {/* Consolidados */}
        <div className="bg-indigo-50/80 rounded-2xl p-3.5 border border-indigo-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">Consolidados</span>
            <div className="p-1 rounded-lg bg-indigo-100 text-indigo-700">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-indigo-950 leading-none">
              {estadisticas.consolidados}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded-md">
              {porc(estadisticas.consolidados)}
            </span>
          </div>
        </div>

        {/* No consolidados */}
        <div className="bg-purple-50/80 rounded-2xl p-3.5 border border-purple-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900">No consolidados</span>
            <div className="p-1 rounded-lg bg-purple-100 text-purple-700">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-purple-950 leading-none">
              {estadisticas.noConsolidados}
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded-md">
              {porc(estadisticas.noConsolidados)}
            </span>
          </div>
        </div>
      </div>

      {/* Botón táctil principal ancho completo: + Registrar nuevo trámite */}
      <button
        type="button"
        onClick={onAbrirRegistro}
        className="w-full py-4 px-5 bg-gradient-to-r from-[#0A3871] to-[#1E6AD1] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:brightness-105"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
        <span>Registrar nuevo trámite</span>
      </button>

      {/* Sección de Trámites recientes */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800">Trámites recientes</h3>
          <button
            type="button"
            onClick={onVerTodos}
            className="text-xs font-bold text-segip-700 hover:text-segip-800 active:underline flex items-center gap-0.5"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recientes.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No hay trámites registrados aún.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recientes.map((tra) => {
              const esPendiente = tra.estado === 'PENDIENTE';
              return (
                <div
                  key={tra.id}
                  onClick={() => onVerDetalle(tra)}
                  className="py-3 flex items-center justify-between gap-3 active:bg-slate-50 rounded-xl px-1.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-segip-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {getIniciales(tra.nombreCompleto)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {tra.nombreCompleto}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {enmascararCI(tra.cedulaIdentidad)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        esPendiente
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {tra.estado}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      {formatearHora(tra.fechaRecepcion)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
