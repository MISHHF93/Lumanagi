import { create } from '@/lib/zustand-lite'

type Theme = 'light' | 'dark'

interface UIState {
  theme: Theme
  commandPaletteOpen: boolean
  collapsedGroups: Record<string, boolean>
  setTheme: (theme: Theme) => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleSidebarGroup: (groupId: string) => void
  loadSidebarState: () => void
}

const SIDEBAR_STORAGE_KEY = 'lumanagi-sidebar-groups'
const THEME_STORAGE_KEY = 'lumanagi-theme'

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`Failed to read ${key} from storage`, error)
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to persist ${key} to storage`, error)
  }
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark',
  commandPaletteOpen: false,
  collapsedGroups: {},
  setTheme: (theme) => {
    set({ theme })
    writeJSON(THEME_STORAGE_KEY, theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleSidebarGroup: (groupId) => {
    const next = { ...get().collapsedGroups, [groupId]: !get().collapsedGroups[groupId] }
    set({ collapsedGroups: next })
    writeJSON(SIDEBAR_STORAGE_KEY, next)
  },
  loadSidebarState: () => {
    const collapsed = readJSON<Record<string, boolean>>(SIDEBAR_STORAGE_KEY, {})
    const theme = readJSON<Theme>(THEME_STORAGE_KEY, 'dark')
    set({ collapsedGroups: collapsed, theme })
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
}))
