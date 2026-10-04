import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function Header({ title, onToggleSidebar }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className={`sticky top-0 z-30 h-16 flex items-center justify-between px-6 glass-effect`}>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-colors ${
            resolvedTheme === 'dark' ? 'hover:bg-surface-700 text-surface-300' : 'hover:bg-surface-100 text-surface-600'
          }`}
        >
          <Menu size={20} />
        </button>
        <h2 className={`text-lg font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${
          resolvedTheme === 'dark' ? 'bg-surface-800 border border-surface-700' : 'bg-surface-100 border border-surface-200'
        }`}>
          <Search size={16} className={resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'} />
          <input
            type="text"
            placeholder={t('action.search')}
            className={`bg-transparent outline-none text-sm w-48 ${
              resolvedTheme === 'dark' ? 'text-surface-200 placeholder:text-surface-500' : 'text-surface-800 placeholder:text-surface-400'
            }`}
          />
        </div>

        <button className={`relative p-2 rounded-lg transition-colors ${
          resolvedTheme === 'dark' ? 'hover:bg-surface-700 text-surface-300' : 'hover:bg-surface-100 text-surface-600'
        }`}>
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}
