import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import type { Tramite } from '../../types';
import { useTramites } from '../../context/TramitesContext';

interface ModalConfirmarEliminacionProps {
  tramite: Tramite | null;
  isOpen: boolean;
  onClose: () => void;
  onExito?: () => void;
}

export const ModalConfirmarEliminacion: React.FC<ModalConfirmarEliminacionProps> = ({
  tramite,
  isOpen,
  onClose,
  onExito,
}) => {
  const { eliminarTramite } = useTramites();
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tramite) return null;

  const handleEliminar = async () => {
    try {
      setEliminando(true);
      setError(null);
      const res = await eliminarTramite(tramite.id);
      if (res.success) {
        onClose();
        if (onExito) onExito();
      } else {
        setError(res.message || 'No se pudo eliminar el trámite.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al comunicarse con Google Sheets.');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="relative pt-6 px-6 pb-2 text-center">
          <button
            type="button"
            onClick={onClose}
            disabled={eliminando}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ícono de advertencia / papelera */}
          <div className="mx-auto w-18 h-18 rounded-3xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-rose-600 mb-3 shadow-inner">
            <Trash2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug px-2">
            ¿Eliminar este trámite del sistema?
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 px-2 leading-relaxed">
            Esta acción es exclusiva del <strong>Administrador</strong> y borrará permanentemente la fila en Google Sheets.
          </p>
        </div>

        {/* Ficha del registro a eliminar */}
        <div className="px-6 py-3 space-y-3">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-semibold">
              {error}
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400">N.º Correlativo:</span>
              <span className="font-mono font-black text-slate-800">{tramite.numero}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400">Ciudadano:</span>
              <span className="font-bold text-slate-800">{tramite.nombreCompleto}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400">C.I.:</span>
              <span className="font-mono font-medium text-slate-700">{tramite.cedulaIdentidad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delegado:</span>
              <span className="font-semibold text-slate-700">{tramite.delegado}</span>
            </div>
          </div>

          {/* Alerta de acción irreversible */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-amber-800 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Atención:</strong> Esta eliminación quedará registrada en el historial de auditoría del sistema.
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="p-6 pt-2 space-y-2">
          <button
            type="button"
            onClick={handleEliminar}
            disabled={eliminando}
            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {eliminando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Eliminando en Google Sheets...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>Sí, eliminar registro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={eliminando}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all active:scale-98 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
