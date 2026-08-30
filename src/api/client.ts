import { create, isAxiosError } from 'axios';

export const isApiConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && isApiConfigured) {
      console.error(`[API Error] ${error.config?.url ?? ''}:`, error.message);
    }
    return Promise.reject(error);
  },
);
