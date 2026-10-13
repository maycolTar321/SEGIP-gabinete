/**
 * Utilidades de normalización de texto institucional según reglas SEGIP
 */

/**
 * Normaliza el Nombre Completo a formato de inicial mayúscula por palabra y resto minúsculas.
 * Conserva tildes, diéresis y la letra Ñ. Remueve espacios duplicados.
 * Ejemplo: "JUAN CARLOS MAMANI QUISPE" -> "Juan Carlos Mamani Quispe"
 * Ejemplo: "mArÍa fErNaNdA" -> "María Fernanda"
 */
export function formatearNombreCompleto(texto: string): string {
  if (!texto) return '';
  const limpio = texto.trim().replace(/\s+/g, ' ');
  return limpio
    .toLowerCase()
    .split(' ')
    .map((palabra) => {
      if (!palabra) return '';
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(' ');
}

/**
 * Normaliza el Detalle de la Corrección: Primera letra en mayúscula y el resto en minúsculas.
 * Conserva tildes y caracteres en español.
 * Ejemplo: "CORRECCIÓN DE NOMBRE EN EL REGISTRO CIVIL" -> "Corrección de nombre en el registro civil"
 */
export function formatearDetalleCorreccion(texto: string): string {
  if (!texto) return '';
  const limpio = texto.trim().replace(/\s+/g, ' ');
  if (!limpio) return '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
}

/**
 * Normaliza el Tipo de Saneamiento: Primera letra mayúscula y resto minúsculas conservando tildes.
 * Ejemplo: "NOMBRES Y APELLIDOS" -> "Nombres y apellidos"
 */
export function formatearTipoSaneamiento(texto: string): string {
  if (!texto) return '';
  const limpio = texto.trim();
  if (!limpio) return '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
}

/**
 * Formatea la Cédula de Identidad con Complemento si existe
 * Ejemplo: "4154637", "1A" -> "4154637-1A"
 */
export function formatearCIConComplemento(ci: string, tieneComplemento?: boolean, complemento?: string): string {
  const ciLimpia = (ci || '').trim();
  if (tieneComplemento && complemento && complemento.trim()) {
    return `${ciLimpia}-${complemento.trim().toUpperCase()}`;
  }
  return ciLimpia;
}
