import React from 'react';
import { Calendar } from 'lucide-react';

export const InstitutionalFooter: React.FC = () => {
  const fechaHoy = new Date().toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      {/* Aviso institucional en naranja/ámbar como en la plantilla */}
      <div className="flex items-center gap-2 text-amber-800 font-medium italic">
        <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 not-italic">
          i
        </div>
        <span>Los trámites solo se finalizan cuando están concluidos y entregados.</span>
      </div>

      {/* Fecha y firma institucional */}
      <div className="flex items-center gap-2 text-slate-500 font-medium">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span>{fechaHoy} | SEGIP - Gabinete Jurídico</span>
      </div>
    </footer>
  );
};
