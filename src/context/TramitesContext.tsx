import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Tramite, UsuarioActivo, FiltrosTramite, Estadisticas, DelegadoTramite, ModalidadTramite } from '../types';
import { storageService } from '../services/storage';
import { gasApiService } from '../services/gasApi';
import { formatearFechaEspanol, formatearHoraEspanol } from '../utils/dateUtils';
import { formatearNombreCompleto, formatearDetalleCorreccion, formatearTipoSaneamiento } from '../utils/textUtils';

interface TramitesContextType {
  tramites: Tramite[];
  tramitesFiltrados: Tramite[];
  usuarioActual: UsuarioActivo | null;
  estaAutenticado: boolean;
  puedeFinalizar: boolean;
  esDescarte: boolean;
  esAdmin: boolean;
  login: (identificador: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
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
  enmascararCI: (ci: string, forzarMascara?: boolean, tieneComplemento?: boolean, complemento?: string) => string;
  formatearFecha: (fecha: string | undefined | null) => string;
  formatearHora: (fecha: string | undefined | null) => string;
  registrarTramite: (nuevo: {
    nombreCompleto: string;
    cedulaIdentidad: string;
    tieneComplemento?: boolean;
    complemento?: string;
    modalidad: ModalidadTramite;
    queEstaCorrigiendo: string;
    otroTipoSaneamiento?: string;
    detalleCorreccion: string;
    documentacionPresentada?: string[];
    delegado: DelegadoTramite;
    observaciones?: string;
  }) => Promise<{ success: boolean; tramite?: Tramite; message?: string }>;
  finalizarTramite: (id: string, observaciones?: string) => Promise<{ success: boolean; message?: string }>;
  actualizarTramite: (tramiteActualizado: Tramite) => Promise<{ success: boolean; message?: string }>;
  eliminarTramite: (id: string) => Promise<{ success: boolean; message?: string }>;
  forzarSincronizacion: () => Promise<void>;
}

const TramitesContext = createContext<TramitesContextType | undefined>(undefined);

export const TramitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<UsuarioActivo | null>(() => storageService.getCurrentUser());
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

  const estaAutenticado = !!usuarioActual;
  const esDescarte = usuarioActual?.rol === 'DESCARTE' || usuarioActual?.rol === 'PORTERO';
  const esAdmin = usuarioActual?.rol === 'ADMINISTRADOR';
  const puedeFinalizar = !!usuarioActual && (usuarioActual.rol === 'ADMINISTRADOR' || usuarioActual.rol === 'OPERADOR');

  const login = async (identificador: string, password: string) => {
    setMensajeError(null);
    const res = await gasApiService.login(identificador, password);
    if (res.success && res.usuario) {
      setUsuarioActual(res.usuario);
      return { success: true };
    }
    const errMsg = res.message || 'Error al iniciar sesión.';
    setMensajeError(errMsg);
    return { success: false, message: errMsg };
  };

  const logout = async () => {
    await gasApiService.logout();
    setUsuarioActual(null);
  };

  const cambiarUsuario = (usuario: UsuarioActivo) => {
    setUsuarioActual(usuario);
    const expiraMs = Date.now() + 8 * 3600 * 1000;
    storageService.setSession(usuario.token || `tok-${Date.now()}`, usuario, expiraMs);
  };

  const enmascararCI = (ci: string, forzarMascara = false, tieneComplemento = false, complemento?: string): string => {
    const limpia = (ci || '').trim();
    if (!limpia) return 'C.I. *******';
    const compStr = tieneComplemento && complemento && complemento.trim() ? `-${complemento.trim().toUpperCase()}` : '';
    if (esDescarte || forzarMascara) {
      const ultimo = limpia.slice(-1);
      return `C.I. *******${ultimo}${compStr}`;
    }
    return `C.I. ${limpia}${compStr}`;
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
        const query = filtros.busqueda.toLowerCase().trim();
        const coincideNombre = t.nombreCompleto.toLowerCase().includes(query);
        const coincideCI = t.cedulaIdentidad.toLowerCase().includes(query);
        const coincideComp = t.complemento ? t.complemento.toLowerCase().includes(query) : false;
        const coincideCIComp = t.complemento ? `${t.cedulaIdentidad}-${t.complemento}`.toLowerCase().includes(query) : false;
        const coincideNum = t.numero.toLowerCase().includes(query);
        const coincideOtro = t.otroTipoSaneamiento ? t.otroTipoSaneamiento.toLowerCase().includes(query) : false;
        if (!coincideNombre && !coincideCI && !coincideComp && !coincideCIComp && !coincideNum && !coincideOtro) return false;
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
    tieneComplemento?: boolean;
    complemento?: string;
    modalidad: ModalidadTramite;
    queEstaCorrigiendo: string;
    otroTipoSaneamiento?: string;
    detalleCorreccion: string;
    documentacionPresentada?: string[];
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

    const tieneComp = !!nuevo.tieneComplemento;
    const compVal = tieneComp ? (nuevo.complemento || '').trim().toUpperCase() : '';

    const tramiteNuevo: Tramite = {
      id: `tra-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      numero: nuevoNumero,
      correlativo: nuevoCorrelativo,
      nombreCompleto: formatearNombreCompleto(nuevo.nombreCompleto),
      cedulaIdentidad: nuevo.cedulaIdentidad.trim(),
      tieneComplemento: tieneComp,
      complemento: compVal,
      flujo: 'Saneamiento de datos',
      modalidad: nuevo.modalidad,
      queEstaCorrigiendo: nuevo.queEstaCorrigiendo === 'Otro' ? 'Otro' : formatearTipoSaneamiento(nuevo.queEstaCorrigiendo),
      otroTipoSaneamiento: nuevo.queEstaCorrigiendo === 'Otro' ? (nuevo.otroTipoSaneamiento || '').trim() : undefined,
      detalleCorreccion: formatearDetalleCorreccion(nuevo.detalleCorreccion),
      documentacionPresentada: Array.isArray(nuevo.documentacionPresentada) ? nuevo.documentacionPresentada : [],
      delegado: nuevo.delegado,
      estado: 'PENDIENTE',
      fechaRecepcion: fechaHoraStr,
      usuarioRegistro: usuarioActual?.nombre || 'Operador',
      observaciones: nuevo.observaciones?.trim() || '',
      historial: [
        {
          id: `hist-${Date.now()}`,
          titulo: 'Trámite registrado',
          descripcion: `Ingreso formal de expediente por ${usuarioActual?.nombre || 'Operador'}. Asignado a ${nuevo.delegado}.`,
          fechaHora: fechaHoraStr,
          usuario: usuarioActual?.nombre || 'Operador',
          tipo: 'REGISTRO',
        },
      ],
    };

    // Actualización inmediata optimista
    setTramites((prev) => [tramiteNuevo, ...prev]);

    // Envío y confirmación con Google Apps Script
    const res = await gasApiService.guardarTramite(tramiteNuevo, usuarioActual?.nombre || 'Operador');
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

  // Finalización controlada con verificación de permisos de servidor y cliente
  const finalizarTramite = async (id: string, observaciones?: string) => {
    if (esDescarte) {
      const msg = 'Acceso denegado: El personal con rol DESCARTE no está autorizado para finalizar trámites.';
      setMensajeError(msg);
      return { success: false, message: msg };
    }

    const tramiteTarget = tramites.find((t) => t.id === id);
    if (!tramiteTarget) {
      return { success: false, message: 'Trámite no encontrado.' };
    }

    if (tramiteTarget.estado === 'FINALIZADO') {
      return { success: false, message: 'El trámite ya fue finalizado previamente.' };
    }

    const res = await gasApiService.finalizarTramite(id, observaciones, usuarioActual?.nombre || 'Operador');
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
    if (!esAdmin) {
      const msg = 'Acceso denegado: Solo el Administrador tiene autorización para editar trámites existentes.';
      setMensajeError(msg);
      return { success: false, message: msg };
    }

    const normalizado: Tramite = {
      ...tramiteActualizado,
      nombreCompleto: formatearNombreCompleto(tramiteActualizado.nombreCompleto),
      cedulaIdentidad: tramiteActualizado.cedulaIdentidad.trim(),
      tieneComplemento: !!tramiteActualizado.tieneComplemento,
      complemento: tramiteActualizado.tieneComplemento ? (tramiteActualizado.complemento || '').trim().toUpperCase() : '',
      detalleCorreccion: formatearDetalleCorreccion(tramiteActualizado.detalleCorreccion),
      queEstaCorrigiendo: tramiteActualizado.queEstaCorrigiendo === 'Otro' ? 'Otro' : formatearTipoSaneamiento(tramiteActualizado.queEstaCorrigiendo),
      otroTipoSaneamiento: tramiteActualizado.queEstaCorrigiendo === 'Otro' ? (tramiteActualizado.otroTipoSaneamiento || '').trim() : undefined,
    };

    // Actualización inmediata optimista en la interfaz
    setTramites((prev) =>
      prev.map((t) => (t.id === normalizado.id ? normalizado : t))
    );

    const res = await gasApiService.guardarTramite(normalizado, usuarioActual?.nombre || 'Maycol Ávila');
    if (res.success) {
      if (res.tramite) {
        setTramites((prev) =>
          prev.map((t) => (t.id === normalizado.id ? (res.tramite as Tramite) : t))
        );
      }
      return { success: true };
    }
    setMensajeError(res.message || 'Error actualizando trámite');
    return { success: false, message: res.message };
  };

  const eliminarTramite = async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (!esAdmin) {
      const msg = 'Acceso denegado: Solo el Administrador del Gabinete Jurídico tiene permiso para eliminar registros.';
      setMensajeError(msg);
      return { success: false, message: msg };
    }

    // Eliminación inmediata optimista en la interfaz
    setTramites((prev) => prev.filter((t) => t.id !== id));

    const res = await gasApiService.eliminarTramite(id, usuarioActual?.nombre || 'Maycol Ávila');
    return { success: true, message: res.message };
  };

  return (
    <TramitesContext.Provider
      value={{
        tramites,
        tramitesFiltrados,
        usuarioActual,
        estaAutenticado,
        puedeFinalizar,
        esDescarte,
        esAdmin,
        login,
        logout,
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
        enmascararCI,
        formatearFecha: formatearFechaEspanol,
        formatearHora: formatearHoraEspanol,
        registrarTramite,
        finalizarTramite,
        actualizarTramite,
        eliminarTramite,
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
