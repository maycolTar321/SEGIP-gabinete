import type { UsuarioActivo } from '../types';

export const USUARIOS_AUTORIZADOS: UsuarioActivo[] = [
  {
    id: 'usr-admin',
    nombre: 'Maycol Ávila',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'ADMINISTRADOR',
  },
  {
    id: 'usr-ximena',
    nombre: 'Ximena Veliz',
    cargo: 'Delegado Gabinete Jurídico',
    rol: 'OPERADOR',
  },
  {
    id: 'usr-maycol',
    nombre: 'SAMUEL',
    cargo: 'DESCARTE',
    rol: 'DESCARTE',
  },
];

// URL Oficial de la Web App en Google Apps Script
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbyQkzv1pQj_iQrdSJZMUhVdC5YpepNI-VcLqW3Zuqm-J17do6BkxGPFN0rO7OSipO2sgw/exec';

const STORAGE_KEY_SESSION = 'segip_gabinete_session_v5';
const STORAGE_KEY_API_URL = 'segip_gabinete_gas_api_url_v5';
const STORAGE_KEY_SYNC_INTERVAL = 'segip_gabinete_sync_interval_v5';

// Limpieza proactiva de claves de sesión previas
try {
  ['segip_gabinete_session_v4', 'segip_gabinete_session_v3', 'segip_gabinete_session_v2', 'segip_gabinete_session'].forEach((k) => {
    localStorage.removeItem(k);
  });
} catch {}

export interface UserSession {
  token: string;
  usuario: UsuarioActivo;
  expiraMs: number;
}

export const storageService = {
  getSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (raw) {
        const session: UserSession = JSON.parse(raw);
        if (session && session.expiraMs && Date.now() < session.expiraMs) {
          // Normalizar rol de SAMUEL a DESCARTE si viniera como PORTERO
          if (session.usuario && (session.usuario.rol === 'PORTERO' || session.usuario.cargo === 'DESCARTE')) {
            session.usuario.rol = 'DESCARTE';
          }
          return session;
        } else {
          // Sesión expirada
          localStorage.removeItem(STORAGE_KEY_SESSION);
        }
      }
    } catch {}
    return null;
  },

  setSession(token: string, usuario: UsuarioActivo, expiraMs: number): void {
    try {
      // Normalizar para Samuel
      if (usuario.rol === 'PORTERO' || usuario.id === 'usr-maycol' || usuario.nombre.toUpperCase() === 'SAMUEL') {
        usuario.rol = 'DESCARTE';
        usuario.cargo = 'DESCARTE';
      }
      const session: UserSession = {
        token,
        usuario,
        expiraMs,
      };
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    } catch {}
  },

  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch {}
  },

  getCurrentUser(): UsuarioActivo | null {
    const session = this.getSession();
    return session ? session.usuario : null;
  },

  getApiUrl(): string {
    return localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_GAS_URL;
  },

  setApiUrl(url: string): void {
    localStorage.setItem(STORAGE_KEY_API_URL, url.trim());
  },

  getSyncInterval(): number {
    const val = localStorage.getItem(STORAGE_KEY_SYNC_INTERVAL);
    const num = val ? Number(val) : 12;
    return num >= 10 && num <= 30 ? num : 12;
  },

  setSyncInterval(seconds: number): void {
    const clamped = Math.max(10, Math.min(30, seconds));
    localStorage.setItem(STORAGE_KEY_SYNC_INTERVAL, String(clamped));
  },

  getDeletedIds(): string[] {
    try {
      const raw = localStorage.getItem('segip_gabinete_deleted_ids_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addDeletedId(id: string): void {
    try {
      const current = this.getDeletedIds();
      if (!current.includes(id)) {
        current.push(id);
        localStorage.setItem('segip_gabinete_deleted_ids_v1', JSON.stringify(current));
      }
    } catch {}
  },
};

