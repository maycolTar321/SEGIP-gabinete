import React, { useState } from 'react';
import { X, Check, Clock, User, FileText, Calendar, CheckCircle2, Lock, Edit3, Trash2 } from 'lucide-react';
import type { Tramite } from '../../types';
import { useTramites } from '../../context/TramitesContext';
import { ModalEditarTramite } from './ModalEditarTramite';
import { ModalConfirmarEliminacion } from './ModalConfirmarEliminacion';

interface ModalDetalleTramiteProps {
  tramite: Tramite | null;
  isOpen: boolean;
  onClose: () => void;
  onAbrirFinalizar: (tramite: Tramite) => void;
}

export const ModalDetalleTramite: React.FC<ModalDetalleTramiteProps> = ({
  tramite,
  isOpen,
  onClose,
  onAbrirFinalizar,
}) => {
  const { puedeFinalizar, esAdmin, enmascararCI, formatearFecha } = useTramites();

  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  if (!isOpen || !tramite) return null;

  const esPendiente = tramite.estado === 'PENDIENTE';

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return (nombre.trim().slice(0, 2) || 'CI').toUpperCase();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
          {/* Cabecera */}
          <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-segip-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {getIniciales(tramite.nombreCompleto)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-800 leading-tight">
                    {tramite.nombreCompleto}
                  </h3>
                  {esPendiente ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      PENDIENTE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      FINALIZADO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {enmascararCI(tramite.cedulaIdentidad)} • N.º {tramite.numero}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Tarjeta de información principal */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-segip-600" />
                  <span>Información del trámite</span>
                </h4>

                {esAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalEditarAbierto(true)}
                      className="px-2.5 py-1 text-xs font-bold text-segip-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalEliminarAbierto(true)}
                      className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Flujo del trámite</span>
                  <span className="font-semibold text-slate-800">{tramite.flujo}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Modalidad</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg font-bold text-xs mt-0.5 ${
                    tramite.modalidad === 'Consolidado' ? 'bg-blue-100/70 text-segip-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tramite.modalidad}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">¿Qué está corrigiendo?</span>
                  <span className="font-bold text-slate-800">{tramite.queEstaCorrigiendo}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Delegado asignado</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {tramite.delegado}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Detalle de la corrección</span>
                  <p className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    {tramite.detalleCorreccion || 'Sin detalle específico registrado.'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Fecha y hora de recepción</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1 mt-0.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formatearFecha(tramite.fechaRecepcion)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Registrado por</span>
                  <span className="font-medium text-slate-700 mt-0.5 block">
                    {tramite.usuarioRegistro}
                  </span>
                </div>

                {tramite.fechaFinalizacion && (
                  <div>
                    <span className="text-emerald-600 block text-[11px] font-bold">Fecha de finalización y entrega</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1 mt-0.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {formatearFecha(tramite.fechaFinalizacion)}
                    </span>
                  </div>
                )}

                {tramite.usuarioFinalizo && (
                  <div>
                    <span className="text-emerald-600 block text-[11px] font-bold">Entregado por</span>
                    <span className="font-bold text-emerald-800 mt-0.5 block">
                      {tramite.usuarioFinalizo}
                    </span>
                  </div>
                )}

                {tramite.observaciones && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Observaciones</span>
                    <p className="text-slate-600 mt-0.5 italic">
                      {tramite.observaciones}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de eventos */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Historial de movimientos y auditoría
              </h4>

              <div className="space-y-3">
                {/* Evento inicial */}
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="w-2 h-2 rounded-full bg-segip-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800">Trámite ingresado</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatearFecha(tramite.fechaRecepcion)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Ingreso en ventanilla de Saneamiento de Datos asignado a {tramite.delegado}.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Responsable: <span className="text-slate-600">{tramite.usuarioRegistro}</span>
                    </p>
                  </div>
                </div>

                {/* Si está finalizado */}
                {tramite.fechaFinalizacion && (
                  <div className="flex items-start gap-3 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-emerald-900">Trámite concluido y entregado</p>
                        <span className="text-[10px] text-emerald-700 font-mono">
                          {formatearFecha(tramite.fechaFinalizacion)}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        El documento saneado fue verificado y entregado formalmente al titular.
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                        Responsable: <span className="text-emerald-900 font-semibold">{tramite.usuarioFinalizo}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pie con acciones */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cerrar
            </button>

            <div className="flex items-center gap-2">
              {esPendiente && (
                puedeFinalizar ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAbrirFinalizar(tramite);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Finalizar trámite</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-not-allowed"
                    title="Solo Delegados u Operadores pueden finalizar trámites"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Finalizar restringido</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales de edición y eliminación para Admin */}
      <ModalEditarTramite
        tramite={tramite}
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onExito={() => setModalEditarAbierto(false)}
      />

      <ModalConfirmarEliminacion
        tramite={tramite}
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onExito={() => {
          setModalEliminarAbierto(false);
          onClose();
        }}
      />
    </>
  );
};
