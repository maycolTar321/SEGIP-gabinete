import React from 'react';
import { History, CheckCircle2, Clock } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { Tramite } from '../../types';

interface RecentActivityPanelProps {
  onVerDetalle: (tramite: Tramite) => void;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ onVerDetalle }) => {
  const { tramites, formatearHora } = useTramites();

  // Tomar los 5 más recientes
  const recientes = tramites.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-segip-600" />
          <h3 className="text-sm font-bold text-slate-800">Actividad reciente</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Últimos movimientos</span>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {recientes.map((tra) => {
          const esPendiente = tra.estado === 'PENDIENTE';
          return (
            <div
              key={tra.id}
              onClick={() => onVerDetalle(tra)}
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    esPendiente
                      ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}
                >
                  {esPendiente ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {tra.nombreCompleto}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {tra.queEstaCorrigiendo} • {tra.delegado}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    esPendiente
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  {tra.estado}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {formatearHora(tra.fechaRecepcion)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
