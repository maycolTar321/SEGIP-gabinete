export type ModalidadTramite = 'Consolidado' | 'No consolidado';

export type EstadoTramite = 'PENDIENTE' | 'FINALIZADO';

export type DelegadoTramite = 'Maycol Ávila' | 'Ximena Veliz';

export interface HistorialEvento {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaHora: string;
  usuario: string;
  tipo: 'REGISTRO' | 'ASIGNACION' | 'ACTUALIZACION' | 'FINALIZACION';
}

export interface Tramite {
  id: string;
  numero: string; // Correlativo formateado e.g. "001", "002"
  correlativo: number;
  nombreCompleto: string;
  cedulaIdentidad: string;
  flujo: 'Saneamiento de datos';
  modalidad: ModalidadTramite;
  queEstaCorrigiendo: string;
  detalleCorreccion: string;
  delegado: DelegadoTramite;
  estado: EstadoTramite;
  fechaRecepcion: string; // ISO string o formato DD/MM/YYYY HH:mm
  fechaFinalizacion?: string;
  usuarioRegistro: string;
  usuarioFinalizo?: string;
  observaciones?: string;
  historial: HistorialEvento[];
}

export interface UsuarioActivo {
  id: string;
  nombre: string;
  cargo: string;
  rol: 'OPERADOR' | 'ADMINISTRADOR';
  avatar?: string;
}

export interface FiltrosTramite {
  busqueda: string;
  modalidad: 'TODAS' | ModalidadTramite;
  delegado: 'TODOS' | DelegadoTramite;
  estado: 'TODOS' | EstadoTramite;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface Estadisticas {
  total: number;
  pendientes: number;
  finalizados: number;
  consolidados: number;
  noConsolidados: number;
  porDelegado: {
    [key: string]: {
      total: number;
      pendientes: number;
      finalizados: number;
    };
  };
}
