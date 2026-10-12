import React from 'react';
import { Plus, FileText, Clock, CheckCircle2, Database, Layers } from 'lucide-react';
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
  const { estadisticas, tramites } = useTramites();
  const recientes = tramites.slice(0, 4);

  const porc = (val: number) => {
    return estadisticas.total > 0 ? `${Math.round((val / estadisticas.total) * 100)}%` : '0%';
  };

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4 pb-20 p-4">
      {/* Tarjeta principal del Gabinete Jurídico */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-800 leading-tight">
            Gabinete Jurídico
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistema de seguimiento de saneamiento de datos
          </p>
        </div>

        {/* Tarjeta de Total de trámites */}
        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-segip-700 text-white flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-segip-800">
                Total de trámites
              </span>
              <div className="text-3xl font-black text-segip-950 leading-none mt-0.5">
                {estadisticas.total}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block">
              ↑ Saneamiento
            </span>
          </div>
        </div>

        {/* Grid 2x2 para las sub-métricas */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pendientes */}
          <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800">Pendientes</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-900">{estadisticas.pendientes}</span>
              <span className="text-[10px] font-bold text-amber-700">{porc(estadisticas.pendientes)}</span>
            </div>
          </div>

          {/* Finalizados */}
          <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">Finalizados</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-900">{estadisticas.finalizados}</span>
              <span className="text-[10px] font-bold text-emerald-700">{porc(estadisticas.finalizados)}</span>
            </div>
          </div>

          {/* Consolidados */}
          <div className="bg-indigo-50/70 rounded-2xl p-3 border border-indigo-200/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-800">Consolidados</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-indigo-900">{estadisticas.consolidados}</span>
              <span className="text-[10px] font-bold text-indigo-700">{porc(estadisticas.consolidados)}</span>
            </div>
          </div>

          {/* No consolidados */}
          <div className="bg-purple-50/70 rounded-2xl p-3 border border-purple-200/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-800">No consolidados</span>
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-purple-900">{estadisticas.noConsolidados}</span>
              <span className="text-[10px] font-bold text-purple-700">{porc(estadisticas.noConsolidados)}</span>
            </div>
          </div>
        </div>

        {/* Botón principal táctil ancho completo: + Registrar nuevo trámite */}
        <button
          type="button"
          onClick={onAbrirRegistro}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A3871] to-[#1E6AD1] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Registrar nuevo trámite</span>
        </button>
      </div>

      {/* Sección de Trámites recientes */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800">Trámites recientes</h3>
          <button
            type="button"
            onClick={onVerTodos}
            className="text-xs font-bold text-segip-700 hover:text-segip-800 active:underline"
          >
            Ver todos
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recientes.map((tra) => {
            const esPendiente = tra.estado === 'PENDIENTE';
            return (
              <div
                key={tra.id}
                onClick={() => onVerDetalle(tra)}
                className="py-3 flex items-center justify-between gap-3 active:bg-slate-50 rounded-xl px-1 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-segip-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {getIniciales(tra.nombreCompleto)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {tra.nombreCompleto}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      C.I. *******{tra.cedulaIdentidad.slice(-1)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      esPendiente
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {tra.estado}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {tra.fechaRecepcion.split(' ')[1] || '08:24'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
