import React, { useState } from 'react';
import { X, User, CreditCard, Shield, Database, Layers, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { ModalidadTramite, DelegadoTramite } from '../../types';

interface ModalRegistroTramiteProps {
  isOpen: boolean;
  onClose: () => void;
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

export const ModalRegistroTramite: React.FC<ModalRegistroTramiteProps> = ({ isOpen, onClose }) => {
  const { registrarTramite } = useTramites();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadTramite>('Consolidado');
  const [queEstaCorrigiendo, setQueEstaCorrigiendo] = useState('Nombres y apellidos');
  const [otroCampo, setOtroCampo] = useState('');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [delegado, setDelegado] = useState<DelegadoTramite>('Maycol Ávila');
  const [observaciones, setObservaciones] = useState('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  if (!isOpen) return null;

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

    const campoCorreccionFinal =
      queEstaCorrigiendo === 'Otro dato biográfico' && otroCampo.trim()
        ? `Otro: ${otroCampo.trim()}`
        : queEstaCorrigiendo;

    if (!campoCorreccionFinal) {
      setErrorValidacion('Debe especificar qué está corrigiendo.');
      return;
    }

    try {
      setGuardando(true);
      await registrarTramite({
        nombreCompleto,
        cedulaIdentidad,
        modalidad,
        queEstaCorrigiendo: campoCorreccionFinal,
        detalleCorreccion,
        delegado,
        observaciones,
      });

      // Limpiar formulario y cerrar
      setNombreCompleto('');
      setCedulaIdentidad('');
      setModalidad('Consolidado');
      setQueEstaCorrigiendo('Nombres y apellidos');
      setOtroCampo('');
      setDetalleCorreccion('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
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
                    placeholder="Ej. Juan Carlos Mamani Quispe"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
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
                    required
                    value={cedulaIdentidad}
                    onChange={(e) => setCedulaIdentidad(e.target.value)}
                    placeholder="Ej. 4928172"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Flujo y Modalidad */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-segip-600" />
              Flujo y modalidad
            </h4>

            {/* Flujo único informativo */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-segip-900 block">Flujo: Saneamiento de datos</span>
                <span className="text-[11px] text-segip-600">Tipo de trámite institucional único</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-segip-600 text-white rounded-lg shadow-xs">
                Estándar
              </span>
            </div>

            {/* Selector de Modalidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Modalidad del trámite <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalidad('Consolidado')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    modalidad === 'Consolidado'
                      ? 'border-segip-600 bg-segip-50/50 text-segip-800 shadow-xs ring-1 ring-segip-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${modalidad === 'Consolidado' ? 'bg-segip-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Consolidado</p>
                    <p className="text-[11px] text-slate-400">Datos consolidados</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModalidad('No consolidado')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    modalidad === 'No consolidado'
                      ? 'border-segip-600 bg-segip-50/50 text-segip-800 shadow-xs ring-1 ring-segip-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${modalidad === 'No consolidado' ? 'bg-segip-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">No consolidado</p>
                    <p className="text-[11px] text-slate-400">Sin consolidar</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sección 3: Corrección requerida */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿Qué está corrigiendo? <span className="text-rose-500">*</span>
              </label>
              <select
                value={queEstaCorrigiendo}
                onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
              >
                {OPCIONES_CORRECCION.map((opc) => (
                  <option key={opc} value={opc}>
                    {opc}
                  </option>
                ))}
              </select>
            </div>

            {queEstaCorrigiendo === 'Otro dato biográfico' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Especifique el campo:
                </label>
                <input
                  type="text"
                  value={otroCampo}
                  onChange={(e) => setOtroCampo(e.target.value)}
                  placeholder="Ej. Fotografía o huella ilegible"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Detalle de la corrección
                </label>
                <span className="text-[11px] text-slate-400">
                  {detalleCorreccion.length}/200
                </span>
              </div>
              <textarea
                maxLength={200}
                rows={2}
                value={detalleCorreccion}
                onChange={(e) => setDetalleCorreccion(e.target.value)}
                placeholder="Especifique qué dato se debe corregir (ej. error tipográfico en segundo apellido según certificado)..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 resize-none"
              />
            </div>
          </div>

          {/* Sección 4: Delegado asignado */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Licenciado delegado asignado <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Maycol Ávila', 'Ximena Veliz'] as DelegadoTramite[]).map((del) => {
                const esSeleccionado = delegado === del;
                return (
                  <button
                    key={del}
                    type="button"
                    onClick={() => setDelegado(del)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                      esSeleccionado
                        ? 'border-segip-600 bg-segip-50/50 text-segip-800 shadow-xs ring-1 ring-segip-500 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        esSeleccionado ? 'bg-segip-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {del.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs">{del}</p>
                      <p className="text-[11px] text-slate-400">Operador Jurídico</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observaciones generales */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones adicionales
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej. Documentación soporte presentada en fotocopia legalizada."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
            />
          </div>
        </form>

        {/* Pie con botones */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={guardando}
            className="px-6 py-2.5 bg-segip-700 hover:bg-segip-800 text-white rounded-xl text-sm font-bold shadow-md shadow-segip-900/20 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Guardar trámite</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
