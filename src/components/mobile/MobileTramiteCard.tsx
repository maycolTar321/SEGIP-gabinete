import React from 'react';
import { ChevronRight, Clock, CheckCircle2, User } from 'lucide-react';
import type { Tramite } from '../../types';
import { useTramites } from '../../context/TramitesContext';

interface MobileTramiteCardProps {
  tramite: Tramite;
  onClick: (tramite: Tramite) => void;
}

export const MobileTramiteCard: React.FC<MobileTramiteCardProps> = ({ tramite, onClick }) => {
  const { enmascararCI } = useTramites();
  const esPendiente = tramite.estado === 'PENDIENTE';

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return (nombre.trim().slice(0, 2) || 'CI').toUpperCase();
  };

  return (
    <div
      onClick={() => onClick(tramite)}
      className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs active:bg-slate-50 transition-all cursor-pointer relative active:scale-[0.99] select-none"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Avatar e información del titular */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-full bg-segip-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            {getIniciales(tramite.nombreCompleto)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
              {tramite.nombreCompleto}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {enmascararCI(tramite.cedulaIdentidad, false, tramite.tieneComplemento, tramite.complemento)} • N.º {tramite.numero}
            </p>
          </div>
        </div>

        {/* Estado pill */}
        <div className="shrink-0">
          {esPendiente ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              PENDIENTE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              FINALIZADO
            </span>
          )}
        </div>
      </div>

      {/* Fila inferior de metadatos: Modalidad, Corrección, Delegado y flecha */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 truncate">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-segip-800 font-bold text-[10px] border border-blue-100 truncate">
            {tramite.modalidad}
          </span>
          <span className="text-slate-300">•</span>
          <span className="truncate text-slate-600 font-medium text-[10px]">
            {tramite.queEstaCorrigiendo === 'Otro'
              ? (tramite.otroTipoSaneamiento || 'Otro')
              : tramite.queEstaCorrigiendo}
          </span>
          {tramite.documentacionPresentada && tramite.documentacionPresentada.length > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                {tramite.documentacionPresentada.length}/8 docs
              </span>
            </>
          )}
        </div>

        <div className="text-slate-300 shrink-0 pl-1">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
