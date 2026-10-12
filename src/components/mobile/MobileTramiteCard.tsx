import React from 'react';
import { ChevronRight, Clock, CheckCircle2, Database, User, Calendar, FileText } from 'lucide-react';
import type { Tramite } from '../../types';

interface MobileTramiteCardProps {
  tramite: Tramite;
  onClick: (tramite: Tramite) => void;
}

export const MobileTramiteCard: React.FC<MobileTramiteCardProps> = ({ tramite, onClick }) => {
  const esPendiente = tramite.estado === 'PENDIENTE';

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  return (
    <div
      onClick={() => onClick(tramite)}
      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs active:bg-slate-50 transition-all cursor-pointer relative"
    >
      {/* Cabecera de la tarjeta: Avatar, Nombre, CI y Badge de Estado */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-segip-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {getIniciales(tramite.nombreCompleto)}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {tramite.nombreCompleto}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              C.I. *******{tramite.cedulaIdentidad.slice(-1)} • N.º {tramite.numero}
            </p>
          </div>
        </div>

        {/* Estado pill */}
        <div className="shrink-0">
          {esPendiente ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              PENDIENTE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              FINALIZADO
            </span>
          )}
        </div>
      </div>

      {/* Datos clave del trámite */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 truncate">
          <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{tramite.modalidad}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{tramite.delegado}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate col-span-2">
          <FileText className="w-3.5 h-3.5 text-segip-600 shrink-0" />
          <span className="truncate font-medium text-slate-700">{tramite.queEstaCorrigiendo}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] col-span-2">
          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{tramite.fechaRecepcion}</span>
        </div>
      </div>

      {/* Flecha indicador */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};
