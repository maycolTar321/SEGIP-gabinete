import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, Settings, Database, Layers, Check, Loader2, AlertCircle } from 'lucide-react';
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
        setErrorValidacion('Por favor ingrese el nombre completo del usuario.');
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
      setPaso(3);
    }
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      setErrorValidacion(null);
      await registrarTramite({
        nombreCompleto,
        cedulaIdentidad,
        modalidad,
        queEstaCorrigiendo,
        detalleCorreccion,
        delegado,
        observaciones,
      });
      onExito();
    } catch (err: any) {
      setErrorValidacion(err.message || 'Error al guardar el trámite.');
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
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden">
      {/* Cabecera superior con volver y título */}
      <div className="bg-[#0A3871] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <button
          type="button"
          onClick={onCerrar}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-xl flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Atrás</span>
        </button>

        <h2 className="text-sm font-bold tracking-tight">Registrar trámite</h2>

        <div className="w-8" />
      </div>

      {/* Stepper horizontal (1 Datos, 2 Detalle, 3 Confirmar) */}
      <div className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              paso >= 1 ? 'bg-segip-700 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            1
          </div>
          <span className={`font-semibold ${paso === 1 ? 'text-segip-800' : 'text-slate-400'}`}>
            Datos
          </span>
        </div>

        <div className="w-8 h-[2px] bg-slate-200" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              paso >= 2 ? 'bg-segip-700 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            2
          </div>
          <span className={`font-semibold ${paso === 2 ? 'text-segip-800' : 'text-slate-400'}`}>
            Detalle
          </span>
        </div>

        <div className="w-8 h-[2px] bg-slate-200" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              paso >= 3 ? 'bg-segip-700 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            3
          </div>
          <span className={`font-semibold ${paso === 3 ? 'text-segip-800' : 'text-slate-400'}`}>
            Confirmar
          </span>
        </div>
      </div>

      {/* Contenido scrolleable del formulario */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {errorValidacion && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorValidacion}</span>
          </div>
        )}

        {/* PASO 1: Datos del usuario y modalidad */}
        {paso === 1 && (
          <div className="space-y-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Datos del usuario
            </h3>

            {/* Nombre completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo del usuario <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Ingrese el nombre completo"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
                />
              </div>
            </div>

            {/* Cédula de identidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cédula de identidad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cedulaIdentidad}
                  onChange={(e) => setCedulaIdentidad(e.target.value)}
                  placeholder="Ej. 12345678"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
                />
              </div>
            </div>

            {/* Flujo informativo fijo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Flujo del trámite
              </label>
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-3">
                <Settings className="w-5 h-5 text-segip-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-segip-900">Saneamiento de datos</p>
                  <p className="text-[10px] text-segip-600">Tipo de trámite único para todos los registros.</p>
                </div>
              </div>
            </div>

            {/* Modalidad táctil */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Modalidad <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalidad('Consolidado')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    modalidad === 'Consolidado'
                      ? 'border-segip-700 bg-segip-50 text-segip-900 font-bold ring-2 ring-segip-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Database className="w-4 h-4 text-segip-700" />
                  <span className="text-xs">Consolidado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalidad('No consolidado')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    modalidad === 'No consolidado'
                      ? 'border-segip-700 bg-segip-50 text-segip-900 font-bold ring-2 ring-segip-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Layers className="w-4 h-4 text-segip-700" />
                  <span className="text-xs">No consolidado</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Corrección y delegado */}
        {paso === 2 && (
          <div className="space-y-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detalle del trámite
            </h3>

            {/* ¿Qué está corrigiendo? */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿Qué está corrigiendo? <span className="text-rose-500">*</span>
              </label>
              <select
                value={queEstaCorrigiendo}
                onChange={(e) => setQueEstaCorrigiendo(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500"
              >
                {OPCIONES_CORRECCION.map((opc) => (
                  <option key={opc} value={opc}>
                    {opc}
                  </option>
                ))}
              </select>
            </div>

            {/* Detalle de la corrección */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Detalle de la corrección
                </label>
                <span className="text-[10px] text-slate-400">{detalleCorreccion.length}/200</span>
              </div>
              <textarea
                maxLength={200}
                rows={3}
                value={detalleCorreccion}
                onChange={(e) => setDetalleCorreccion(e.target.value)}
                placeholder="Especifique qué dato se debe corregir (si es necesario)"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 resize-none"
              />
            </div>

            {/* Licenciado delegado táctil */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Licenciado delegado <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['Maycol Ávila', 'Ximena Veliz'] as DelegadoTramite[]).map((del) => {
                  const esSel = delegado === del;
                  return (
                    <button
                      key={del}
                      type="button"
                      onClick={() => setDelegado(del)}
                      className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                        esSel
                          ? 'border-segip-700 bg-segip-50 text-segip-900 font-bold ring-2 ring-segip-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          esSel ? 'bg-segip-700 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {del.charAt(0)}
                      </div>
                      <span className="text-xs">{del}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: Confirmación previa y observaciones */}
        {paso === 3 && (
          <div className="space-y-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Confirmar registro
            </h3>

            {/* Ficha resumen */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Usuario:</span>
                <span className="font-bold text-slate-800 text-right">{nombreCompleto}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">C.I.:</span>
                <span className="font-mono font-bold text-slate-800">{cedulaIdentidad}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Modalidad:</span>
                <span className="font-semibold text-slate-800">{modalidad}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Corrección:</span>
                <span className="font-semibold text-slate-800 text-right">{queEstaCorrigiendo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delegado:</span>
                <span className="font-semibold text-slate-800">{delegado}</span>
              </div>
            </div>

            {/* Observaciones adicionales */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observaciones adicionales (opcional):
              </label>
              <input
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej. Trámite prioritario con respaldo SERECI"
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-800">
              <strong>Nota:</strong> Todo nuevo trámite iniciará automáticamente en estado <strong>PENDIENTE</strong>.
            </div>
          </div>
        )}
      </div>

      {/* Barra de botones inferior fija */}
      <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between gap-3">
        {paso === 1 ? (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            Limpiar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPaso((prev) => (prev > 1 ? ((prev - 1) as any) : 1))}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold"
          >
            Anterior
          </button>
        )}

        {paso < 3 ? (
          <button
            type="button"
            onClick={avanzarPaso}
            className="flex-1 py-3.5 bg-segip-700 hover:bg-segip-800 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-900/20 active:scale-98 transition-all text-center"
          >
            Siguiente →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar y Guardar</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
