import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Loader2, AlertCircle, User, CreditCard, Shield, Layers, Eye, EyeOff } from 'lucide-react';
import type { Tramite, ModalidadTramite, DelegadoTramite } from '../../types';
import { DOCUMENTOS_OFICIALES, OPCIONES_SANEAMIENTO_BASE } from '../../types';
import { useTramites } from '../../context/TramitesContext';
import { formatearNombreCompleto, formatearDetalleCorreccion } from '../../utils/textUtils';

const CLAVE_ADMIN_AUTORIZADA = 'panicat123';

interface ModalEditarTramiteProps {
  tramite: Tramite | null;
  isOpen: boolean;
  onClose: () => void;
  onExito?: () => void;
}

export const ModalEditarTramite: React.FC<ModalEditarTramiteProps> = ({
  tramite,
  isOpen,
  onClose,
  onExito,
}) => {
  const { actualizarTramite } = useTramites();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [tieneComplemento, setTieneComplemento] = useState(false);
  const [complemento, setComplemento] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadTramite>('Consolidado');
  const [queEstaCorrigiendo, setQueEstaCorrigiendo] = useState('Nombres y apellidos');
  const [otroTipoSaneamiento, setOtroTipoSaneamiento] = useState('');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [documentacionPresentada, setDocumentacionPresentada] = useState<string[]>([]);
  const [delegado, setDelegado] = useState<DelegadoTramite>('Maycol Ávila');
  const [observaciones, setObservaciones] = useState('');
  const [claveAdmin, setClaveAdmin] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tramite) {
      setNombreCompleto(tramite.nombreCompleto || '');
      setCedulaIdentidad(tramite.cedulaIdentidad || '');
      setTieneComplemento(!!tramite.tieneComplemento);
      setComplemento(tramite.complemento || '');
      setModalidad(tramite.modalidad || 'Consolidado');
      setQueEstaCorrigiendo(tramite.queEstaCorrigiendo || 'Nombres y apellidos');
      setOtroTipoSaneamiento(tramite.otroTipoSaneamiento || '');
      setDetalleCorreccion(tramite.detalleCorreccion || '');
      setDocumentacionPresentada(Array.isArray(tramite.documentacionPresentada) ? tramite.documentacionPresentada : []);
      setDelegado(tramite.delegado || 'Maycol Ávila');
      setObservaciones(tramite.observaciones || '');
      setError(null);
    }
  }, [tramite]);

  if (!isOpen || !tramite) return null;

  const toggleDocumento = (doc: string) => {
    setDocumentacionPresentada((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim() || !cedulaIdentidad.trim()) {
      setError('Nombre completo y cédula son obligatorios.');
      return;
    }
    if (tieneComplemento && !complemento.trim()) {
      setError('Por favor ingrese el complemento indicado.');
      return;
    }
    if (queEstaCorrigiendo === 'Otro' && !otroTipoSaneamiento.trim()) {
      setError('Especifique el tipo de saneamiento cuando selecciona "Otro".');
      return;
    }
    if (!detalleCorreccion.trim()) {
      setError('El detalle de la corrección es obligatorio.');
      return;
    }
    if (claveAdmin.trim() !== CLAVE_ADMIN_AUTORIZADA) {
      setError('Contraseña incorrecta. Se requiere la clave del Administrador para guardar cambios.');
      return;
    }

    try {
      setGuardando(true);
      setError(null);
      const tramiteActualizado: Tramite = {
        ...tramite,
        nombreCompleto: formatearNombreCompleto(nombreCompleto),
        cedulaIdentidad: cedulaIdentidad.trim(),
        tieneComplemento,
        complemento: tieneComplemento ? complemento.trim().toUpperCase() : '',
        modalidad,
        queEstaCorrigiendo,
        otroTipoSaneamiento: queEstaCorrigiendo === 'Otro' ? otroTipoSaneamiento.trim() : undefined,
        detalleCorreccion: formatearDetalleCorreccion(detalleCorreccion),
        documentacionPresentada,
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
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
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
                Modificación autorizada exclusivamente para el Administrador
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nombre y CI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nombre Completo del Ciudadano *
              </label>
              <input
                type="text"
                required
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                onBlur={(e) => setNombreCompleto(formatearNombreCompleto(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Cédula de Identidad *
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={cedulaIdentidad}
                onChange={(e) => setCedulaIdentidad(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
              />
            </div>
          </div>

          {/* Switch de Complemento */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800 block">¿Tiene complemento?</span>
              <span className="text-[10px] text-slate-500">Ejemplo: 1A, CH</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTieneComplemento(!tieneComplemento);
                  if (tieneComplemento) setComplemento('');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  tieneComplemento ? 'bg-segip-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tieneComplemento ? 'Sí tiene' : 'No tiene'}
              </button>
              {tieneComplemento && (
                <input
                  type="text"
                  maxLength={5}
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value.toUpperCase())}
                  placeholder="Comp."
                  className="w-20 px-2.5 py-1 bg-white border border-segip-400 rounded-lg text-xs font-bold text-segip-900"
                />
              )}
            </div>
          </div>

          {/* Modalidad y Delegado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Modalidad *
              </label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value as ModalidadTramite)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
              >
                <option value="Consolidado">Consolidado</option>
                <option value="No consolidado">No consolidado</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Delegado Responsable *
              </label>
              <select
                value={delegado}
                onChange={(e) => setDelegado(e.target.value as DelegadoTramite)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
              >
                <option value="Maycol Ávila">Maycol Ávila</option>
                <option value="Ximena Veliz">Ximena Veliz</option>
              </select>
            </div>
          </div>

          {/* Tipo de Saneamiento */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              ¿Qué está corrigiendo? *
            </label>
            <select
              value={queEstaCorrigiendo}
              onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
            >
              {OPCIONES_SANEAMIENTO_BASE.map((opc) => (
                <option key={opc} value={opc}>
                  {opc}
                </option>
              ))}
            </select>
          </div>

          {queEstaCorrigiendo === 'Otro' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Especifique el tipo de saneamiento *
              </label>
              <input
                type="text"
                required
                value={otroTipoSaneamiento}
                onChange={(e) => setOtroTipoSaneamiento(e.target.value)}
                placeholder="Describa el tipo de corrección"
                className="w-full px-3 py-2 bg-white border border-segip-300 rounded-xl font-medium text-slate-800"
              />
            </div>
          )}

          {/* Detalle */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Detalle de la corrección *
            </label>
            <textarea
              rows={2}
              maxLength={200}
              required
              value={detalleCorreccion}
              onChange={(e) => setDetalleCorreccion(e.target.value)}
              onBlur={(e) => setDetalleCorreccion(formatearDetalleCorreccion(e.target.value))}
              placeholder="Detalle de la corrección"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 resize-none"
            />
          </div>

          {/* Checklist de 8 Documentos Oficiales */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 uppercase tracking-wide">
                DOCUMENTACIÓN PRESENTADA
              </span>
              <span className="text-[10px] font-bold text-segip-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {documentacionPresentada.length} / 8 seleccionados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DOCUMENTOS_OFICIALES.map((doc, idx) => {
                const seleccionado = documentacionPresentada.includes(doc);
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => toggleDocumento(doc)}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                      seleccionado
                        ? 'bg-blue-50 border-segip-500 text-segip-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-[11px] truncate pr-1">
                      <span className="text-slate-400 mr-1">{idx + 1}.</span>
                      {doc}
                    </span>
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                        seleccionado ? 'bg-segip-600 border-segip-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {seleccionado && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Observaciones (opcional)
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas u observaciones"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          {/* Autorización requerida para Administrador */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3.5 space-y-1.5 text-left">
            <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Clave de Autorización (Administrador)</span>
            </label>
            <div className="relative">
              <input
                type={mostrarClave ? 'text' : 'password'}
                value={claveAdmin}
                onChange={(e) => {
                  setClaveAdmin(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ingrese clave para autorizar cambios"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono pr-8"
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                {mostrarClave ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-amber-800">
              Esta modificación requiere la clave del Administrador para impactar en Google Sheets.
            </p>
          </div>

          {/* Acciones */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2.5 rounded-xl bg-segip-700 hover:bg-segip-800 text-white font-bold text-xs flex items-center gap-2 active:scale-95 shadow-md shadow-blue-900/20 disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
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
