import React, { useState } from 'react';
import { Clock, CheckCircle2, Check, Eye, MoreVertical, ChevronLeft, ChevronRight, EyeOff } from 'lucide-react';
import { Tramite } from '../../types';

interface TramitesTableProps {
  tramites: Tramite[];
  onVerDetalle: (tramite: Tramite) => void;
  onFinalizar: (tramite: Tramite) => void;
}

export const TramitesTable: React.FC<TramitesTableProps> = ({
  tramites,
  onVerDetalle,
  onFinalizar,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamanoPagina, setTamanoPagina] = useState(10);
  const [enmascararCI, setEnmascararCI] = useState(true);

  // Paginación
  const totalRegistros = tramites.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / tamanoPagina));

  const inicio = (paginaActual - 1) * tamanoPagina;
  const fin = Math.min(inicio + tamanoPagina, totalRegistros);
  const tramitesPaginados = tramites.slice(inicio, fin);

  const irAPagina = (p: number) => {
    if (p >= 1 && p <= totalPaginas) {
      setPaginaActual(p);
    }
  };

  const formatearCI = (ci: string) => {
    if (!enmascararCI) return ci;
    if (ci.length <= 2) return ci;
    return `*******${ci.slice(-1)}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Barra de opciones de tabla */}
      <div className="px-6 py-3.5 bg-slate-50/50 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">Listado institucional</span>
          <span className="text-slate-300">•</span>
          <span>{totalRegistros} trámites encontrados</span>
        </div>

        <button
          type="button"
          onClick={() => setEnmascararCI(!enmascararCI)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors font-medium text-[11px]"
          title="Alternar privacidad de cédulas de identidad"
        >
          {enmascararCI ? (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Mostrar C.I. completa</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Enmascarar C.I.</span>
            </>
          )}
        </button>
      </div>

      {/* Tabla con scroll horizontal contenido */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-16 text-center">N.º</th>
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">C.I.</th>
              <th className="py-3 px-4">Modalidad</th>
              <th className="py-3 px-4">¿Qué está corrigiendo?</th>
              <th className="py-3 px-4">Delegado</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {tramitesPaginados.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-sm text-slate-600">No se encontraron trámites</p>
                  <p className="text-xs mt-1">Ajuste los filtros de búsqueda o registre un nuevo trámite.</p>
                </td>
              </tr>
            ) : (
              tramitesPaginados.map((item) => {
                const esPendiente = item.estado === 'PENDIENTE';
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Número correlativo */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">
                      {item.numero}
                    </td>

                    {/* Nombre del Usuario */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block text-xs hover:text-segip-700 cursor-pointer" onClick={() => onVerDetalle(item)}>
                        {item.nombreCompleto}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Recibido: {item.fechaRecepcion.split(' ')[0]}
                      </span>
                    </td>

                    {/* Cédula de Identidad */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                      {formatearCI(item.cedulaIdentidad)}
                    </td>

                    {/* Modalidad */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          item.modalidad === 'Consolidado'
                            ? 'bg-blue-100/70 text-segip-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.modalidad}
                      </span>
                    </td>

                    {/* Qué está corrigiendo */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-medium line-clamp-1" title={item.queEstaCorrigiendo}>
                        {item.queEstaCorrigiendo}
                      </span>
                    </td>

                    {/* Delegado */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {item.delegado}
                    </td>

                    {/* Estado con etiquetas diferenciadas */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {esPendiente ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          PENDIENTE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          FINALIZADO
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {esPendiente ? (
                          <button
                            type="button"
                            onClick={() => onFinalizar(item)}
                            className="px-3 py-1.5 bg-segip-700 hover:bg-segip-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                            title="Finalizar trámite"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Finalizar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onVerDetalle(item)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                            title="Ver detalles del trámite finalizado"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver detalle</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onVerDetalle(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Más opciones"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Barra de Paginación */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>
            Mostrando {totalRegistros > 0 ? inicio + 1 : 0} a {fin} de {totalRegistros} trámites
          </span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <span>Mostrar:</span>
            <select
              value={tamanoPagina}
              onChange={(e) => {
                setTamanoPagina(Number(e.target.value));
                setPaginaActual(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Botones de navegación numérica */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => irAPagina(paginaActual - 1)}
            disabled={paginaActual <= 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - paginaActual) <= 2)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const mostrarPuntos = prev && p - prev > 1;
              return (
                <React.Fragment key={p}>
                  {mostrarPuntos && <span className="px-1 text-slate-400">...</span>}
                  <button
                    type="button"
                    onClick={() => irAPagina(p)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                      paginaActual === p
                        ? 'bg-segip-700 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            type="button"
            onClick={() => irAPagina(paginaActual + 1)}
            disabled={paginaActual >= totalPaginas}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
