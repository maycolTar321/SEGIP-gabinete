import React from 'react';
import { UserCheck } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';

export const DelegateStatsPanel: React.FC = () => {
  const { estadisticas } = useTramites();

  const delegados = [
    {
      nombre: 'Maycol Ávila',
      stats: estadisticas.porDelegado['Maycol Ávila'] || { total: 0, pendientes: 0, finalizados: 0 },
    },
    {
      nombre: 'Ximena Veliz',
      stats: estadisticas.porDelegado['Ximena Veliz'] || { total: 0, pendientes: 0, finalizados: 0 },
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-segip-600" />
          <h3 className="text-sm font-bold text-slate-800">Carga por delegado</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Asignación actual</span>
      </div>

      <div className="space-y-4 mt-3">
        {delegados.map((d) => {
          const efectividad =
            d.stats.total > 0 ? Math.round((d.stats.finalizados / d.stats.total) * 100) : 0;
          return (
            <div key={d.nombre} className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{d.nombre}</span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {d.stats.finalizados}/{d.stats.total} resueltos ({efectividad}%)
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${efectividad}%` }}
                />
                <div
                  className="bg-amber-400 transition-all duration-500"
                  style={{ width: `${100 - efectividad}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {d.stats.pendientes} pendientes
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {d.stats.finalizados} finalizados
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
