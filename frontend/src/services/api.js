import { ApiClient } from './ApiClient.js';

export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
});