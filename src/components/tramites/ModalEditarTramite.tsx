import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Loader2, AlertCircle, User, CreditCard, Shield } from 'lucide-react';
import type { Tramite, ModalidadTramite, DelegadoTramite } from '../../types';
import { useTramites } from '../../context/TramitesContext';

interface ModalEditarTramiteProps {
  tramite: Tramite | null;
  isOpen: boolean;
  onClose: () => void;
  onExito?: () => void;
}

const OPCIONES_CORRECCION = [
  'Nombres y apellidos',
  'Fecha de nacimiento',
  'Lugar de nacimiento',
  'Datos de filiación',
  'Estado civil',
  'Corrección de cédula / duplicidad',
  'Otro dato biográfico',
];

export const ModalEditarTramite: React.FC<ModalEditarTramiteProps> = ({
  tramite,
  isOpen,
  onClose,
  onExito,
}) => {
  const { actualizarTramite } = useTramites();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadTramite>('Consolidado');
  const [queEstaCorrigiendo, setQueEstaCorrigiendo] = useState('Nombres y apellidos');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [delegado, setDelegado] = useState<DelegadoTramite>('Maycol Ávila');
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tramite) {
      setNombreCompleto(tramite.nombreCompleto || '');
      setCedulaIdentidad(tramite.cedulaIdentidad || '');
      setModalidad(tramite.modalidad || 'Consolidado');
      setQueEstaCorrigiendo(tramite.queEstaCorrigiendo || 'Nombres y apellidos');
      setDetalleCorreccion(tramite.detalleCorreccion || '');
      setDelegado(tramite.delegado || 'Maycol Ávila');
      setObservaciones(tramite.observaciones || '');
      setError(null);
    }
  }, [tramite]);

  if (!isOpen || !tramite) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim() || !cedulaIdentidad.trim()) {
      setError('Nombre completo y cédula son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      setError(null);
      const tramiteActualizado: Tramite = {
        ...tramite,
        nombreCompleto: nombreCompleto.trim(),
        cedulaIdentidad: cedulaIdentidad.trim(),
        modalidad,
        queEstaCorrigiendo,
        detalleCorreccion: detalleCorreccion.trim(),
        delegado,
        observaciones: observaciones.trim(),
      };

      const res = await actualizarTramite(tramiteActualizado);
      if (res.success) {
        onClose();
        if (onExito) onExito();
      } else {
        setError(res.message || 'Error al actualizar el trámite.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error de conexión con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Encabezado */}
        <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-segip-700">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                Editar Trámite N.º {tramite.numero}
              </h3>
              <p className="text-[11px] text-slate-500">
                Modificación autorizada por Administrador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Nombre completo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-segip-600" />
              <span>Nombre completo *</span>
            </label>
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
            />
          </div>

          {/* Cédula */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-segip-600" />
              <span>Cédula de identidad *</span>
            </label>
            <input
              type="text"
              value={cedulaIdentidad}
              onChange={(e) => setCedulaIdentidad(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
            />
          </div>

          {/* Modalidad */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Modalidad
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Consolidado', 'No consolidado'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModalidad(m)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    modalidad === m
                      ? 'border-segip-600 bg-blue-50 text-segip-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* ¿Qué está corrigiendo? */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              ¿Qué está corrigiendo?
            </label>
            <select
              value={queEstaCorrigiendo}
              onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
            >
              {OPCIONES_CORRECCION.map((opc) => (
                <option key={opc} value={opc}>
                  {opc}
                </option>
              ))}
            </select>
          </div>

          {/* Detalle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Detalle de la corrección
            </label>
            <textarea
              value={detalleCorreccion}
              onChange={(e) => setDetalleCorreccion(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 resize-none"
            />
          </div>

          {/* Delegado */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Delegado responsable
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Maycol Ávila', 'Ximena Veliz'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDelegado(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    delegado === d
                      ? 'border-segip-600 bg-blue-50 text-segip-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Observaciones adicionales
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas u observaciones de control..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
            />
          </div>

          {/* Botones */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="py-3 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="py-3 px-4 rounded-xl bg-segip-700 hover:bg-segip-800 text-white text-xs font-bold shadow-md shadow-blue-900/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
