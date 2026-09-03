import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        updateTheme(theme);
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        updateTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
        };
      }),
      // Older builds persisted 'system'; coerce anything unknown to light.
      merge: (persisted, current) => {
        const stored = (persisted as { theme?: string } | undefined)?.theme;
        return { ...current, theme: stored === 'dark' ? 'dark' : 'light' };
      },
    }
  )
);

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'dark' ? 'dark' : 'light';
}

function updateTheme(theme: Theme) {
  const effective = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(effective);
  root.setAttribute('data-theme', effective);
}
