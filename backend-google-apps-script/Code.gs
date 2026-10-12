/**
 * ============================================================================
 * SISTEMA: SEGIP Gabinete Jurídico - Saneamiento de Datos
 * ARCHIVO: Código.gs (Backend Oficial y Completo)
 * ============================================================================
 */

// 1. CONFIGURACIÓN Y CONSTANTES
const CONFIG = {
  NOMBRE_SISTEMA: 'SEGIP - Gabinete Jurídico Saneamiento de Datos',
  VERSION: '2.1.0',
  ZONA_HORARIA: 'America/La_Paz',
  FLUJO_UNICO: 'SANEAMIENTO DE DATOS',
  MODALIDADES_VALIDAS: ['CONSOLIDADO', 'NO CONSOLIDADO', 'Consolidado', 'No consolidado'],
  DELEGADOS_VALIDOS: ['Maycol Ávila', 'Ximena Veliz'],
  ESTADOS_VALIDOS: ['PENDIENTE', 'FINALIZADO'],
  EXPIRACION_SESION_HORAS: 8,
  
  HOJAS: {
    TRAMITES: 'TRAMITES',
    USUARIOS: 'USUARIOS',
    HISTORIAL: 'HISTORIAL',
    CONFIGURACION: 'CONFIGURACION'
  },
  COLORES: {
    HEADER_BG: '#0A3871',
    HEADER_FG: '#FFFFFF'
  }
};

const ESQUEMA_HOJAS = {
  TRAMITES: [
    'ID', 'N_CORRELATIVO', 'CORRELATIVO_NUM', 'NOMBRE_COMPLETO', 'CEDULA_IDENTIDAD',
    'FLUJO', 'MODALIDAD', 'QUE_ESTA_CORRIGIENDO', 'DETALLE_CORRECCION', 'DELEGADO',
    'ESTADO', 'FECHA_RECEPCION', 'FECHA_FINALIZACION', 'USUARIO_REGISTRO', 'USUARIO_FINALIZO',
    'OBSERVACIONES'
  ],
  USUARIOS: [
    'ID_USUARIO', 'NOMBRE', 'CARGO', 'ROL', 'ESTADO', 'PASSWORD_HASH', 'SALT', 'TOKEN_SESION', 'FECHA_EXPIRACION_TOKEN'
  ],
  HISTORIAL: [
    'EVENTO_ID', 'TRAMITE_ID', 'N_CORRELATIVO', 'TIPO_OPERACION', 'TITULO', 'DESCRIPCION', 'FECHA_HORA', 'USUARIO_RESPONSABLE'
  ],
  CONFIGURACION: [
    'CLAVE', 'VALOR', 'DESCRIPCION'
  ]
};

// USUARIOS OFICIALES DEL GABINETE JURÍDICO
const USUARIOS_OFICIALES = [
  {
    id: 'usr-admin',
    nombre: 'Maycol Ávila',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'ADMINISTRADOR',
    estado: 'ACTIVO',
    password: 'admin5230',
    salt: 'GJxn$erBSWpZD1pu'
  },
  {
    id: 'usr-ximena',
    nombre: 'Ximena Veliz',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'OPERADOR',
    estado: 'ACTIVO',
    password: 'XI2026',
    salt: 'Fs#GIZBEhiLI8UtI'
  },
  {
    id: 'usr-maycol',
    nombre: 'SAMUEL',
    cargo: 'DESCARTE',
    rol: 'PORTERO',
    estado: 'ACTIVO',
    password: 'SA2026',
    salt: 'M@K&PWuVXNM@QU!$'
  }
];

// 2. FUNCIONES DE CRIPTOGRAFÍA
function hashPassword(password, salt) {
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password + salt,
    Utilities.Charset.UTF_8
  );
  return rawHash.map(function(byte) {
    var v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function generarTokenSesion(idUsuario) {
  const payload = idUsuario + ':' + new Date().getTime() + ':' + Math.random().toString(36).substring(2);
  return Utilities.base64EncodeWebSafe(payload);
}

function obtenerFechaHoraActual() {
  return Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, 'dd/MM/yyyy HH:mm');
}

// 3. INICIALIZACIÓN DE HOJAS
function inicializarSistema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Hoja TRAMITES
  crearHojaSiNoExiste(ss, CONFIG.HOJAS.TRAMITES, ESQUEMA_HOJAS.TRAMITES);

  // Hoja HISTORIAL
  crearHojaSiNoExiste(ss, CONFIG.HOJAS.HISTORIAL, ESQUEMA_HOJAS.HISTORIAL);

  // Hoja CONFIGURACION
  const sheetConfig = crearHojaSiNoExiste(ss, CONFIG.HOJAS.CONFIGURACION, ESQUEMA_HOJAS.CONFIGURACION);
  if (sheetConfig.getLastRow() <= 1) {
    [
      ['ENTIDAD', 'SEGIP - Servicio General de Identificación Personal', 'Entidad institucional'],
      ['UNIDAD', 'Gabinete Jurídico', 'Unidad'],
      ['FLUJO', 'SANEAMIENTO DE DATOS', 'Flujo único'],
      ['DELEGADOS', 'Maycol Ávila, Ximena Veliz', 'Delegados habilitados'],
      ['VERSION', CONFIG.VERSION, 'Versión backend']
    ].forEach(function(fila) { sheetConfig.appendRow(fila); });
  }

  // Hoja USUARIOS (Configurar usuarios oficiales)
  let sheetUsuarios = ss.getSheetByName(CONFIG.HOJAS.USUARIOS);
  if (!sheetUsuarios) {
    sheetUsuarios = ss.insertSheet(CONFIG.HOJAS.USUARIOS);
  }
  sheetUsuarios.clear();
  sheetUsuarios.appendRow(ESQUEMA_HOJAS.USUARIOS);
  sheetUsuarios.getRange(1, 1, 1, ESQUEMA_HOJAS.USUARIOS.length)
               .setBackground(CONFIG.COLORES.HEADER_BG)
               .setFontColor(CONFIG.COLORES.HEADER_FG)
               .setFontWeight('bold');
  sheetUsuarios.setFrozenRows(1);

  USUARIOS_OFICIALES.forEach(function(u) {
    const hash = hashPassword(u.password, u.salt);
    sheetUsuarios.appendRow([
      u.id,
      u.nombre,
      u.cargo,
      u.rol,
      u.estado,
      hash,
      u.salt,
      '',
      ''
    ]);
  });

  Logger.log('Sistema inicializado con éxito. Usuarios configurados.');
  return { success: true, message: 'Sistema y usuarios inicializados exitosamente.' };
}

function crearHojaSiNoExiste(ss, nombreHoja, encabezados) {
  let sheet = ss.getSheetByName(nombreHoja);
  if (!sheet) {
    sheet = ss.insertSheet(nombreHoja);
    sheet.appendRow(encabezados);
    sheet.getRange(1, 1, 1, encabezados.length)
         .setBackground(CONFIG.COLORES.HEADER_BG)
         .setFontColor(CONFIG.COLORES.HEADER_FG)
         .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 4. CONTROLADORES HTTP
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action || 'ping';

    if (action === 'ping') {
      return responderJSON({
        success: true,
        sistema: CONFIG.NOMBRE_SISTEMA,
        version: CONFIG.VERSION,
        horaServidor: obtenerFechaHoraActual()
      });
    }

    if (action === 'getTramites') {
      return listarTramites(params);
    }

    if (action === 'getDetalle') {
      return obtenerDetalleTramite(params.id);
    }

    if (action === 'getHistorial') {
      return obtenerHistorialTramite(params.tramiteId);
    }

    if (action === 'getEstadisticas') {
      return obtenerEstadisticasDashboard();
    }

    return responderJSON({ success: false, message: 'Acción GET no válida: ' + action });
  } catch (error) {
    return responderJSON({ success: false, message: 'Error GET: ' + error.toString() });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return responderJSON({ success: false, message: 'Servidor ocupado. Reintentando...' });
  }

  try {
    const contents = e.postData.contents;
    const body = JSON.parse(contents);
    const action = body.action;
    const data = body.data || {};

    if (action === 'login') {
      return procesarLogin(data.identificador, data.password);
    }

    if (action === 'logout') {
      return procesarLogout(body.token);
    }

    const usuarioNombre = body.usuarioResponsable || (data ? data.usuarioRegistro : 'Operador');

    if (action === 'guardarTramite') {
      return guardarOActualizarTramite(data, usuarioNombre);
    }

    if (action === 'finalizarTramite') {
      return finalizarTramiteControlado(data.id, data.observaciones, usuarioNombre);
    }

    if (action === 'eliminarTramite') {
      return eliminarTramiteControlado(data.id, usuarioNombre);
    }

    if (action === 'cambiarDelegado') {
      return cambiarDelegadoTramite(data.id, data.nuevoDelegado, usuarioNombre);
    }

    return responderJSON({ success: false, message: 'Acción POST desconocida: ' + action });
  } catch (error) {
    return responderJSON({ success: false, message: 'Error POST: ' + error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// 5. AUTENTICACIÓN Y ROLES
function procesarLogin(identificador, password) {
  if (!identificador || !password) {
    return responderJSON({ success: false, message: 'Identificador y contraseña requeridos.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.USUARIOS);
  if (!sheet) {
    inicializarSistema();
    return responderJSON({ success: false, message: 'Sistema inicializado. Inicie sesión nuevamente.' });
  }

  const rows = sheet.getDataRange().getValues();
  const idBuscado = String(identificador).toLowerCase().trim();

  for (let i = 1; i < rows.length; i++) {
    const id = String(rows[i][0]).toLowerCase();
    const nombre = String(rows[i][1]).toLowerCase();
    const cargo = String(rows[i][2]);
    const rol = String(rows[i][3]);
    const estado = String(rows[i][4]);
    const storedHash = String(rows[i][5]);
    const salt = String(rows[i][6]);

    if ((id === idBuscado || nombre === idBuscado) && estado === 'ACTIVO') {
      const computedHash = hashPassword(password, salt);
      if (computedHash === storedHash) {
        const token = generarTokenSesion(rows[i][0]);
        const expiraMs = new Date().getTime() + (CONFIG.EXPIRACION_SESION_HORAS * 3600 * 1000);

        sheet.getRange(i + 1, 8).setValue(token);
        sheet.getRange(i + 1, 9).setValue(expiraMs);

        registrarEventoHistorial(
          'AUTH', 'N/A', 'INICIO_SESION', 'Inicio de sesión',
          'Usuario ' + rows[i][1] + ' (' + rol + ') inició sesión.', rows[i][1]
        );

        return responderJSON({
          success: true,
          token: token,
          usuario: {
            id: String(rows[i][0]),
            nombre: String(rows[i][1]),
            cargo: cargo,
            rol: rol
          }
        });
      }
    }
  }

  return responderJSON({ success: false, message: 'Credenciales inválidas o cuenta no activa.' });
}

function procesarLogout(token) {
  if (!token) return responderJSON({ success: true });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.USUARIOS);
  if (!sheet) return responderJSON({ success: true });

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][7]) === token) {
      sheet.getRange(i + 1, 8).setValue('');
      sheet.getRange(i + 1, 9).setValue('');
      break;
    }
  }
  return responderJSON({ success: true, message: 'Sesión cerrada.' });
}

// 6. GESTIÓN DE TRÁMITES
function listarTramites(filtros) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  if (!sheet) return responderJSON({ success: true, tramites: [] });

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return responderJSON({ success: true, tramites: [], timestamp: obtenerFechaHoraActual() });
  }

  const busqueda = (filtros.busqueda || '').toLowerCase().trim();
  const filtroEstado = (filtros.estado || 'TODOS').toUpperCase();
  const filtroModalidad = (filtros.modalidad || 'TODAS').toUpperCase();
  const filtroDelegado = filtros.delegado || 'TODOS';

  const resultados = [];

  for (let i = 1; i < rows.length; i++) {
    const t = formatearFilaATramite(rows[i]);

    if (busqueda) {
      const matchNombre = t.nombreCompleto.toLowerCase().indexOf(busqueda) !== -1;
      const matchCI = t.cedulaIdentidad.toLowerCase().indexOf(busqueda) !== -1;
      const matchNum = t.numero.toLowerCase().indexOf(busqueda) !== -1;
      if (!matchNombre && !matchCI && !matchNum) continue;
    }

    if (filtroEstado !== 'TODOS' && t.estado.toUpperCase() !== filtroEstado) continue;
    if (filtroModalidad !== 'TODAS' && t.modalidad.toUpperCase() !== filtroModalidad) continue;
    if (filtroDelegado !== 'TODOS' && t.delegado !== filtroDelegado) continue;

    resultados.push(t);
  }

  resultados.sort(function(a, b) { return b.correlativo - a.correlativo; });

  return responderJSON({
    success: true,
    tramites: resultados,
    total: resultados.length,
    timestamp: Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, 'HH:mm')
  });
}

function guardarOActualizarTramite(tramiteData, usuarioNombre) {
  if (!tramiteData.nombreCompleto || !tramiteData.cedulaIdentidad || !tramiteData.queEstaCorrigiendo) {
    return responderJSON({ success: false, message: 'Nombre, cédula y qué se corrige son obligatorios.' });
  }

  let delegado = tramiteData.delegado || 'Maycol Ávila';
  if (CONFIG.DELEGADOS_VALIDOS.indexOf(delegado) === -1) delegado = 'Maycol Ávila';

  let modalidad = tramiteData.modalidad || 'Consolidado';
  if (modalidad.toUpperCase() === 'CONSOLIDADO') modalidad = 'Consolidado';
  if (modalidad.toUpperCase() === 'NO CONSOLIDADO') modalidad = 'No consolidado';

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  const rows = sheet.getDataRange().getValues();

  let filaExistente = -1;
  let tramiteAnterior = null;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(tramiteData.id)) {
      filaExistente = i + 1;
      tramiteAnterior = rows[i];
      break;
    }
  }

  const fechaHoraActual = obtenerFechaHoraActual();

  // ACTUALIZACIÓN (Solo el Administrador puede editar registros existentes)
  if (filaExistente > 0) {
    const esAdmin = String(usuarioNombre).toLowerCase().indexOf('maycol') !== -1 ||
                    String(usuarioNombre).toLowerCase().indexOf('admin') !== -1;
    if (!esAdmin) {
      return responderJSON({
        success: false,
        message: 'Acceso denegado: Solo el Administrador tiene autorización para editar trámites existentes.'
      });
    }

    const estadoActual = String(tramiteAnterior[10]);

    if (estadoActual === 'FINALIZADO' && tramiteData.estado === 'PENDIENTE') {
      return responderJSON({
        success: false,
        message: 'Acción rechazada: Un trámite finalizado no puede volver a estado pendiente.'
      });
    }

    const valoresActualizados = [
      tramiteAnterior[0], tramiteAnterior[1], tramiteAnterior[2],
      tramiteData.nombreCompleto.trim(), tramiteData.cedulaIdentidad.trim(),
      CONFIG.FLUJO_UNICO, modalidad, tramiteData.queEstaCorrigiendo.trim(),
      (tramiteData.detalleCorreccion || '').trim(), delegado, estadoActual,
      tramiteAnterior[11], tramiteAnterior[12], tramiteAnterior[13], tramiteAnterior[14],
      (tramiteData.observaciones || '').trim()
    ];

    sheet.getRange(filaExistente, 1, 1, valoresActualizados.length).setValues([valoresActualizados]);

    registrarEventoHistorial(
      tramiteAnterior[0], tramiteAnterior[1], 'EDICION', 'Modificación de trámite',
      'Datos actualizados por ' + usuarioNombre + '.', usuarioNombre
    );

    return responderJSON({
      success: true,
      message: 'Trámite actualizado correctamente.',
      tramite: formatearFilaATramite(valoresActualizados)
    });
  }

  // NUEVO TRÁMITE
  let maxCorrelativo = 0;
  for (let i = 1; i < rows.length; i++) {
    const num = Number(rows[i][2]) || 0;
    if (num > maxCorrelativo) maxCorrelativo = num;
  }

  const nuevoCorrelativo = maxCorrelativo + 1;
  const nuevoNumeroFormateado = ('000' + nuevoCorrelativo).slice(-3);
  const nuevoId = tramiteData.id || ('tra-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000));

  const nuevaFila = [
    nuevoId, nuevoNumeroFormateado, nuevoCorrelativo,
    tramiteData.nombreCompleto.trim(), tramiteData.cedulaIdentidad.trim(),
    CONFIG.FLUJO_UNICO, modalidad, tramiteData.queEstaCorrigiendo.trim(),
    (tramiteData.detalleCorreccion || '').trim(), delegado, 'PENDIENTE',
    fechaHoraActual, '', usuarioNombre, '', (tramiteData.observaciones || '').trim()
  ];

  sheet.appendRow(nuevaFila);

  registrarEventoHistorial(
    nuevoId, nuevoNumeroFormateado, 'REGISTRO', 'Trámite registrado',
    'Ingreso formal de expediente por ' + usuarioNombre + '. Asignado a ' + delegado + '.',
    usuarioNombre
  );

  return responderJSON({
    success: true,
    message: 'Trámite registrado exitosamente.',
    tramite: formatearFilaATramite(nuevaFila)
  });
}

function finalizarTramiteControlado(id, observacionesFinales, usuarioNombre) {
  if (!id) return responderJSON({ success: false, message: 'ID de trámite requerido.' });

  if (String(usuarioNombre).toUpperCase() === 'SAMUEL' || String(usuarioNombre).toUpperCase().indexOf('DESCARTE') !== -1) {
    return responderJSON({
      success: false,
      message: 'Acceso denegado: El personal con rol DESCARTE no está autorizado para finalizar trámites.'
    });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      const estadoActual = String(rows[i][10]);

      if (estadoActual === 'FINALIZADO') {
        return responderJSON({ success: false, message: 'El trámite ya fue finalizado.' });
      }

      const filaNum = i + 1;
      const fechaHoraActual = obtenerFechaHoraActual();
      const nCorrelativo = rows[i][1];
      let obsPrevias = rows[i][15] ? String(rows[i][15]) : '';

      if (observacionesFinales && observacionesFinales.trim()) {
        obsPrevias = obsPrevias ? (obsPrevias + ' | ' + observacionesFinales.trim()) : observacionesFinales.trim();
      }

      sheet.getRange(filaNum, 11).setValue('FINALIZADO');
      sheet.getRange(filaNum, 13).setValue(fechaHoraActual);
      sheet.getRange(filaNum, 15).setValue(usuarioNombre);
      sheet.getRange(filaNum, 16).setValue(obsPrevias);

      registrarEventoHistorial(
        id, nCorrelativo, 'FINALIZACION', 'Trámite concluido y entregado',
        'Saneamiento concluido y documento entregado físicamente al ciudadano por ' + usuarioNombre + '.',
        usuarioNombre
      );

      return responderJSON({
        success: true,
        message: 'Trámite finalizado y entregado.',
        fechaFinalizacion: fechaHoraActual,
        usuarioFinalizo: usuarioNombre
      });
    }
  }

  return responderJSON({ success: false, message: 'Trámite no encontrado.' });
}

function eliminarTramiteControlado(id, usuarioNombre) {
  if (!id) return responderJSON({ success: false, message: 'ID de trámite requerido.' });

  // Solo el Administrador (Maycol Ávila o cuenta admin) tiene autorización
  const esAdmin = String(usuarioNombre).toLowerCase().indexOf('maycol') !== -1 ||
                  String(usuarioNombre).toLowerCase().indexOf('admin') !== -1;

  if (!esAdmin) {
    return responderJSON({
      success: false,
      message: 'Acceso denegado: Solo el Administrador del Gabinete Jurídico tiene permiso para eliminar registros.'
    });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      const correlativo = rows[i][1];
      const nombreCiudadano = rows[i][3];

      sheet.deleteRow(i + 1);

      registrarEventoHistorial(
        id, correlativo, 'ELIMINACION', 'Trámite eliminado',
        'Registro de ' + nombreCiudadano + ' eliminado permanentemente por el Administrador ' + usuarioNombre + '.',
        usuarioNombre
      );

      return responderJSON({
        success: true,
        message: 'Trámite N.º ' + correlativo + ' eliminado permanentemente.'
      });
    }
  }

  return responderJSON({ success: false, message: 'Trámite no encontrado para eliminar.' });
}

function cambiarDelegadoTramite(id, nuevoDelegado, usuarioNombre) {
  if (!id || !nuevoDelegado) return responderJSON({ success: false, message: 'Datos incompletos.' });
  if (CONFIG.DELEGADOS_VALIDOS.indexOf(nuevoDelegado) === -1) return responderJSON({ success: false, message: 'Delegado no válido.' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      const filaNum = i + 1;
      const anterior = rows[i][9];
      sheet.getRange(filaNum, 10).setValue(nuevoDelegado);

      registrarEventoHistorial(
        id, rows[i][1], 'CAMBIO_DELEGADO', 'Cambio de delegado',
        'Reasignado de ' + anterior + ' a ' + nuevoDelegado + ' por ' + usuarioNombre + '.',
        usuarioNombre
      );

      return responderJSON({ success: true, message: 'Delegado modificado exitosamente.' });
    }
  }
  return responderJSON({ success: false, message: 'Trámite no encontrado.' });
}

function obtenerDetalleTramite(id) {
  if (!id) return responderJSON({ success: false, message: 'ID requerido.' });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      const tramite = formatearFilaATramite(rows[i]);
      tramite.historial = obtenerEventosHistorialPorId(id);
      return responderJSON({ success: true, tramite: tramite });
    }
  }
  return responderJSON({ success: false, message: 'Trámite no encontrado.' });
}

function obtenerEstadisticasDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.TRAMITES);
  if (!sheet) return responderJSON({ success: true, estadisticas: {} });

  const rows = sheet.getDataRange().getValues();
  let total = 0, pendientes = 0, finalizados = 0, consolidados = 0, noConsolidados = 0;

  const porDelegado = {
    'Maycol Ávila': { total: 0, pendientes: 0, finalizados: 0 },
    'Ximena Veliz': { total: 0, pendientes: 0, finalizados: 0 }
  };

  for (let i = 1; i < rows.length; i++) {
    total++;
    const mod = String(rows[i][6]).toUpperCase();
    const del = String(rows[i][9]);
    const est = String(rows[i][10]).toUpperCase();

    if (est === 'PENDIENTE') pendientes++;
    if (est === 'FINALIZADO') finalizados++;
    if (mod === 'CONSOLIDADO') consolidados++;
    if (mod === 'NO CONSOLIDADO') noConsolidados++;

    if (porDelegado[del]) {
      porDelegado[del].total++;
      if (est === 'PENDIENTE') porDelegado[del].pendientes++;
      if (est === 'FINALIZADO') porDelegado[del].finalizados++;
    }
  }

  return responderJSON({
    success: true,
    estadisticas: {
      total: total,
      pendientes: pendientes,
      finalizados: finalizados,
      consolidados: consolidados,
      noConsolidados: noConsolidados,
      porDelegado: porDelegado
    },
    timestamp: Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, 'HH:mm')
  });
}

function registrarEventoHistorial(tramiteId, nCorrelativo, tipoOperacion, titulo, descripcion, usuario) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.HOJAS.HISTORIAL);
    if (!sheet) sheet = crearHojaSiNoExiste(ss, CONFIG.HOJAS.HISTORIAL, ESQUEMA_HOJAS.HISTORIAL);

    sheet.appendRow([
      'evt-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000),
      tramiteId, nCorrelativo, tipoOperacion, titulo, descripcion,
      obtenerFechaHoraActual(), usuario
    ]);
  } catch (e) {
    Logger.log('Error en historial: ' + e.toString());
  }
}

function obtenerEventosHistorialPorId(tramiteId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.HISTORIAL);
  if (!sheet) return [];

  const rows = sheet.getDataRange().getValues();
  const historial = [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === String(tramiteId)) {
      historial.push({
        id: String(rows[i][0]),
        tipo: String(rows[i][3]),
        titulo: String(rows[i][4]),
        descripcion: String(rows[i][5]),
        fechaHora: String(rows[i][6]),
        usuario: String(rows[i][7])
      });
    }
  }
  return historial;
}

function formatearFechaEnEspanol(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return Utilities.formatDate(val, CONFIG.ZONA_HORARIA, 'dd/MM/yyyy HH:mm');
  }
  var s = String(val).trim();
  if (!s) return '';
  if (/^\d{2}\/\d{2}\/\d{4}/.test(s)) return s;
  try {
    var clean = s.replace(/\s*\([^)]*\)/g, '').trim();
    var d = new Date(clean);
    if (!isNaN(d.getTime())) {
      return Utilities.formatDate(d, CONFIG.ZONA_HORARIA, 'dd/MM/yyyy HH:mm');
    }
  } catch (e) {}
  return s;
}

function formatearFilaATramite(r) {
  return {
    id: String(r[0]),
    numero: String(r[1]),
    correlativo: Number(r[2]),
    nombreCompleto: String(r[3]),
    cedulaIdentidad: String(r[4]),
    flujo: String(r[5]),
    modalidad: String(r[6]),
    queEstaCorrigiendo: String(r[7]),
    detalleCorreccion: String(r[8] || ''),
    delegado: String(r[9]),
    estado: String(r[10]),
    fechaRecepcion: formatearFechaEnEspanol(r[11]),
    fechaFinalizacion: r[12] ? formatearFechaEnEspanol(r[12]) : '',
    usuarioRegistro: String(r[13]),
    usuarioFinalizo: r[14] ? String(r[14]) : '',
    observaciones: r[15] ? String(r[15]) : '',
    historial: []
  };
}

function responderJSON(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
