import React from 'react';
import { FileText, Clock, CheckCircle2, Database, Layers } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';

export const MetricCards: React.FC = () => {
  const { estadisticas } = useTramites();

  const cards = [
    {
      id: 'total',
      label: 'Total de trámites',
      valor: estadisticas.total,
      icon: FileText,
      iconBg: 'bg-blue-50 text-segip-600 border border-blue-100',
      textColor: 'text-segip-800',
      badge: 'Saneamiento',
      subtext: 'Flujo único',
    },
    {
      id: 'pendientes',
      label: 'Pendientes',
      valor: estadisticas.pendientes,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      textColor: 'text-amber-700',
      badge: `${estadisticas.total > 0 ? Math.round((estadisticas.pendientes / estadisticas.total) * 100) : 0}%`,
      subtext: 'En revisión o proceso',
    },
    {
      id: 'finalizados',
      label: 'Finalizados',
      valor: estadisticas.finalizados,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      textColor: 'text-emerald-700',
      badge: `${estadisticas.total > 0 ? Math.round((estadisticas.finalizados / estadisticas.total) * 100) : 0}%`,
      subtext: 'Concluidos y entregados',
    },
    {
      id: 'consolidados',
      label: 'Consolidados',
      valor: estadisticas.consolidados,
      icon: Database,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      textColor: 'text-indigo-800',
      badge: `${estadisticas.total > 0 ? Math.round((estadisticas.consolidados / estadisticas.total) * 100) : 0}%`,
      subtext: 'Modalidad consolidada',
    },
    {
      id: 'no-consolidados',
      label: 'No consolidados',
      valor: estadisticas.noConsolidados,
      icon: Layers,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      textColor: 'text-purple-800',
      badge: `${estadisticas.total > 0 ? Math.round((estadisticas.noConsolidados / estadisticas.total) * 100) : 0}%`,
      subtext: 'Sin consolidar',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Cabecera de la tarjeta */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl shrink-0 ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Número principal y porcentaje/subtext */}
            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-3xl xl:text-4xl font-black tracking-tight ${card.textColor}`}>
                {card.valor}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {card.badge}
              </span>
            </div>

            {/* Subtexto descriptivo */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
