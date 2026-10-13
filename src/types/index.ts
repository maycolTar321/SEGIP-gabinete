export type ModalidadTramite = 'Consolidado' | 'No consolidado';

export type EstadoTramite = 'PENDIENTE' | 'FINALIZADO';

export type DelegadoTramite = 'Maycol Ávila' | 'Ximena Veliz';

export const DOCUMENTOS_OFICIALES = [
  'FUTA',
  'Certificado de nacimiento',
  'Certificado de matrimonio',
  'Cédula de identidad del padre',
  'Cédula de identidad de la madre',
  'Certificado de defunción',
  'Resolución administrativa del CERESI',
  'Partida única del CERESI',
] as const;

export type DocumentoOficial = typeof DOCUMENTOS_OFICIALES[number];

export const OPCIONES_SANEAMIENTO_BASE = [
  'Nombres y apellidos',
  'Fecha de nacimiento',
  'Lugar de nacimiento',
  'Datos de filiación',
  'Estado civil',
  'Corrección de cédula / duplicidad',
  'Otro dato biográfico',
  'Otro',
] as const;

export interface HistorialEvento {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaHora: string;
  usuario: string;
  tipo: 'REGISTRO' | 'ASIGNACION' | 'ACTUALIZACION' | 'FINALIZACION' | 'ELIMINACION';
}

export interface Tramite {
  id: string;
  numero: string; // Correlativo formateado e.g. "001", "002"
  correlativo: number;
  nombreCompleto: string;
  cedulaIdentidad: string;
  tieneComplemento?: boolean;
  complemento?: string;
  flujo: 'Saneamiento de datos';
  modalidad: ModalidadTramite;
  queEstaCorrigiendo: string;
  otroTipoSaneamiento?: string;
  detalleCorreccion: string;
  documentacionPresentada?: string[];
  delegado: DelegadoTramite;
  estado: EstadoTramite;
  fechaRecepcion: string; // DD/MM/YYYY HH:mm
  fechaFinalizacion?: string;
  usuarioRegistro: string;
  usuarioFinalizo?: string;
  observaciones?: string;
  historial: HistorialEvento[];
}

export type RolUsuario = 'ADMINISTRADOR' | 'OPERADOR' | 'DESCARTE' | 'PORTERO';

export interface UsuarioActivo {
  id: string;
  nombre: string;
  cargo: string;
  rol: RolUsuario;
  avatar?: string;
  token?: string;
  expiraMs?: number;
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
