import axios from 'axios';

import { useAuthStore } from '../store/authStore';
import { env } from '../utils/env';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!env.isDemoMode && error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

type ValidationErrorItem = {
  msg?: string;
  loc?: (string | number)[];
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timed out. Please try again.';
      }
      if (env.isDemoMode) {
        return 'Something went wrong in demo mode. Please refresh and try again.';
      }
      return 'Cannot reach the server. Start the backend API on port 8000, then try again.';
    }

    const data = error.response.data as {
      detail?: unknown;
      message?: string;
    };

    if (typeof data?.detail === 'string') return data.detail;
    if (typeof data?.message === 'string') return data.message;

    if (Array.isArray(data?.detail)) {
      const first = data.detail[0] as ValidationErrorItem;
      if (first?.msg) {
        const field = first.loc?.slice(-1)[0];
        return field ? `${String(field)}: ${first.msg}` : first.msg;
      }
    }
  }

  return fallback;
}
