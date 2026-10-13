import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, Shield, Check, Loader2, AlertCircle, Layers, FileCheck, HelpCircle } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { ModalidadTramite, DelegadoTramite, DOCUMENTOS_OFICIALES, OPCIONES_SANEAMIENTO_BASE } from '../../types';
import { formatearNombreCompleto, formatearDetalleCorreccion, formatearCIConComplemento } from '../../utils/textUtils';

interface MobileRegisterWizardProps {
  onCerrar: () => void;
  onExito: () => void;
}

export const MobileRegisterWizard: React.FC<MobileRegisterWizardProps> = ({ onCerrar, onExito }) => {
  const { registrarTramite } = useTramites();

  const [paso, setPaso] = useState<1 | 2 | 3>(1);

  // Paso 1: Datos del usuario y modalidad
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [tieneComplemento, setTieneComplemento] = useState(false);
  const [complemento, setComplemento] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadTramite>('Consolidado');

  // Paso 2: Detalle de corrección, documentación y delegado
  const [queEstaCorrigiendo, setQueEstaCorrigiendo] = useState<string>('Nombres y apellidos');
  const [otroTipoSaneamiento, setOtroTipoSaneamiento] = useState('');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [documentacionPresentada, setDocumentacionPresentada] = useState<string[]>([]);
  const [delegado, setDelegado] = useState<DelegadoTramite>('Maycol Ávila');
  const [observaciones, setObservaciones] = useState('');

  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const toggleDocumento = (doc: string) => {
    setDocumentacionPresentada((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const avanzarPaso = () => {
    setErrorValidacion(null);
    if (paso === 1) {
      if (!nombreCompleto.trim()) {
        setErrorValidacion('Por favor ingrese el nombre completo del ciudadano.');
        return;
      }
      if (!cedulaIdentidad.trim()) {
        setErrorValidacion('Por favor ingrese la cédula de identidad.');
        return;
      }
      if (tieneComplemento && !complemento.trim()) {
        setErrorValidacion('Ha indicado que tiene complemento. Por favor ingrese el valor del complemento.');
        return;
      }
      setPaso(2);
    } else if (paso === 2) {
      if (!queEstaCorrigiendo) {
        setErrorValidacion('Debe seleccionar qué dato se está corrigiendo.');
        return;
      }
      if (queEstaCorrigiendo === 'Otro' && !otroTipoSaneamiento.trim()) {
        setErrorValidacion('Debe especificar el tipo de saneamiento cuando selecciona "Otro".');
        return;
      }
      if (!detalleCorreccion.trim()) {
        setErrorValidacion('Por favor ingrese el detalle de la corrección.');
        return;
      }
      setPaso(3);
    }
  };

  const retrocederPaso = () => {
    setErrorValidacion(null);
    if (paso === 3) setPaso(2);
    else if (paso === 2) setPaso(1);
    else onCerrar();
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      setErrorValidacion(null);
      const res = await registrarTramite({
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
      if (res.success) {
        onExito();
      } else {
        setErrorValidacion(res.message || 'Error al guardar el trámite.');
      }
    } catch (err: any) {
      setErrorValidacion(err.message || 'Error de conexión al registrar trámite.');
    } finally {
      setGuardando(false);
    }
  };

  const limpiarFormulario = () => {
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
    setPaso(1);
    setErrorValidacion(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden select-none animate-in fade-in duration-150">
      {/* Cabecera superior institucional */}
      <header className="bg-gradient-to-r from-[#0A3871] to-[#042450] text-white px-4 py-3.5 flex items-center justify-between shadow-md shrink-0">
        <button
          type="button"
          onClick={retrocederPaso}
          className="p-1 -ml-1 text-white hover:bg-white/10 active:bg-white/20 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Atrás</span>
        </button>

        <h2 className="text-sm font-black tracking-tight text-white uppercase">
          Registrar Trámite
        </h2>

        <div className="w-12" />
      </header>

      {/* Indicador de Pasos del Wizard (1 Datos • 2 Detalle • 3 Confirmar) */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between max-w-sm mx-auto relative">
          <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute left-6 top-3.5 h-0.5 bg-segip-600 -z-0 transition-all duration-300"
            style={{
              width: paso === 1 ? '0%' : paso === 2 ? '50%' : '100%',
            }}
          />

          {/* Paso 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                paso >= 1
                  ? 'bg-segip-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {paso > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span
              className={`text-[10px] mt-1 font-bold ${
                paso === 1 ? 'text-segip-800' : 'text-slate-400'
              }`}
            >
              Datos
            </span>
          </div>

          {/* Paso 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                paso >= 2
                  ? 'bg-segip-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {paso > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <span
              className={`text-[10px] mt-1 font-bold ${
                paso === 2 ? 'text-segip-800' : 'text-slate-400'
              }`}
            >
              Detalle
            </span>
          </div>

          {/* Paso 3 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                paso === 3
                  ? 'bg-segip-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span
              className={`text-[10px] mt-1 font-bold ${
                paso === 3 ? 'text-segip-800' : 'text-slate-400'
              }`}
            >
              Confirmar
            </span>
          </div>
        </div>
      </div>

      {/* Contenido scrolleable del paso */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {errorValidacion && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">
              {errorValidacion}
            </div>
          </div>
        )}

        {/* =========================================
            PASO 1: DATOS DEL USUARIO Y MODALIDAD
            ========================================= */}
        {paso === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Datos del usuario
              </h3>

              {/* Nombre completo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Nombre completo del usuario <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    onBlur={(e) => setNombreCompleto(formatearNombreCompleto(e.target.value))}
                    placeholder="Ingrese el nombre completo"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Cédula de identidad con inputmode="numeric" */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Cédula de identidad <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={cedulaIdentidad}
                    onChange={(e) => setCedulaIdentidad(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ej. 12345678"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Interruptor de Complemento */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      ¿Tiene complemento?
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Ejemplo: 1A, CH, LP (si corresponde)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setTieneComplemento(false);
                        setComplemento('');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        !tieneComplemento
                          ? 'bg-white text-slate-800 shadow-xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setTieneComplemento(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        tieneComplemento
                          ? 'bg-segip-700 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Sí
                    </button>
                  </div>
                </div>

                {tieneComplemento && (
                  <div className="pt-2 border-t border-slate-200 animate-in fade-in slide-in-from-top-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Complemento de la cédula <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value.toUpperCase())}
                      placeholder="Ej. 1A"
                      className="w-full px-3.5 py-2.5 bg-white border border-segip-300 rounded-xl text-xs font-bold text-segip-900 focus:outline-none focus:ring-2 focus:ring-segip-500 shadow-2xs"
                    />
                  </div>
                )}
              </div>

              {/* Flujo único del trámite */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-segip-700 text-white flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs font-black text-segip-900 leading-tight">
                    Saneamiento de datos
                  </div>
                  <div className="text-[10px] text-segip-700/90 mt-0.5">
                    Flujo único institucional para todos los trámites
                  </div>
                </div>
              </div>

              {/* Modalidad */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Modalidad <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalidad('Consolidado')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      modalidad === 'Consolidado'
                        ? 'bg-segip-700 text-white border-segip-700 shadow-md shadow-blue-900/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Consolidado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalidad('No consolidado')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      modalidad === 'No consolidado'
                        ? 'bg-segip-700 text-white border-segip-700 shadow-md shadow-blue-900/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <Layers className="w-4 h-4 opacity-70" />
                    <span>No consolidado</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            PASO 2: DETALLE, DOCUMENTACIÓN Y DELEGADO
            ========================================= */}
        {paso === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Detalle del saneamiento
              </h3>

              {/* Qué está corrigiendo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  ¿Qué está corrigiendo? <span className="text-rose-500">*</span>
                </label>
                <select
                  value={queEstaCorrigiendo}
                  onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 transition-all shadow-2xs"
                >
                  {OPCIONES_SANEAMIENTO_BASE.map((opc) => (
                    <option key={opc} value={opc}>
                      {opc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo para "Otro" tipo de saneamiento */}
              {queEstaCorrigiendo === 'Otro' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Especifique el tipo de saneamiento <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={otroTipoSaneamiento}
                    onChange={(e) => setOtroTipoSaneamiento(e.target.value)}
                    placeholder="Describa el tipo de corrección solicitado"
                    className="w-full px-4 py-3 bg-white border border-segip-300 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-segip-500 shadow-2xs"
                  />
                </div>
              )}

              {/* Detalle de la corrección */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    Detalle de la corrección <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {detalleCorreccion.length}/200
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={detalleCorreccion}
                  onChange={(e) => setDetalleCorreccion(e.target.value)}
                  onBlur={(e) => setDetalleCorreccion(formatearDetalleCorreccion(e.target.value))}
                  placeholder="Especifique qué dato se debe corregir (ej. Corrección de apellido en registro civil)"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 transition-all resize-none shadow-2xs"
                />
              </div>

              {/* CHECKLIST DE DOCUMENTACIÓN PRESENTADA (8 DOCUMENTOS) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-black text-slate-800 block uppercase tracking-wide">
                      Documentación Presentada
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Marque las casillas de los documentos físicos presentados
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-segip-800 border border-blue-200">
                    {documentacionPresentada.length} / 8
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {DOCUMENTOS_OFICIALES.map((doc, idx) => {
                    const seleccionado = documentacionPresentada.includes(doc);
                    return (
                      <button
                        key={doc}
                        type="button"
                        onClick={() => toggleDocumento(doc)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                          seleccionado
                            ? 'bg-blue-50/80 border-segip-500 shadow-2xs text-segip-900'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-[11px] font-bold text-slate-400 font-mono shrink-0">
                            {idx + 1}.
                          </span>
                          <span className="text-xs font-semibold truncate leading-tight">
                            {doc}
                          </span>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                            seleccionado
                              ? 'bg-segip-600 border-segip-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {seleccionado && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delegado Responsable */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Licenciado delegado <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDelegado('Maycol Ávila')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      delegado === 'Maycol Ávila'
                        ? 'bg-segip-700 text-white border-segip-700 shadow-md shadow-blue-900/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Maycol Ávila</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDelegado('Ximena Veliz')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      delegado === 'Ximena Veliz'
                        ? 'bg-segip-700 text-white border-segip-700 shadow-md shadow-blue-900/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Ximena Veliz</span>
                  </button>
                </div>
              </div>

              {/* Observaciones adicionales opcionales */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Observaciones (opcional)
                </label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles administrativos u observaciones"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            PASO 3: CONFIRMAR DATOS
            ========================================= */}
        {paso === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck className="w-5 h-5 text-segip-600" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Revisión y confirmación del expediente
                </h3>
              </div>

              {/* Resumen de Datos */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Ciudadano</span>
                  <span className="font-extrabold text-slate-900 text-right">
                    {formatearNombreCompleto(nombreCompleto)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Cédula de identidad</span>
                  <span className="font-mono font-black text-segip-800">
                    {formatearCIConComplemento(cedulaIdentidad, tieneComplemento, complemento)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Modalidad</span>
                  <span className="font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-segip-800 border border-blue-200">
                    {modalidad}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Dato a corregir</span>
                  <span className="font-bold text-slate-800 text-right">
                    {queEstaCorrigiendo === 'Otro' ? `Otro: ${otroTipoSaneamiento}` : queEstaCorrigiendo}
                  </span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-400 block mb-1">Detalle de la corrección</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
                    {formatearDetalleCorreccion(detalleCorreccion)}
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-400">Documentos presentados</span>
                    <span className="text-[10px] font-bold text-segip-700">
                      {documentacionPresentada.length} de 8
                    </span>
                  </div>
                  {documentacionPresentada.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {documentacionPresentada.map((doc) => (
                        <span
                          key={doc}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          <Check className="w-2.5 h-2.5" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">
                      Ningún documento físico marcado.
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Delegado asignado</span>
                  <span className="font-bold text-slate-800">{delegado}</span>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <span className="text-slate-400">Estado inicial</span>
                  <span className="font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    PENDIENTE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra inferior de navegación de pasos */}
      <footer className="bg-white border-t border-slate-200 p-4 shrink-0 flex items-center justify-between gap-3 shadow-lg">
        {paso === 1 ? (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="px-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Limpiar
          </button>
        ) : (
          <button
            type="button"
            onClick={retrocederPaso}
            className="px-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Anterior
          </button>
        )}

        {paso < 3 ? (
          <button
            type="button"
            onClick={avanzarPaso}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-[#0A3871] to-[#1E6AD1] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Siguiente</span>
            <span className="text-sm">→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            className="flex-1 py-3.5 px-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 hover:bg-emerald-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registrando trámite...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar y Registrar</span>
              </>
            )}
          </button>
        )}
      </footer>
    </div>
  );
};
