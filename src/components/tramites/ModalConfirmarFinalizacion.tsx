import React, { useState } from 'react';
import { Check, X, AlertTriangle, FileCheck, Loader2 } from 'lucide-react';
import type { Tramite } from '../../types';
import { useTramites } from '../../context/TramitesContext';

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
  const { enmascararCI } = useTramites();
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
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return (nombre.trim().slice(0, 2) || 'CI').toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Cabecera con botón de cierre e ícono oficial */}
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
          <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center relative mb-3 shadow-inner">
            <FileCheck className="w-10 h-10 text-emerald-600" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug px-2">
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
              <div className="w-10 h-10 rounded-full bg-segip-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                {getIniciales(tramite.nombreCompleto)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-800 truncate">
                  {tramite.nombreCompleto}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {enmascararCI(tramite.cedulaIdentidad)}
                </p>
              </div>
            </div>

            {/* Ficha técnica compacta */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[11px]">Modalidad</span>
                <span className="font-bold text-slate-700">{tramite.modalidad}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Delegado</span>
                <span className="font-bold text-slate-700">{tramite.delegado}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">Corrección</span>
                <span className="font-medium text-slate-800">{tramite.queEstaCorrigiendo}</span>
              </div>
            </div>
          </div>

          {/* Observación opcional al finalizar */}
          <div className="mt-3 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">
              Observaciones de entrega (opcional):
            </label>
            <input
              type="text"
              value={observacionFinal}
              onChange={(e) => setObservacionFinal(e.target.value)}
              placeholder="Ej. Cédula entregada al titular en ventanilla."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700 placeholder-slate-400 shadow-2xs"
            />
          </div>

          {/* Mensaje de advertencia institucional */}
          <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-amber-800 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Advertencia:</strong> Esta acción no se puede revertir. Asegúrese de que el ciudadano haya recibido su documento.
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-6 pt-2 space-y-2">
          <button
            type="button"
            onClick={handleFinalizar}
            disabled={procesando}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {procesando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registrando finalización...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>✓ Sí, finalizar trámite</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={procesando}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all active:scale-98 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
