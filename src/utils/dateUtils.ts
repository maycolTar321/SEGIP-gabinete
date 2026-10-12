/**
 * Utilidades para formatear fechas siempre en español boliviano
 * Convierte formatos como "Mon Oct 12 2026 18:37:00 GMT-0400 (hora de Bolivia)"
 * a un formato limpio y legible: "12/10/2026 18:37"
 */

export function formatearFechaEspanol(fechaStr: string | undefined | null): string {
  if (!fechaStr) return 'Sin fecha';
  const str = String(fechaStr).trim();
  if (!str) return 'Sin fecha';

  // Si ya viene en formato limpio DD/MM/YYYY HH:mm o DD/MM/YYYY
  const regexLimpio = /^\d{2}\/\d{2}\/\d{4}(\s+\d{2}:\d{2})?$/;
  if (regexLimpio.test(str)) {
    return str;
  }

  // Eliminar nombres de zona horaria entre paréntesis como "(hora de Bolivia)"
  const cleanStr = str.replace(/\s*\([^)]*\)/g, '').trim();

  // Intentar parsear como objeto Date
  const dateObj = new Date(cleanStr);
  if (!isNaN(dateObj.getTime())) {
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const anio = dateObj.getFullYear();
    const hora = String(dateObj.getHours()).padStart(2, '0');
    const minutos = String(dateObj.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
  }

  return str;
}

export function formatearHoraEspanol(fechaStr: string | undefined | null): string {
  if (!fechaStr) return '--:--';
  const str = String(fechaStr).trim();
  if (!str) return '--:--';

  // Si viene como "12/10/2026 18:37", extraer la hora
  const partes = str.split(' ');
  if (partes.length === 2 && /^\d{2}:\d{2}$/.test(partes[1])) {
    return partes[1];
  }

  // Limpiar y parsear
  const cleanStr = str.replace(/\s*\([^)]*\)/g, '').trim();
  const dateObj = new Date(cleanStr);
  if (!isNaN(dateObj.getTime())) {
    const hora = String(dateObj.getHours()).padStart(2, '0');
    const minutos = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hora}:${minutos}`;
  }

  return '08:24';
}
