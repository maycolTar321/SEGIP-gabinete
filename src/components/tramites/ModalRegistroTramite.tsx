import React, { useState } from 'react';
import { X, User, CreditCard, Shield, Layers, Check, AlertCircle, Loader2, FileCheck } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { ModalidadTramite, DelegadoTramite, DOCUMENTOS_OFICIALES, OPCIONES_SANEAMIENTO_BASE } from '../../types';
import { formatearNombreCompleto, formatearDetalleCorreccion } from '../../utils/textUtils';

interface ModalRegistroTramiteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalRegistroTramite: React.FC<ModalRegistroTramiteProps> = ({ isOpen, onClose }) => {
  const { registrarTramite } = useTramites();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [tieneComplemento, setTieneComplemento] = useState(false);
  const [complemento, setComplemento] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadTramite>('Consolidado');
  const [queEstaCorrigiendo, setQueEstaCorrigiendo] = useState<string>('Nombres y apellidos');
  const [otroTipoSaneamiento, setOtroTipoSaneamiento] = useState('');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [documentacionPresentada, setDocumentacionPresentada] = useState<string[]>([]);
  const [delegado, setDelegado] = useState<DelegadoTramite>('Maycol Ávila');
  const [observaciones, setObservaciones] = useState('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  if (!isOpen) return null;

  const toggleDocumento = (doc: string) => {
    setDocumentacionPresentada((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!nombreCompleto.trim()) {
      setErrorValidacion('El nombre completo del usuario es obligatorio.');
      return;
    }
    if (!cedulaIdentidad.trim()) {
      setErrorValidacion('La cédula de identidad es obligatoria.');
      return;
    }
    if (tieneComplemento && !complemento.trim()) {
      setErrorValidacion('Ha indicado que tiene complemento. Ingrese el valor del complemento.');
      return;
    }
    if (queEstaCorrigiendo === 'Otro' && !otroTipoSaneamiento.trim()) {
      setErrorValidacion('Debe especificar el tipo de saneamiento cuando selecciona "Otro".');
      return;
    }
    if (!detalleCorreccion.trim()) {
      setErrorValidacion('Debe ingresar el detalle de la corrección.');
      return;
    }

    try {
      setGuardando(true);
      await registrarTramite({
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
      });

      // Limpiar formulario y cerrar
      setNombreCompleto('');
      setCedulaIdentidad('');
      setTieneComplemento(false);
      setComplemento('');
      setModalidad('Consolidado');
      setQueEstaCorrigiendo('Nombres y apellidos');
      setOtroTipoSaneamiento('');
      setDetalleCorreccion('');
      setDocumentacionPresentada([]);
      setDelegado('Maycol Ávila');
      setObservaciones('');
      onClose();
    } catch (err: any) {
      setErrorValidacion(err.message || 'Error al registrar el trámite.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Encabezado */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Registrar nuevo trámite
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulario oficial de saneamiento de datos - Gabinete Jurídico
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorValidacion && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorValidacion}</span>
            </div>
          )}

          {/* Sección 1: Datos del Ciudadano */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-segip-600" />
              Datos del usuario
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre completo del usuario <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    onBlur={(e) => setNombreCompleto(formatearNombreCompleto(e.target.value))}
                    placeholder="Ej. Juan Carlos Mamani Quispe"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cédula de identidad <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={cedulaIdentidad}
                    onChange={(e) => setCedulaIdentidad(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ej. 12345678"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Switch de Complemento */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  ¿Tiene complemento?
                </span>
                <span className="text-[10px] text-slate-500">
                  Ejemplo: 1A, CH, LP (solo si la cédula lo requiere)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setTieneComplemento(false);
                      setComplemento('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      !tieneComplemento ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setTieneComplemento(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      tieneComplemento ? 'bg-segip-700 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Sí
                  </button>
                </div>

                {tieneComplemento && (
                  <input
                    type="text"
                    maxLength={5}
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value.toUpperCase())}
                    placeholder="Comp. (Ej. 1A)"
                    className="w-28 px-2.5 py-1.5 bg-white border border-segip-300 rounded-xl text-xs font-bold text-segip-900 focus:outline-none focus:ring-2 focus:ring-segip-500 shadow-2xs"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sección 2: Flujo y Modalidad */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-segip-600" />
              Parámetros institucionales
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-segip-700 text-white flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-segip-900">Saneamiento de datos</div>
                  <div className="text-[10px] text-segip-700">Flujo único institucional</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Modalidad <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModalidad('Consolidado')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      modalidad === 'Consolidado'
                        ? 'bg-segip-700 text-white border-segip-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Consolidado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalidad('No consolidado')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      modalidad === 'No consolidado'
                        ? 'bg-segip-700 text-white border-segip-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 opacity-70" />
                    <span>No consolidado</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Datos de la Corrección */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Datos de la corrección
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ¿Qué está corrigiendo? <span className="text-rose-500">*</span>
                </label>
                <select
                  value={queEstaCorrigiendo}
                  onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
                >
                  {OPCIONES_SANEAMIENTO_BASE.map((opc) => (
                    <option key={opc} value={opc}>
                      {opc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Licenciado delegado <span className="text-rose-500">*</span>
                </label>
                <select
                  value={delegado}
                  onChange={(e) => setDelegado(e.target.value as DelegadoTramite)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
                >
                  <option value="Maycol Ávila">Maycol Ávila</option>
                  <option value="Ximena Veliz">Ximena Veliz</option>
                </select>
              </div>
            </div>

            {queEstaCorrigiendo === 'Otro' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Especifique el tipo de saneamiento <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={otroTipoSaneamiento}
                  onChange={(e) => setOtroTipoSaneamiento(e.target.value)}
                  placeholder="Describa el tipo de corrección solicitado"
                  className="w-full px-3 py-2 bg-white border border-segip-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-segip-500 shadow-2xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detalle de la corrección <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                maxLength={200}
                required
                value={detalleCorreccion}
                onChange={(e) => setDetalleCorreccion(e.target.value)}
                onBlur={(e) => setDetalleCorreccion(formatearDetalleCorreccion(e.target.value))}
                placeholder="Especifique qué dato se debe corregir (ej. Corrección de nombre en registro civil)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 resize-none"
              />
            </div>
          </div>

          {/* Sección 4: Checklist de 8 Documentos Oficiales */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  DOCUMENTACIÓN PRESENTADA
                </h4>
                <p className="text-[10px] text-slate-500">
                  Marque los documentos físicos presentados por el ciudadano
                </p>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-segip-800 border border-blue-200">
                {documentacionPresentada.length} / 8 seleccionados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {DOCUMENTOS_OFICIALES.map((doc, idx) => {
                const seleccionado = documentacionPresentada.includes(doc);
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => toggleDocumento(doc)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      seleccionado
                        ? 'bg-blue-50/80 border-segip-500 text-segip-900 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px] font-semibold truncate leading-tight pr-2">
                      <span className="text-slate-400 font-mono mr-1.5">{idx + 1}.</span>
                      {doc}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                        seleccionado ? 'bg-segip-600 border-segip-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {seleccionado && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones (opcional)
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalles complementarios"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
            />
          </div>

          {/* Pie del modal con acciones */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2.5 bg-gradient-to-r from-[#0A3871] to-[#1E6AD1] text-white rounded-xl text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Registrar trámite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
