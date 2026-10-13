import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, Edit3, Check, FileText, Lock, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';
import type { Tramite } from '../../types';
import { useTramites } from '../../context/TramitesContext';
import { ModalEditarTramite } from '../tramites/ModalEditarTramite';
import { ModalConfirmarEliminacion } from '../tramites/ModalConfirmarEliminacion';

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
  const { puedeFinalizar, esDescarte, esAdmin, enmascararCI, formatearFecha } = useTramites();
  const esPendiente = tramite.estado === 'PENDIENTE';

  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return (nombre.trim().slice(0, 2) || 'CI').toUpperCase();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden select-none animate-in fade-in duration-150">
        {/* Barra superior con volver */}
        <header className="bg-gradient-to-r from-[#0A3871] to-[#042450] text-white px-4 py-3.5 flex items-center justify-between shadow-md shrink-0">
          <button
            type="button"
            onClick={onVolver}
            className="p-1 -ml-1 text-white hover:bg-white/10 active:bg-white/20 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>

          <h2 className="text-sm font-black tracking-tight uppercase">
            Detalle del trámite
          </h2>

          {/* Botón de acción rápida para Admin */}
          <div className="flex items-center gap-1">
            {esAdmin && (
              <button
                type="button"
                onClick={() => setModalEliminarAbierto(true)}
                className="p-1.5 text-rose-300 hover:text-white hover:bg-rose-600/30 rounded-xl transition-all active:scale-95"
                title="Eliminar trámite (Solo Administrador)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Contenido scrolleable del detalle */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 max-w-md mx-auto w-full">
          {/* Tarjeta del titular */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-segip-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                {getIniciales(tramite.nombreCompleto)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-slate-800 leading-tight truncate">
                  {tramite.nombreCompleto}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {enmascararCI(tramite.cedulaIdentidad, false, tramite.tieneComplemento, tramite.complemento)} • N.º {tramite.numero}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {esPendiente ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  PENDIENTE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  FINALIZADO
                </span>
              )}
            </div>
          </div>

          {/* Información del trámite */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-segip-600" />
                <span>Información del trámite</span>
              </h4>

              {esAdmin && (
                <button
                  type="button"
                  onClick={() => setModalEditarAbierto(true)}
                  className="text-[11px] font-bold text-segip-700 hover:text-segip-900 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 active:scale-95"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-400">Flujo del trámite</span>
                <span className="font-extrabold text-segip-800">Saneamiento de datos</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-400">Modalidad</span>
                <span className="px-2.5 py-0.5 rounded-lg font-black text-xs bg-blue-50 text-segip-800 border border-blue-100">
                  {tramite.modalidad}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-400">Qué está corrigiendo</span>
                <span className="font-bold text-slate-800 text-right">
                  {tramite.queEstaCorrigiendo === 'Otro'
                    ? `Otro: ${tramite.otroTipoSaneamiento || ''}`
                    : tramite.queEstaCorrigiendo}
                </span>
              </div>

              <div className="border-b border-slate-100 pb-2.5">
                <span className="text-slate-400 block mb-1">Detalle de la corrección</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                  {tramite.detalleCorreccion || 'Sin detalle especificado.'}
                </p>
              </div>

              {/* DOCUMENTACIÓN PRESENTADA (8 DOCUMENTOS) */}
              <div className="border-b border-slate-100 pb-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">
                    Documentación presentada
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-segip-800 border border-blue-200">
                    {tramite.documentacionPresentada?.length || 0} de 8
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {[
                    'FUTA',
                    'Certificado de nacimiento',
                    'Certificado de matrimonio',
                    'Cédula de identidad del padre',
                    'Cédula de identidad de la madre',
                    'Certificado de defunción',
                    'Resolución administrativa del CERESI',
                    'Partida única del CERESI',
                  ].map((doc, idx) => {
                    const presentado = (tramite.documentacionPresentada || []).includes(doc);
                    return (
                      <div
                        key={doc}
                        className={`p-2 rounded-xl flex items-center justify-between text-[11px] ${
                          presentado
                            ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-semibold'
                            : 'bg-slate-50/60 border border-slate-150 text-slate-400'
                        }`}
                      >
                        <span className="truncate pr-2">
                          <span className="font-mono text-[10px] mr-1.5 opacity-60">{idx + 1}.</span>
                          {doc}
                        </span>
                        {presentado ? (
                          <span className="text-emerald-600 font-black text-xs shrink-0 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span className="text-[9px] uppercase">Presentado</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px] italic shrink-0">No presentado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-400">Delegado responsable</span>
                <span className="font-bold text-slate-800">{tramite.delegado}</span>
              </div>

              {/* Fechas limpias en español */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-400">Fecha de recepción</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {formatearFecha(tramite.fechaRecepcion)}
                </span>
              </div>

              {tramite.fechaFinalizacion && (
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Fecha de entrega</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {formatearFecha(tramite.fechaFinalizacion)}
                  </span>
                </div>
              )}

              {tramite.usuarioFinalizo && (
                <div className="flex items-center justify-between pb-1">
                  <span className="text-slate-400">Finalizado por</span>
                  <span className="font-bold text-slate-800">{tramite.usuarioFinalizo}</span>
                </div>
              )}

              {tramite.observaciones && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block mb-1">Observaciones</span>
                  <p className="text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60 leading-relaxed text-[11px]">
                    {tramite.observaciones}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Línea de tiempo / Historial cronológico con fechas en español */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-segip-600" />
              <span>Historial del trámite</span>
            </h4>

            <div className="relative pl-6 space-y-5 pt-1">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />

              {/* Nodo 1: Trámite registrado */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-segip-700 text-white flex items-center justify-center text-[10px] shadow-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Trámite registrado</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatearFecha(tramite.fechaRecepcion)} por {tramite.usuarioRegistro || 'Operador'}
                  </p>
                </div>
              </div>

              {/* Nodo 2: Asignado a delegado */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Asignado a Delegado</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Responsable: {tramite.delegado}
                  </p>
                </div>
              </div>

              {/* Nodo 3: En proceso o Concluido */}
              {esPendiente ? (
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-xs animate-pulse">
                    ●
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-800">En proceso de saneamiento</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Trámite en revisión por Gabinete Jurídico
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Concluido y entregado</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatearFecha(tramite.fechaFinalizacion)} por {tramite.usuarioFinalizo || 'Delegado'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alerta si el rol es DESCARTE */}
          {esDescarte && esPendiente && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                El rol <strong>DESCARTE</strong> tiene acceso de solo lectura y control. La finalización de trámites está reservada a Delegados y Operadores.
              </span>
            </div>
          )}
        </main>

        {/* Botones de acción inferiores */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 max-w-md mx-auto space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onVolver}
              className="py-3.5 px-4 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Volver a lista</span>
            </button>

            {esPendiente ? (
              <button
                type="button"
                onClick={() => onFinalizar(tramite)}
                disabled={!puedeFinalizar}
                className={`py-3.5 px-4 rounded-2xl text-white text-xs font-bold shadow-md active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  puedeFinalizar
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-emerald-900/25 hover:brightness-105'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {puedeFinalizar ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Finalizar trámite</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Finalizar restringido</span>
                  </>
                )}
              </button>
            ) : (
              <div className="py-3.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Concluido</span>
              </div>
            )}
          </div>
        </footer>
      </div>

      {/* Modal para Editar Trámite (Solo Admin) */}
      <ModalEditarTramite
        tramite={tramite}
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onExito={() => setModalEditarAbierto(false)}
      />

      {/* Modal para Confirmar Eliminación (Solo Admin) */}
      <ModalConfirmarEliminacion
        tramite={tramite}
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onExito={() => {
          setModalEliminarAbierto(false);
          onVolver();
        }}
      />
    </>
  );
};
