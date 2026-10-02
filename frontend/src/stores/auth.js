import { defineStore } from 'pinia';
import { AuthApi } from '@/services/AuthApi.js';
import { apiClient } from '@/services/api.js';

const authApi = new AuthApi(apiClient);

function applySession(state, result) {
  state.user = result.user;
  state.accessToken = result.accessToken;
  apiClient.setAccessToken(result.accessToken);
}

function clearSession(state) {
  state.user = null;
  state.accessToken = null;
  apiClient.setAccessToken(null);
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    loading: false,
    initialized: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    canWrite: (state) => Boolean(state.user?.canWrite),
    isAdmin: (state) => Boolean(state.user?.isAdmin),
    displayName: (state) => state.user?.name ?? '',
    role: (state) => state.user?.role ?? '',
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const result = await authApi.login(credentials);
        applySession(this, result);
        this.initialized = true;
        return result.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async restoreSession() {
      if (this.initialized) return;
      try {
        const result = await authApi.refresh();
        applySession(this, result);
      } catch {
        clearSession(this);
      } finally {
        this.initialized = true;
      }
    },

    async logout() {
      try {
        await authApi.logout();
      } catch {
        clearSession(this);
        return;
      }
      clearSession(this);
    },

    expireSession() {
      clearSession(this);
    },
  },
});