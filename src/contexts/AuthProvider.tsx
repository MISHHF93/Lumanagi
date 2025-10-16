import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { User } from '@/api/entities'
import type { UserProfile } from '@/lib/entities'
import { useAuthStore } from '@/store/authStore'

interface AuthContextValue {
  user: UserProfile | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
  setUser: (user: UserProfile | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)
  const markInitialized = useAuthStore((state) => state.markInitialized)
  const logoutStore = useAuthStore((state) => state.logout)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const profile = await User.me()
      setUser(profile)
    } catch (error) {
      console.warn('Falling back to offline user profile', error)
      const fallback = await User.fallback()
      setUser(fallback)
    } finally {
      setLoading(false)
      markInitialized()
    }
  }, [markInitialized, setLoading, setUser])

  useEffect(() => {
    refresh().catch((error) => {
      console.error('Failed to initialize auth context', error)
    })
  }, [refresh])

  const logout = useCallback(async () => {
    await User.logout()
    logoutStore()
  }, [logoutStore])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, refresh, logout, setUser }),
    [loading, logout, refresh, setUser, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
