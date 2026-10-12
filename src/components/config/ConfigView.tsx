import React, { useState } from 'react';
import { Link2, Check, RefreshCw, Database, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { storageService } from '../../services/storage';
import { useTramites } from '../../context/TramitesContext';

export const ConfigView: React.FC = () => {
  const {
    forzarSincronizacion,
    ultimaSincronizacion,
    conexionActiva,
    intervaloSegundos,
    cambiarIntervaloSegundos,
  } = useTramites();

  const [urlGas, setUrlGas] = useState(() => storageService.getApiUrl());
  const [intervalo, setIntervalo] = useState<number>(intervaloSegundos);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [probando, setProbando] = useState(false);
  const [mensajePrueba, setMensajePrueba] = useState<string | null>(null);

  const guardarConfiguracion = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.setApiUrl(urlGas.trim());
    cambiarIntervaloSegundos(intervalo);
    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 3000);
  };

  const probarConexion = async () => {
    setProbando(true);
    setMensajePrueba(null);
    try {
      await forzarSincronizacion();
      setMensajePrueba('Conexión con el backend de Google Apps Script exitosa.');
    } catch {
      setMensajePrueba('No se pudo establecer conexión remota. Verifique la URL de la Web App.');
    } finally {
      setProbando(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Configuración y Conectividad
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enlace con Google Apps Script y Google Sheets para sincronización periódica
          </p>
        </div>

        <div className="flex items-center gap-2">
          {conexionActiva ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              Sincronización activa ({ultimaSincronizacion})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="w-4 h-4" />
              Modo almacenamiento local
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6 max-w-3xl">
        <form onSubmit={guardarConfiguracion} className="space-y-5">
          {/* URL de Google Apps Script */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-segip-600" />
              URL de la Web App de Google Apps Script
            </label>
            <p className="text-xs text-slate-500 mb-2">
              URL activa de la aplicación web conectada a la hoja de Google Sheets.
            </p>
            <input
              type="url"
              required
              value={urlGas}
              onChange={(e) => setUrlGas(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-segip-500 transition-all"
            />
          </div>

          {/* Frecuencia de sincronización periódica */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-segip-600" />
              Intervalo de sincronización periódica
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Frecuencia de sondeo en segundo plano (respetando las cuotas de Google Apps Script).
            </p>
            <div className="flex items-center gap-3">
              {[10, 12, 15, 20].map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setIntervalo(seg)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    intervalo === seg
                      ? 'bg-segip-700 text-white shadow-xs ring-2 ring-segip-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {seg} segundos
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-segip-700 hover:bg-segip-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Guardar configuración</span>
            </button>

            <button
              type="button"
              onClick={probarConexion}
              disabled={probando}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${probando ? 'animate-spin' : ''}`} />
              <span>Probar conexión</span>
            </button>
          </div>

          {guardadoExitoso && (
            <p className="text-xs font-bold text-emerald-600 animate-in fade-in">
              Configuración guardada correctamente.
            </p>
          )}

          {mensajePrueba && (
            <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 animate-in fade-in">
              {mensajePrueba}
            </p>
          )}
        </form>

        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-segip-600" />
            Control de Concurrencia y Cuotas
          </h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-5">
            <li>
              <strong>Page Visibility API:</strong> El sondeo se detiene automáticamente cuando la pestaña está en segundo plano para ahorrar cuotas diarias de Google Apps Script.
            </li>
            <li>
              <strong>Protección contra escrituras simultáneas:</strong> El servidor aplica <code className="text-slate-700 font-bold">LockService</code> asegurando correlativos consecutivos e inmutabilidad.
            </li>
            <li>
              <strong>Idempotencia:</strong> Las escrituras con resultado de red incierto se verifican contra el identificador único del trámite para evitar duplicaciones.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
