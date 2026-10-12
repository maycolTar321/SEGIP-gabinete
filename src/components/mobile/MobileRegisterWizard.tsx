import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, Shield, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import type { ModalidadTramite, DelegadoTramite } from '../../types';

interface MobileRegisterWizardProps {
  onCerrar: () => void;
  onExito: () => void;
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

export const MobileRegisterWizard: React.FC<MobileRegisterWizardProps> = ({ onCerrar, onExito }) => {
  const { registrarTramite } = useTramites();

  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadTramite>('Consolidado');
  const [queEstaCorrigiendo, setQueEstaCorrigiendo] = useState('Nombres y apellidos');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [delegado, setDelegado] = useState<DelegadoTramite>('Maycol Ávila');
  const [observaciones, setObservaciones] = useState('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

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
      setPaso(2);
    } else if (paso === 2) {
      if (!queEstaCorrigiendo) {
        setErrorValidacion('Debe seleccionar qué dato se está corrigiendo.');
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
        nombreCompleto: nombreCompleto.trim(),
        cedulaIdentidad: cedulaIdentidad.trim(),
        modalidad,
        queEstaCorrigiendo,
        detalleCorreccion: detalleCorreccion.trim(),
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
    setModalidad('Consolidado');
    setQueEstaCorrigiendo('Nombres y apellidos');
    setDetalleCorreccion('');
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

        <div className="w-12" /> {/* Espaciador balanceador */}
      </header>

      {/* Indicador de Pasos del Wizard (1 Datos • 2 Detalle • 3 Confirmar) */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between max-w-sm mx-auto relative">
          {/* Línea conectora base */}
          <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-slate-200 -z-0" />
          {/* Línea conectora activa */}
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

      {/* Contenido scrolleable del formulario */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full pb-28">
        {errorValidacion && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorValidacion}</div>
          </div>
        )}

        {/* =========================================================
            PASO 1: DATOS DEL CIUDADANO Y MODALIDAD
            ========================================================= */}
        {paso === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Banner fijo institucional de flujo */}
            <div className="bg-blue-50/90 border border-blue-200/80 rounded-2xl p-3 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-segip-700 text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-segip-700 block">
                  Flujo único institucional
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  Saneamiento de datos
                </span>
              </div>
            </div>

            {/* Input Nombre completo */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-segip-600" />
                  <span>Nombre completo del usuario *</span>
                </label>
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Ej. Juan Pérez Mamani"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 transition-all shadow-2xs"
                />
              </div>

              {/* Input Cédula de Identidad */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-segip-600" />
                  <span>Cédula de identidad *</span>
                </label>
                <input
                  type="text"
                  value={cedulaIdentidad}
                  onChange={(e) => setCedulaIdentidad(e.target.value)}
                  placeholder="Ej. 4154637"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 transition-all shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Selector táctil de Modalidad (Consolidado / No consolidado) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Modalidad del trámite *
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Consolidado */}
                <button
                  type="button"
                  onClick={() => setModalidad('Consolidado')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between h-24 ${
                    modalidad === 'Consolidado'
                      ? 'border-segip-600 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Modalidad A
                    </span>
                    {modalidad === 'Consolidado' && (
                      <div className="w-5 h-5 rounded-full bg-segip-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-800 block">
                      Consolidado
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      En sistema central
                    </span>
                  </div>
                </button>

                {/* No consolidado */}
                <button
                  type="button"
                  onClick={() => setModalidad('No consolidado')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between h-24 ${
                    modalidad === 'No consolidado'
                      ? 'border-segip-600 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Modalidad B
                    </span>
                    {modalidad === 'No consolidado' && (
                      <div className="w-5 h-5 rounded-full bg-segip-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-800 block">
                      No consolidado
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Requiere verificación
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PASO 2: DETALLE Y DELEGADO RESPONSABLE
            ========================================================= */}
        {paso === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              {/* Dropdown ¿Qué está corrigiendo? */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  ¿Qué está corrigiendo? *
                </label>
                <select
                  value={queEstaCorrigiendo}
                  onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 shadow-2xs"
                >
                  {OPCIONES_CORRECCION.map((opc) => (
                    <option key={opc} value={opc}>
                      {opc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Textarea Detalle de la corrección con contador 0/200 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    Detalle de la corrección *
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {detalleCorreccion.length}/200
                  </span>
                </div>
                <textarea
                  value={detalleCorreccion}
                  onChange={(e) => setDetalleCorreccion(e.target.value.slice(0, 200))}
                  placeholder="Describa el motivo o cambio específico que se está aplicando..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 shadow-2xs resize-none"
                />
              </div>
            </div>

            {/* Selector táctil de Delegado Responsable (Maycol Ávila / Ximena Veliz) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Delegado responsable *
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Maycol Ávila */}
                <button
                  type="button"
                  onClick={() => setDelegado('Maycol Ávila')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between ${
                    delegado === 'Maycol Ávila'
                      ? 'border-segip-600 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-segip-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      MA
                    </div>
                    {delegado === 'Maycol Ávila' && (
                      <div className="w-4 h-4 rounded-full bg-segip-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block">
                      Maycol Ávila
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Delegado Jurídico
                    </span>
                  </div>
                </button>

                {/* Ximena Veliz */}
                <button
                  type="button"
                  onClick={() => setDelegado('Ximena Veliz')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between ${
                    delegado === 'Ximena Veliz'
                      ? 'border-segip-600 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      XV
                    </div>
                    {delegado === 'Ximena Veliz' && (
                      <div className="w-4 h-4 rounded-full bg-segip-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block">
                      Ximena Veliz
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Delegado Jurídico
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PASO 3: CONFIRMAR Y GUARDAR
            ========================================================= */}
        {paso === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-segip-600" />
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Resumen previo al registro
                </h3>
              </div>

              {/* Ficha resumen */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Ciudadano:</span>
                  <span className="font-bold text-slate-800 text-right">{nombreCompleto}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">C.I.:</span>
                  <span className="font-mono font-bold text-slate-800">{cedulaIdentidad}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Flujo:</span>
                  <span className="font-semibold text-segip-800">Saneamiento de datos</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Modalidad:</span>
                  <span className="font-bold text-blue-700">{modalidad}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Corrección:</span>
                  <span className="font-medium text-slate-800">{queEstaCorrigiendo}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Delegado:</span>
                  <span className="font-bold text-slate-800">{delegado}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400">Estado inicial:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                    PENDIENTE
                  </span>
                </div>
              </div>

              {/* Campo de observaciones opcionales */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Observaciones iniciales (opcional)
                </label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Anotaciones complementarias..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Barra de botones de acción fijos en la parte inferior */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={limpiarFormulario}
            disabled={guardando}
            className="py-3.5 px-4 rounded-2xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all text-center"
          >
            Limpiar
          </button>

          {paso < 3 ? (
            <button
              type="button"
              onClick={avanzarPaso}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0A3871] to-[#1E6AD1] text-white text-xs font-bold shadow-md shadow-blue-900/25 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Siguiente</span>
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
          )}
        </div>
      </footer>
    </div>
  );
};
