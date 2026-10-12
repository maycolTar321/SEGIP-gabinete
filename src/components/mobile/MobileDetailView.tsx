import React from 'react';
import { ArrowLeft, Clock, CheckCircle2, MoreVertical, Edit3, Check, FileText } from 'lucide-react';
import type { Tramite } from '../../types';

interface MobileDetailViewProps {
  tramite: Tramite;
  onVolver: () => void;
  onFinalizar: (tramite: Tramite) => void;
}

export const MobileDetailView: React.FC<MobileDetailViewProps> = ({
  tramite,
  onVolver,
  onFinalizar,
}) => {
  const esPendiente = tramite.estado === 'PENDIENTE';

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden">
      {/* Barra superior con volver */}
      <div className="bg-[#0A3871] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <button
          type="button"
          onClick={onVolver}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-xl flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Atrás</span>
        </button>

        <h2 className="text-sm font-bold tracking-tight">Detalle del trámite</h2>

        <button type="button" className="p-1.5 text-blue-200 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido scrolleable del detalle */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Tarjeta del titular */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-segip-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {getIniciales(tramite.nombreCompleto)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 leading-tight truncate">
                {tramite.nombreCompleto}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                C.I. *******{tramite.cedulaIdentidad.slice(-1)} • N.º {tramite.numero}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {esPendiente ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                PENDIENTE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                FINALIZADO
              </span>
            )}
          </div>
        </div>

        {/* Información del trámite */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-segip-600" />
            Información del trámite
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-400">Flujo del trámite</span>
              <span className="font-semibold text-slate-700">{tramite.flujo}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-400">Modalidad</span>
              <span className="px-2.5 py-0.5 rounded-lg font-bold text-xs bg-blue-50 text-segip-800">
                {tramite.modalidad}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-400">Qué está corrigiendo</span>
              <span className="px-2.5 py-0.5 rounded-lg font-bold text-xs bg-emerald-50 text-emerald-800">
                {tramite.queEstaCorrigiendo}
              </span>
            </div>

            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-slate-400 block mb-1">Detalle</span>
              <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                {tramite.detalleCorreccion || 'Sin detalle complementario.'}
              </p>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-400">Delegado</span>
              <span className="font-semibold text-slate-800">{tramite.delegado}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-400">Fecha de recepción</span>
              <span className="font-mono text-slate-700">{tramite.fechaRecepcion}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Registrado por</span>
              <span className="font-semibold text-slate-800">{tramite.usuarioRegistro}</span>
            </div>

            {tramite.fechaFinalizacion && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-emerald-700 font-bold">Fecha de finalización</span>
                <span className="font-mono font-bold text-emerald-800">{tramite.fechaFinalizacion}</span>
              </div>
            )}
          </div>
        </div>

        {/* Historial del trámite (Timeline) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Historial del trámite
          </h4>

          <div className="space-y-4 pl-2 border-l-2 border-slate-200 ml-2">
            {tramite.historial.map((ev) => (
              <div key={ev.id} className="relative pl-5">
                <div
                  className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    ev.tipo === 'FINALIZACION' ? 'bg-emerald-500' : 'bg-segip-600'
                  }`}
                />
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800">{ev.titulo}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.fechaHora}</span>
                  </div>
                  {ev.descripcion && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{ev.descripcion}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Por: <span className="text-slate-600">{ev.usuario}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de acción inferiores fijos */}
      <div className="bg-white p-4 border-t border-slate-200 flex items-center gap-3">
        <button
          type="button"
          onClick={onVolver}
          className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Volver</span>
        </button>

        {esPendiente && (
          <button
            type="button"
            onClick={() => onFinalizar(tramite)}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Finalizar trámite</span>
          </button>
        )}
      </div>
    </div>
  );
};
