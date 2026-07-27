import axios, { AxiosError, AxiosHeaders, type AxiosInstance, type AxiosResponse } from 'axios';

import { API_BASE_URL, AUTH_STORAGE_KEY } from '@/config';
import { SUCCESS_CODE, type ApiEnvelope } from '@/types';

// ---- token helpers (session-scoped, mirrors legacy webapp) -----------------
export const tokenStore = {
  get: (): string | null => sessionStorage.getItem(AUTH_STORAGE_KEY),
  set: (token: string) => sessionStorage.setItem(AUTH_STORAGE_KEY, token),
  clear: () => sessionStorage.removeItem(AUTH_STORAGE_KEY)
};

export class ApiException extends Error {
  code: number;
  status?: number;
  constructor(message: string, code: number, status?: number) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
  }
}

const axiosServices: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30000
});

// ---- request: attach bearer token ------------------------------------------
axiosServices.interceptors.request.use((requestConfig) => {
  const token = tokenStore.get();
  if (token) {
    const headers = AxiosHeaders.from(requestConfig.headers);
    headers.set('Authorization', `Bearer ${token}`);
    requestConfig.headers = headers;
  }
  return requestConfig;
});

// ---- response: normalize the { code, message, data } envelope --------------
axiosServices.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    const body = response.data;
    // Some endpoints (health) may not follow the envelope — pass through.
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code !== SUCCESS_CODE && body.code >= 400) {
        return Promise.reject(new ApiException(body.message || 'Request failed', body.code, response.status));
      }
    }
    return response;
  },
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const status = error.response?.status;
    const body = error.response?.data;
    const message = body?.message || error.message || 'Network error';

    // auto sign-out on 401 (except the login call itself)
    if (status === 401 && !error.config?.url?.includes('/auth/login')) {
      tokenStore.clear();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(new ApiException(message, body?.code ?? status ?? 0, status));
  }
);

export default axiosServices;

// Unwrap the envelope `data` field from a response.
export function unwrap<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  return response.data.data;
}

// Unwrap both `data` and pagination `meta`.
export function unwrapList<T>(response: AxiosResponse<ApiEnvelope<T[]>>) {
  const { data, meta } = response.data;
  return {
    items: data ?? [],
    meta: meta ?? { page: 1, pageSize: data?.length ?? 0, total: data?.length ?? 0, totalPages: 1 }
  };
}
