'use client';

import { useEffect, useState } from 'react';
import { useThemeStore, resolveTheme } from '@/lib/stores/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const effective = resolveTheme(theme);
    root.classList.remove('light', 'dark');
    root.classList.add(effective);
    root.setAttribute('data-theme', effective);
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
