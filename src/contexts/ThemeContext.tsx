import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: 'light' | 'dark';
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('pc-theme') as Theme) || 'dark');
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => {
      const r = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme;
      setResolved(r);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(r);
    };
    resolve();
    mq.addEventListener('change', resolve);
    localStorage.setItem('pc-theme', theme);
    return () => mq.removeEventListener('change', resolve);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme, resolved }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => { const c = useContext(ThemeContext); if (!c) throw new Error('no theme'); return c; };
