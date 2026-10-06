import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storageGet, storageSet, KEYS } from './utils/storage';

type Theme = 'light' | 'dark' | 'system';
interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; resolved: 'light' | 'dark'; }

const Ctx = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {}, resolved: 'dark' });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => storageGet(KEYS.THEME, 'dark'));
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

  const setTheme = (t: Theme) => { setThemeState(t); storageSet(KEYS.THEME, t); };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const r = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme;
      setResolved(r);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(r);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme, resolved }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
