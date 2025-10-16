import { create } from '@/lib/zustand-lite'
import type { UserProfile } from '@/lib/entities'

type Nullable<T> = T | null

interface AuthState {
  user: Nullable<UserProfile>
  token: Nullable<string>
  loading: boolean
  initialized: boolean
  setUser: (user: Nullable<UserProfile>) => void
  setToken: (token: Nullable<string>) => void
  setLoading: (loading: boolean) => void
  markInitialized: () => void
  logout: () => void
}

const STORAGE_KEY = 'lumanagi-auth-token'
const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token })
    if (hasStorage) {
      try {
        if (token) {
          window.localStorage.setItem(STORAGE_KEY, token)
        } else {
          window.localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.warn('Unable to persist auth token', error)
      }
    }
  },
  setLoading: (loading) => set({ loading }),
  markInitialized: () => set({ initialized: true }),
  logout: () => {
    set({ user: null, token: null })
    if (hasStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.warn('Unable to clear auth token', error)
      }
    }
  }
}))

export const getAuthToken = () => {
  const tokenFromStore = useAuthStore.getState().token
  if (tokenFromStore) return tokenFromStore
  if (hasStorage) {
    try {
      return window.localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }
  return null
}

export const clearAuthState = () => {
  useAuthStore.setState({ user: null, token: null })
}

export const setAuthenticatedUser = (user: Nullable<UserProfile>, token?: string | null) => {
  useAuthStore.setState({ user })
  if (typeof token !== 'undefined') {
    useAuthStore.getState().setToken(token)
  }
}
