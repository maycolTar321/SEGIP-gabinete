import React from 'react';
import { ShieldCheck, UserCheck, CheckCircle } from 'lucide-react';
import { USUARIOS_AUTORIZADOS } from '../../services/storage';
import { useTramites } from '../../context/TramitesContext';

export const UsersView: React.FC = () => {
  const { usuarioActual, cambiarUsuario, estadisticas } = useTramites();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Control de Usuarios y Accesos Autorizados
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de las 3 cuentas operativas del Gabinete Jurídico del SEGIP
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-segip-800 rounded-xl border border-blue-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-segip-700" />
          <span>Acceso Restringido Institucional</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {USUARIOS_AUTORIZADOS.map((usr) => {
          const esActivo = usr.id === usuarioActual.id;
          const stats = estadisticas.porDelegado[usr.nombre] || { total: 0, pendientes: 0, finalizados: 0 };

          return (
            <div
              key={usr.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                esActivo
                  ? 'border-segip-600 ring-2 ring-segip-500/20 shadow-md'
                  : 'border-slate-200/80 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-segip-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {usr.nombre.charAt(0)}
                  </div>
                  {esActivo && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Sesión activa
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-800">{usr.nombre}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{usr.cargo}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Rol:</span>
                    <span className="font-semibold">{usr.rol}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Trámites atendidos:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Pendientes actuales:</span>
                    <span className="font-semibold text-amber-600">{stats.pendientes}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {!esActivo ? (
                  <button
                    type="button"
                    onClick={() => cambiarUsuario(usr)}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-segip-50 hover:text-segip-700 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Iniciar sesión como este usuario</span>
                  </button>
                ) : (
                  <div className="text-center text-xs font-semibold text-segip-700 py-2">
                    Usuario actualmente autenticado
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
