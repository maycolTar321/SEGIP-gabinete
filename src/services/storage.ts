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
    rol: 'OPERADOR',
  },
];

// URL Oficial de la Web App en Google Apps Script
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwTl7eqlnCYKnNiTrwi6SMHYVPV4hcFHNB1ImfinMzNm9L88qbDDRRW9OoGNkmCsuEUmg/exec';

const STORAGE_KEY_USER = 'segip_gabinete_current_user_v3';
const STORAGE_KEY_API_URL = 'segip_gabinete_gas_api_url_v3';
const STORAGE_KEY_SYNC_INTERVAL = 'segip_gabinete_sync_interval_v3';

export const storageService = {
  getCurrentUser(): UsuarioActivo {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return USUARIOS_AUTORIZADOS[0]; // Maycol Ávila (ADMINISTRADOR) por defecto
  },

  setCurrentUser(user: UsuarioActivo): void {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch {}
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
};
