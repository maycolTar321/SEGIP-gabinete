import React, { useState } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import { MobileTramiteCard } from './MobileTramiteCard';
import type { Tramite, ModalidadTramite, DelegadoTramite, EstadoTramite } from '../../types';

interface MobileTramitesListViewProps {
  onVerDetalle: (tramite: Tramite) => void;
}

export const MobileTramitesListView: React.FC<MobileTramitesListViewProps> = ({ onVerDetalle }) => {
  const { tramitesFiltrados, filtros, setFiltros, estadisticas } = useTramites();
  const [mostrarModalidadDropdown, setMostrarModalidadDropdown] = useState(false);
  const [mostrarDelegadoDropdown, setMostrarDelegadoDropdown] = useState(false);
  const [mostrarFiltrosMas, setMostrarFiltrosMas] = useState(false);

  const setEstadoChip = (est: 'TODOS' | EstadoTramite) => {
    setFiltros((prev) => ({ ...prev, estado: est }));
  };

  return (
    <div className="space-y-3.5 pb-24 p-4 max-w-md mx-auto select-none">
      {/* Título de la sección */}
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
          Trámites
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Lista de saneamiento de datos
        </p>
      </div>

      {/* Buscador de texto adaptado para móvil */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filtros.busqueda}
          onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
          placeholder="Buscar por nombre o C.I."
          className="w-full pl-9 pr-8 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-segip-500 text-slate-800 shadow-2xs placeholder:text-slate-400"
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

      {/* Chips de filtro rápido por Estado (Todos, Pendientes, Finalizados) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setEstadoChip('TODOS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
            filtros.estado === 'TODOS'
              ? 'bg-segip-700 text-white shadow-md shadow-blue-900/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos ({estadisticas.total})
        </button>

        <button
          type="button"
          onClick={() => setEstadoChip('PENDIENTE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
            filtros.estado === 'PENDIENTE'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-900/20'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          Pendientes ({estadisticas.pendientes})
        </button>

        <button
          type="button"
          onClick={() => setEstadoChip('FINALIZADO')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
            filtros.estado === 'FINALIZADO'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          Finalizados ({estadisticas.finalizados})
        </button>
      </div>

      {/* Fila de filtros desplegables secundarios: Modalidad ▾, Delegado ▾, Más filtros ▾ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 relative no-scrollbar">
        {/* Selector Modalidad */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMostrarModalidadDropdown(!mostrarModalidadDropdown);
              setMostrarDelegadoDropdown(false);
              setMostrarFiltrosMas(false);
            }}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors ${
              filtros.modalidad !== 'TODAS'
                ? 'bg-blue-50 border-segip-400 text-segip-800'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <span>{filtros.modalidad === 'TODAS' ? 'Modalidad' : filtros.modalidad}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {mostrarModalidadDropdown && (
            <div className="absolute left-0 mt-1 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
              {(['TODAS', 'Consolidado', 'No consolidado'] as const).map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => {
                    setFiltros((prev) => ({ ...prev, modalidad: mod }));
                    setMostrarModalidadDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold ${
                    filtros.modalidad === mod ? 'bg-blue-50 text-segip-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mod === 'TODAS' ? 'Todas' : mod}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selector Delegado */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMostrarDelegadoDropdown(!mostrarDelegadoDropdown);
              setMostrarModalidadDropdown(false);
              setMostrarFiltrosMas(false);
            }}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors ${
              filtros.delegado !== 'TODOS'
                ? 'bg-blue-50 border-segip-400 text-segip-800'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <span>{filtros.delegado === 'TODOS' ? 'Delegado' : filtros.delegado.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {mostrarDelegadoDropdown && (
            <div className="absolute left-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
              {(['TODOS', 'Maycol Ávila', 'Ximena Veliz'] as const).map((del) => (
                <button
                  key={del}
                  type="button"
                  onClick={() => {
                    setFiltros((prev) => ({ ...prev, delegado: del }));
                    setMostrarDelegadoDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold ${
                    filtros.delegado === del ? 'bg-blue-50 text-segip-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {del === 'TODOS' ? 'Todos los delegados' : del}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón Reset / Más filtros */}
        {(filtros.busqueda || filtros.modalidad !== 'TODAS' || filtros.delegado !== 'TODOS' || filtros.estado !== 'TODOS') && (
          <button
            type="button"
            onClick={() =>
              setFiltros({
                busqueda: '',
                modalidad: 'TODAS',
                delegado: 'TODOS',
                estado: 'TODOS',
              })
            }
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 shrink-0"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Listado de trámites */}
      <div className="space-y-3 pt-1">
        {tramitesFiltrados.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs">
            <p className="text-sm font-bold text-slate-700">No se encontraron trámites</p>
            <p className="text-xs text-slate-400 mt-1">Pruebe ajustando los filtros o el texto de búsqueda.</p>
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
