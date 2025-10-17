import axios, { type AxiosRequestHeaders } from 'axios'
import { clearAuthState, getAuthToken } from '@/store/authStore'

const baseURL = (process.env.VITE_API_BASE_URL as string) || '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers ?? ({} as AxiosRequestHeaders)
    ; (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message || error.message || 'Unexpected API error'

    if (status === 401) {
      clearAuthState()
    }

    return Promise.reject(new ApiError(message, status, error.response?.data))
  }
)

export const isApiAvailable = async () => {
  try {
    await apiClient.get('/healthz')
    return true
  } catch (error) {
    console.warn('API health check failed', error)
    return false
  }
}
