import { create } from 'zustand';
import { api } from '../services/api';
import type { AdvisorProfile } from '../types';

const TOKEN_KEY = 'mf_advisor_jwt';
const EXPIRES_KEY = 'mf_advisor_jwt_expires_at';

interface AdvisorAuthState {
  token: string | null;
  expiresAt: number | null;
  advisor: AdvisorProfile | null;
  sessionTimeRemaining: number;
  setSession: (token: string, expiresAt: number) => void;
  setAdvisor: (advisor: AdvisorProfile | null) => void;
  logout: () => void;
  tick: () => void;
}

function applyAuthHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

function readStoredSession(): { token: string | null; expiresAt: number | null } {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiresAtRaw = sessionStorage.getItem(EXPIRES_KEY);
  const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;
  if (token && expiresAt && expiresAt > Date.now()) {
    return { token, expiresAt };
  }
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
  return { token: null, expiresAt: null };
}

const initial = readStoredSession();
applyAuthHeader(initial.token);

export const useAdvisorAuthStore = create<AdvisorAuthState>((set, get) => ({
  token: initial.token,
  expiresAt: initial.expiresAt,
  advisor: null,
  sessionTimeRemaining: initial.expiresAt
    ? Math.max(0, Math.round((initial.expiresAt - Date.now()) / 1000))
    : 0,

  setSession: (token, expiresAt) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(EXPIRES_KEY, String(expiresAt));
    applyAuthHeader(token);
    set({ token, expiresAt, sessionTimeRemaining: Math.round((expiresAt - Date.now()) / 1000) });
  },

  setAdvisor: (advisor) => set({ advisor }),

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);
    applyAuthHeader(null);
    set({ token: null, expiresAt: null, advisor: null, sessionTimeRemaining: 0 });
  },

  tick: () => {
    const { expiresAt } = get();
    if (!expiresAt) return;
    const remaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
    set({ sessionTimeRemaining: remaining });
  },
}));

// Auto-logout on any 401 from the backend (e.g. expired/invalid JWT mid-request).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && useAdvisorAuthStore.getState().token) {
      useAdvisorAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
