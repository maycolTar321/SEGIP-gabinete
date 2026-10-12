import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { MobileTramiteCard } from './MobileTramiteCard';
import type { Tramite, ModalidadTramite, DelegadoTramite, EstadoTramite } from '../../types';

interface MobileTramitesListViewProps {
  onVerDetalle: (tramite: Tramite) => void;
}

export const MobileTramitesListView: React.FC<MobileTramitesListViewProps> = ({ onVerDetalle }) => {
  const { tramitesFiltrados, filtros, setFiltros, estadisticas } = useTramites();
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  const setEstadoChip = (est: 'TODOS' | EstadoTramite) => {
    setFiltros((prev) => ({ ...prev, estado: est }));
  };

  return (
    <div className="space-y-3 pb-24 p-4">
      {/* Título de la sección */}
      <div>
        <h2 className="text-lg font-black text-slate-800 leading-tight">Trámites</h2>
        <p className="text-xs text-slate-500">Lista de saneamiento de datos</p>
      </div>

      {/* Buscador de texto adaptado para móvil */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filtros.busqueda}
            onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
            placeholder="Buscar por nombre o C.I."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 shadow-xs"
          />
          {filtros.busqueda && (
            <button
              type="button"
              onClick={() => setFiltros((prev) => ({ ...prev, busqueda: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className={`p-2.5 rounded-2xl border transition-colors shadow-xs ${
            mostrarFiltrosAvanzados
              ? 'bg-segip-700 text-white border-segip-700'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
          title="Filtros avanzados"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Chips de filtro rápido por Estado */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setEstadoChip('TODOS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            filtros.estado === 'TODOS'
              ? 'bg-segip-700 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Todos ({estadisticas.total})
        </button>

        <button
          type="button"
          onClick={() => setEstadoChip('PENDIENTE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            filtros.estado === 'PENDIENTE'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-amber-700 border border-amber-200'
          }`}
        >
          Pendientes ({estadisticas.pendientes})
        </button>

        <button
          type="button"
          onClick={() => setEstadoChip('FINALIZADO')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            filtros.estado === 'FINALIZADO'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-700 border border-emerald-200'
          }`}
        >
          Finalizados ({estadisticas.finalizados})
        </button>
      </div>

      {/* Filtros avanzados desplegables para móvil */}
      {mostrarFiltrosAvanzados && (
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Modalidad:
              </label>
              <select
                value={filtros.modalidad}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    modalidad: e.target.value as 'TODAS' | ModalidadTramite,
                  }))
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs"
              >
                <option value="TODAS">Todas</option>
                <option value="Consolidado">Consolidado</option>
                <option value="No consolidado">No consolidado</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Delegado:
              </label>
              <select
                value={filtros.delegado}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    delegado: e.target.value as 'TODOS' | DelegadoTramite,
                  }))
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs"
              >
                <option value="TODOS">Todos</option>
                <option value="Maycol Ávila">Maycol Ávila</option>
                <option value="Ximena Veliz">Ximena Veliz</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Lista de tarjetas de trámites */}
      <div className="space-y-2.5 pt-1">
        {tramitesFiltrados.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
            <p className="text-sm font-bold text-slate-700">Sin trámites que coincidan</p>
            <p className="text-xs text-slate-400 mt-1">Pruebe ajustando los filtros de búsqueda.</p>
          </div>
        ) : (
          tramitesFiltrados.map((tra) => (
            <MobileTramiteCard key={tra.id} tramite={tra} onClick={onVerDetalle} />
          ))
        )}
      </div>
    </div>
  );
};
