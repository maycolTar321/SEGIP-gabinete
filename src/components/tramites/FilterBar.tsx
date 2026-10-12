import React from 'react';
import { Search, Plus, FilterX } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { ModalidadTramite, DelegadoTramite, EstadoTramite } from '../../types';

interface FilterBarProps {
  onAbrirNuevo: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onAbrirNuevo }) => {
  const { filtros, setFiltros } = useTramites();

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      modalidad: 'TODAS',
      delegado: 'TODOS',
      estado: 'TODOS',
    });
  };

  const hayFiltrosActivos =
    filtros.busqueda !== '' ||
    filtros.modalidad !== 'TODAS' ||
    filtros.delegado !== 'TODOS' ||
    filtros.estado !== 'TODOS';

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Grupo de búsqueda y selectores */}
      <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        {/* Buscador de texto */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filtros.busqueda}
            onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
            placeholder="Buscar por nombre o C.I."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-segip-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filtro Modalidad */}
        <div className="min-w-[140px]">
          <select
            value={filtros.modalidad}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, modalidad: e.target.value as 'TODAS' | ModalidadTramite }))
            }
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-segip-500 transition-all cursor-pointer"
          >
            <option value="TODAS">Modalidad: Todas</option>
            <option value="Consolidado">Consolidado</option>
            <option value="No consolidado">No consolidado</option>
          </select>
        </div>

        {/* Filtro Delegado */}
        <div className="min-w-[150px]">
          <select
            value={filtros.delegado}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, delegado: e.target.value as 'TODOS' | DelegadoTramite }))
            }
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-segip-500 transition-all cursor-pointer"
          >
            <option value="TODOS">Delegado: Todos</option>
            <option value="Maycol Ávila">Maycol Ávila</option>
            <option value="Ximena Veliz">Ximena Veliz</option>
          </select>
        </div>

        {/* Filtro Estado */}
        <div className="min-w-[140px]">
          <select
            value={filtros.estado}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, estado: e.target.value as 'TODOS' | EstadoTramite }))
            }
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-segip-500 transition-all cursor-pointer"
          >
            <option value="TODOS">Estado: Todos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="FINALIZADO">Finalizados</option>
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={limpiarFiltros}
            className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5 self-center"
            title="Restablecer filtros"
          >
            <FilterX className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>

      {/* Botón de acción principal: Nuevo trámite */}
      <button
        type="button"
        onClick={onAbrirNuevo}
        className="px-5 py-2.5 bg-segip-700 hover:bg-segip-800 text-white rounded-xl text-sm font-bold shadow-md shadow-segip-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Nuevo trámite</span>
      </button>
    </div>
  );
};
