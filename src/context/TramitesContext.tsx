import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Tramite, UsuarioActivo, FiltrosTramite, Estadisticas, DelegadoTramite, ModalidadTramite } from '../types';
import { storageService } from '../services/storage';
import { gasApiService } from '../services/gasApi';

interface TramitesContextType {
  tramites: Tramite[];
  tramitesFiltrados: Tramite[];
  usuarioActual: UsuarioActivo;
  cambiarUsuario: (usuario: UsuarioActivo) => void;
  filtros: FiltrosTramite;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosTramite>>;
  estadisticas: Estadisticas;
  sincronizando: boolean;
  ultimaSincronizacion: string;
  conexionActiva: boolean;
  intervaloSegundos: number;
  cambiarIntervaloSegundos: (seg: number) => void;
  mensajeError: string | null;
  limpiarError: () => void;
  registrarTramite: (nuevo: {
    nombreCompleto: string;
    cedulaIdentidad: string;
    modalidad: ModalidadTramite;
    queEstaCorrigiendo: string;
    detalleCorreccion: string;
    delegado: DelegadoTramite;
    observaciones?: string;
  }) => Promise<{ success: boolean; tramite?: Tramite; message?: string }>;
  finalizarTramite: (id: string, observaciones?: string) => Promise<{ success: boolean; message?: string }>;
  actualizarTramite: (tramiteActualizado: Tramite) => Promise<{ success: boolean; message?: string }>;
  forzarSincronizacion: () => Promise<void>;
}

const TramitesContext = createContext<TramitesContextType | undefined>(undefined);

export const TramitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<UsuarioActivo>(() => storageService.getCurrentUser());
  const [sincronizando, setSincronizando] = useState(false);
  const [conexionActiva, setConexionActiva] = useState(true);
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState<string>('Conectando...');
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [intervaloSegundos, setIntervaloSegundos] = useState<number>(() => storageService.getSyncInterval());

  const pestanaVisibleRef = useRef<boolean>(!document.hidden);
  const sincronizandoRef = useRef<boolean>(false);

  const [filtros, setFiltros] = useState<FiltrosTramite>({
    busqueda: '',
    modalidad: 'TODAS',
    delegado: 'TODOS',
    estado: 'TODOS',
  });

  const cambiarUsuario = (usuario: UsuarioActivo) => {
    setUsuarioActual(usuario);
    storageService.setCurrentUser(usuario);
  };

  const cambiarIntervaloSegundos = (seg: number) => {
    const val = Math.max(10, Math.min(30, seg));
    setIntervaloSegundos(val);
    storageService.setSyncInterval(val);
  };

  const limpiarError = () => setMensajeError(null);

  /**
   * Función central de sincronización periódica
   */
  const sincronizar = useCallback(async (forzar = false) => {
    if (sincronizandoRef.current && !forzar) return;

    // Si la pestaña está oculta y no es forzado, omitir para respetar cuotas
    if (!pestanaVisibleRef.current && !forzar) return;

    sincronizandoRef.current = true;
    setSincronizando(true);

    try {
      const res = await gasApiService.fetchTramites(forzar);
      if (res.success && res.data) {
        setTramites(res.data);
        setConexionActiva(true);
        if (res.timestamp) {
          setUltimaSincronizacion(`hoy, ${res.timestamp}`);
        }
        if (mensajeError) setMensajeError(null);
      } else {
        setConexionActiva(false);
        if (res.message) {
          setMensajeError(res.message);
        }
      }
    } catch (err: any) {
      setConexionActiva(false);
      setMensajeError(`Error de sincronización con Google Sheets: ${err?.message || 'Fallo de red'}`);
    } finally {
      sincronizandoRef.current = false;
      setSincronizando(false);
    }
  }, [mensajeError]);

  // Manejo de Page Visibility API (ahorro de cuotas cuando la pestaña está en segundo plano)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      pestanaVisibleRef.current = visible;

      // Al volver a la pestaña, sincronizar de inmediato
      if (visible) {
        sincronizar(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sincronizar]);

  // Intervalo de sincronización periódico (10 - 15 segundos)
  useEffect(() => {
    // Sincronización inicial
    sincronizar(true);

    const intervalId = setInterval(() => {
      sincronizar(false);
    }, intervaloSegundos * 1000);

    return () => clearInterval(intervalId);
  }, [sincronizar, intervaloSegundos]);

  // Cálculo de estadísticas en tiempo real
  const estadisticas = useMemo<Estadisticas>(() => {
    const total = tramites.length;
    const pendientes = tramites.filter((t) => t.estado === 'PENDIENTE').length;
    const finalizados = tramites.filter((t) => t.estado === 'FINALIZADO').length;
    const consolidados = tramites.filter(
      (t) => t.modalidad === 'Consolidado' || (t.modalidad as string) === 'CONSOLIDADO'
    ).length;
    const noConsolidados = tramites.filter(
      (t) => t.modalidad === 'No consolidado' || (t.modalidad as string) === 'NO CONSOLIDADO'
    ).length;

    const porDelegado: Estadisticas['porDelegado'] = {
      'Maycol Ávila': { total: 0, pendientes: 0, finalizados: 0 },
      'Ximena Veliz': { total: 0, pendientes: 0, finalizados: 0 },
    };

    tramites.forEach((t) => {
      if (porDelegado[t.delegado]) {
        porDelegado[t.delegado].total += 1;
        if (t.estado === 'PENDIENTE') porDelegado[t.delegado].pendientes += 1;
        if (t.estado === 'FINALIZADO') porDelegado[t.delegado].finalizados += 1;
      }
    });

    return {
      total,
      pendientes,
      finalizados,
      consolidados,
      noConsolidados,
      porDelegado,
    };
  }, [tramites]);

  // Filtrado reactivo sin recargar la aplicación
  const tramitesFiltrados = useMemo(() => {
    return tramites.filter((t) => {
      if (filtros.busqueda.trim()) {
        const query = filtros.busqueda.toLowerCase();
        const coincideNombre = t.nombreCompleto.toLowerCase().includes(query);
        const coincideCI = t.cedulaIdentidad.toLowerCase().includes(query);
        const coincideNum = t.numero.toLowerCase().includes(query);
        if (!coincideNombre && !coincideCI && !coincideNum) return false;
      }

      if (filtros.modalidad !== 'TODAS') {
        const modUpper = t.modalidad.toUpperCase();
        const filtroUpper = filtros.modalidad.toUpperCase();
        if (modUpper !== filtroUpper) return false;
      }

      if (filtros.delegado !== 'TODOS' && t.delegado !== filtros.delegado) {
        return false;
      }

      if (filtros.estado !== 'TODOS' && t.estado.toUpperCase() !== filtros.estado.toUpperCase()) {
        return false;
      }

      return true;
    });
  }, [tramites, filtros]);

  // Registro de nuevo trámite con backend
  const registrarTramite = async (nuevo: {
    nombreCompleto: string;
    cedulaIdentidad: string;
    modalidad: ModalidadTramite;
    queEstaCorrigiendo: string;
    detalleCorreccion: string;
    delegado: DelegadoTramite;
    observaciones?: string;
  }) => {
    const ahora = new Date();
    const fechaHoraStr =
      ahora.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' +
      ahora.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });

    const maxCorrelativo = tramites.reduce((max, t) => Math.max(max, t.correlativo || 0), 0);
    const nuevoCorrelativo = maxCorrelativo + 1;
    const nuevoNumero = String(nuevoCorrelativo).padStart(3, '0');

    const tramiteNuevo: Tramite = {
      id: `tra-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      numero: nuevoNumero,
      correlativo: nuevoCorrelativo,
      nombreCompleto: nuevo.nombreCompleto.trim(),
      cedulaIdentidad: nuevo.cedulaIdentidad.trim(),
      flujo: 'Saneamiento de datos',
      modalidad: nuevo.modalidad,
      queEstaCorrigiendo: nuevo.queEstaCorrigiendo.trim(),
      detalleCorreccion: nuevo.detalleCorreccion.trim(),
      delegado: nuevo.delegado,
      estado: 'PENDIENTE',
      fechaRecepcion: fechaHoraStr,
      usuarioRegistro: usuarioActual.nombre,
      observaciones: nuevo.observaciones?.trim() || '',
      historial: [],
    };

    // Actualización inmediata optimista
    setTramites((prev) => [tramiteNuevo, ...prev]);

    // Envío y confirmación con Google Apps Script
    const res = await gasApiService.guardarTramite(tramiteNuevo, usuarioActual.nombre);
    if (res.success && res.tramite) {
      setTramites((prev) =>
        prev.map((t) => (t.id === tramiteNuevo.id ? (res.tramite as Tramite) : t))
      );
      return { success: true, tramite: res.tramite };
    } else {
      setMensajeError(res.message || 'Error guardando en Google Sheets');
      return { success: false, message: res.message };
    }
  };

  // Finalización controlada
  const finalizarTramite = async (id: string, observaciones?: string) => {
    const tramiteTarget = tramites.find((t) => t.id === id);
    if (!tramiteTarget) {
      return { success: false, message: 'Trámite no encontrado.' };
    }

    if (tramiteTarget.estado === 'FINALIZADO') {
      return { success: false, message: 'El trámite ya fue finalizado previamente.' };
    }

    const res = await gasApiService.finalizarTramite(id, observaciones, usuarioActual.nombre);
    if (res.success) {
      // Forzar lectura inmediata para tener fecha de servidor y datos sincronizados
      await sincronizar(true);
      return { success: true };
    } else {
      setMensajeError(res.message || 'Error finalizando trámite');
      return { success: false, message: res.message };
    }
  };

  const actualizarTramite = async (tramiteActualizado: Tramite) => {
    const res = await gasApiService.guardarTramite(tramiteActualizado, usuarioActual.nombre);
    if (res.success) {
      await sincronizar(true);
      return { success: true };
    }
    setMensajeError(res.message || 'Error actualizando trámite');
    return { success: false, message: res.message };
  };

  return (
    <TramitesContext.Provider
      value={{
        tramites,
        tramitesFiltrados,
        usuarioActual,
        cambiarUsuario,
        filtros,
        setFiltros,
        estadisticas,
        sincronizando,
        ultimaSincronizacion,
        conexionActiva,
        intervaloSegundos,
        cambiarIntervaloSegundos,
        mensajeError,
        limpiarError,
        registrarTramite,
        finalizarTramite,
        actualizarTramite,
        forzarSincronizacion: () => sincronizar(true),
      }}
    >
      {children}
    </TramitesContext.Provider>
  );
};

export const useTramites = () => {
  const context = useContext(TramitesContext);
  if (!context) {
    throw new Error('useTramites debe ser utilizado dentro de un TramitesProvider');
  }
  return context;
};
