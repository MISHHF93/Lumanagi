import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

const defaultBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? `${defaultBaseUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('lumanagi.authToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof Error && !(error as AxiosError).isAxiosError) {
    return error as ApiError;
  }

  const axiosError = error as AxiosError;
  const apiError: ApiError = new Error(
    axiosError.response?.data?.message ?? axiosError.message ?? 'Unexpected API error'
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
