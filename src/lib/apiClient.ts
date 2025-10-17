import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

const defaultBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000';

const viteApiBase =
  (typeof process !== 'undefined' && (process.env as any).VITE_API_BASE_URL) ??
  (typeof (globalThis as any).VITE_API_BASE_URL !== 'undefined' ? (globalThis as any).VITE_API_BASE_URL : undefined);

export const apiClient: AxiosInstance = axios.create({
  baseURL: viteApiBase ?? `${defaultBaseUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('lumanagi.authToken');
    if (token) {
      config.headers = config.headers ?? ({} as AxiosRequestHeaders);
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof Error && !(error as AxiosError).isAxiosError) {
    return error as ApiError;
  }

  const axiosError = error as AxiosError;
  const data = axiosError.response?.data;
  const messageFromData = data && typeof (data as any).message === 'string' ? (data as any).message : undefined;
  const apiError: ApiError = new Error(
    messageFromData ?? axiosError.message ?? 'Unexpected API error'
  );

  apiError.status = axiosError.response?.status;
  apiError.details = axiosError.response?.data;
  return apiError;
};

export async function request<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'get', url });
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'post', url, data });
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'patch', url, data });
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'delete', url });
}
