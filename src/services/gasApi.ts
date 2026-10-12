import type { Tramite } from '../types';
import { storageService } from './storage';

export interface SyncResult {
  success: boolean;
  data?: Tramite[];
  timestamp?: string;
  source: 'NETWORK' | 'CACHE';
  message?: string;
  sequenceId: number;
}

class GasApiClient {
  private lastSequenceId = 0;
  private isRequestInFlight = false;
  private inMemoryCache: Tramite[] = [];
  private lastSyncTimestamp = '';

  /**
   * Obtiene el listado de trámites con reintentos y control de secuencias
   */
  public async fetchTramites(force = false): Promise<SyncResult> {
    const sequenceId = ++this.lastSequenceId;

    // 1. Evitar solicitudes duplicadas simultáneas
    if (this.isRequestInFlight && !force) {
      return {
        success: true,
        data: this.inMemoryCache,
        timestamp: this.lastSyncTimestamp,
        source: 'CACHE',
        message: 'Solicitud previa aún en curso; usando caché en memoria.',
        sequenceId: this.lastSequenceId,
      };
    }

    const apiUrl = storageService.getApiUrl();
    if (!apiUrl) {
      return {
        success: false,
        data: this.inMemoryCache,
        timestamp: this.lastSyncTimestamp,
        source: 'CACHE',
        message: 'URL de Google Apps Script no configurada.',
        sequenceId,
      };
    }

    this.isRequestInFlight = true;

    // 2. Reintento con backoff suave ante errores transitorios (máx 2 reintentos)
    let intentos = 0;
    const maxIntentos = 2;
    let ultimoError: any = null;

    while (intentos <= maxIntentos) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const response = await fetch(`${apiUrl}?action=getTramites&_t=${Date.now()}`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const resJson = await response.json();

        // 3. Evitar que una respuesta tardía sobrescriba una más reciente
        if (sequenceId < this.lastSequenceId) {
          this.isRequestInFlight = false;
          return {
            success: true,
            data: this.inMemoryCache,
            timestamp: this.lastSyncTimestamp,
            source: 'CACHE',
            message: 'Respuesta descartada: llegó una actualización más reciente.',
            sequenceId: this.lastSequenceId,
          };
        }

        if (resJson.success && Array.isArray(resJson.tramites)) {
          this.inMemoryCache = resJson.tramites;
          this.lastSyncTimestamp = resJson.timestamp || new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
          this.isRequestInFlight = false;

          return {
            success: true,
            data: resJson.tramites,
            timestamp: this.lastSyncTimestamp,
            source: 'NETWORK',
            sequenceId,
          };
        } else {
          throw new Error(resJson.message || 'Estructura inválida devuelta por Apps Script');
        }
      } catch (err: any) {
        ultimoError = err;
        intentos++;
        if (intentos <= maxIntentos) {
          // Espera exponencial: 800ms, luego 1600ms
          await new Promise((resolve) => setTimeout(resolve, intentos * 800));
        }
      }
    }

    this.isRequestInFlight = false;

    return {
      success: false,
      data: this.inMemoryCache,
      timestamp: this.lastSyncTimestamp,
      source: 'CACHE',
      message: `El servidor no respondió tras ${maxIntentos + 1} intentos (${ultimoError?.message || 'Error de red'}).`,
      sequenceId,
    };
  }

  /**
   * Guarda o actualiza un trámite de manera idempotente
   */
  public async guardarTramite(
    tramite: Tramite,
    usuarioResponsable: string
  ): Promise<{ success: boolean; tramite?: Tramite; message?: string }> {
    const apiUrl = storageService.getApiUrl();
    if (!apiUrl) {
      return { success: false, message: 'URL del backend no configurada.' };
    }

    // Actualización optimista en la memoria local
    const index = this.inMemoryCache.findIndex((t) => t.id === tramite.id);
    if (index >= 0) {
      this.inMemoryCache[index] = tramite;
    } else {
      this.inMemoryCache.unshift(tramite);
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Evita preflight CORS en Google Apps Script
        },
        body: JSON.stringify({
          action: 'guardarTramite',
          data: tramite,
          usuarioResponsable,
        }),
      });

      const res = await response.json();
      if (res.success && res.tramite) {
        // Reemplazar con la respuesta oficial del servidor (incluye correlativo final)
        const idx = this.inMemoryCache.findIndex((t) => t.id === res.tramite.id);
        if (idx >= 0) {
          this.inMemoryCache[idx] = res.tramite;
        }
        return { success: true, tramite: res.tramite };
      }

      return {
        success: false,
        message: res.message || 'No se pudo guardar el trámite en Google Sheets.',
      };
    } catch (err: any) {
      // 4. Verificación de resultado incierto: No duplicar ciegamente
      // Comprobar si el trámite logró guardarse antes del corte de conexión
      try {
        const verifyRes = await fetch(`${apiUrl}?action=getDetalle&id=${tramite.id}&_t=${Date.now()}`);
        if (verifyRes.ok) {
          const verifyJson = await verifyRes.json();
          if (verifyJson.success && verifyJson.tramite) {
            return {
              success: true,
              tramite: verifyJson.tramite,
              message: 'Trámite confirmado en el servidor tras reconexión.',
            };
          }
        }
      } catch {}

      return {
        success: false,
        message: 'No se pudo confirmar el guardado en el servidor. Verifique su conexión y vuelva a intentarlo.',
      };
    }
  }

  /**
   * Finalización controlada con confirmación y usuario responsable
   */
  public async finalizarTramite(
    id: string,
    observaciones: string | undefined,
    usuarioResponsable: string
  ): Promise<{ success: boolean; message?: string }> {
    const apiUrl = storageService.getApiUrl();
    if (!apiUrl) {
      return { success: false, message: 'URL del backend no configurada.' };
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'finalizarTramite',
          data: { id, observaciones },
          usuarioResponsable,
        }),
      });

      const res = await response.json();
      if (res.success) {
        // Actualizar localmente
        const item = this.inMemoryCache.find((t) => t.id === id);
        if (item) {
          item.estado = 'FINALIZADO';
          item.fechaFinalizacion = res.fechaFinalizacion;
          item.usuarioFinalizo = res.usuarioFinalizo;
        }
        return { success: true };
      }

      return { success: false, message: res.message || 'Error al finalizar trámite.' };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error de conexión al finalizar el trámite. Por favor verifique la red.',
      };
    }
  }

  public getCache(): Tramite[] {
    return this.inMemoryCache;
  }
}

export const gasApiService = new GasApiClient();
