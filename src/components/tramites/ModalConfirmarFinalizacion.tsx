import React, { useState } from 'react';
import { Check, X, AlertTriangle, FileCheck, Loader2 } from 'lucide-react';
import { Tramite } from '../../types';

interface ModalConfirmarFinalizacionProps {
  tramite: Tramite | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (tramiteId: string, observaciones?: string) => Promise<void>;
}

export const ModalConfirmarFinalizacion: React.FC<ModalConfirmarFinalizacionProps> = ({
  tramite,
  isOpen,
  onClose,
  onConfirmar,
}) => {
  const [observacionFinal, setObservacionFinal] = useState('');
  const [procesando, setProcesando] = useState(false);

  if (!isOpen || !tramite) return null;

  const handleFinalizar = async () => {
    try {
      setProcesando(true);
      await onConfirmar(tramite.id, observacionFinal);
      onClose();
    } finally {
      setProcesando(false);
    }
  };

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Cabecera con botón de cierre */}
        <div className="relative pt-6 px-6 pb-2 text-center">
          <button
            type="button"
            onClick={onClose}
            disabled={procesando}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ícono de confirmación con checkmark animado */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center relative mb-3">
            <FileCheck className="w-10 h-10 text-emerald-600" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <h3 className="text-lg font-black text-slate-800 leading-snug">
            ¿Confirmas que este trámite ya está concluido y entregado?
          </h3>
          <p className="text-xs text-slate-500 mt-2 px-2 leading-relaxed">
            Al finalizar, se registrará la fecha y hora de entrega y el trámite pasará a estado{' '}
            <strong className="text-emerald-700">FINALIZADO</strong>.
          </p>
        </div>

        {/* Resumen del trámite a finalizar */}
        <div className="px-6 py-3">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            {/* Usuario y CI */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-segip-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {getIniciales(tramite.nombreCompleto)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {tramite.nombreCompleto}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  C.I. {tramite.cedulaIdentidad}
                </p>
              </div>
            </div>

            {/* Ficha técnica compacta */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[11px]">Modalidad</span>
                <span className="font-semibold text-slate-700">{tramite.modalidad}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Delegado</span>
                <span className="font-semibold text-slate-700">{tramite.delegado}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">Corrección</span>
                <span className="font-medium text-slate-800">{tramite.queEstaCorrigiendo}</span>
              </div>
            </div>
          </div>

          {/* Observación opcional al finalizar */}
          <div className="mt-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Observaciones de entrega (opcional):
            </label>
            <input
              type="text"
              value={observacionFinal}
              onChange={(e) => setObservacionFinal(e.target.value)}
              placeholder="Ej. Cédula entregada al titular en ventanilla."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Mensaje de advertencia institucional */}
          <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-amber-800 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Importante:</strong> Esta acción solo debe realizarse cuando el trámite esté concluido y entregado al usuario.
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-6 pt-3 space-y-2">
          <button
            type="button"
            onClick={handleFinalizar}
            disabled={procesando}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {procesando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registrando finalización...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Sí, finalizar trámite</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={procesando}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
