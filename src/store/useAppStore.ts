import { create } from 'zustand';
import { User } from '@/api/entities';
import type { UserProfile } from '@/lib/entities';

type ThemePreference = 'light' | 'dark' | 'system';
type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AppState {
  user: UserProfile | null;
  userStatus: LoadStatus;
  theme: ThemePreference;
  sidebarCollapsed: boolean;
  setUser: (profile: UserProfile | null) => void;
  setUserStatus: (status: LoadStatus) => void;
  fetchUser: () => Promise<UserProfile | null>;
  setTheme: (theme: ThemePreference) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const THEME_STORAGE_KEY = 'lumanagi.theme-preference';

function getStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
  return stored ?? 'dark';
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  userStatus: 'idle',
  theme: getStoredTheme(),
  sidebarCollapsed: false,
  setUser: (profile) => set({ user: profile }),
  setUserStatus: (status) => set({ userStatus: status }),
  async fetchUser() {
    const { userStatus } = get();
    if (userStatus === 'loading') {
      return get().user;
    }
    set({ userStatus: 'loading' });
    try {
      const profile = await User.me();
      set({ user: profile, userStatus: 'ready' });
      return profile;
    } catch (error) {
      console.error('Failed to load current user', error);
      set({ userStatus: 'error' });
      return null;
    }
  },
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  },
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
}));
