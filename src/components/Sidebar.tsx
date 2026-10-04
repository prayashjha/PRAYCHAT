import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard, Users, Flag, UsersRound, Network,
  Settings, Rocket, Sun, Moon, Monitor, Globe
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { id: 'users', icon: Users, labelKey: 'nav.users' },
  { id: 'reports', icon: Flag, labelKey: 'nav.reports' },
  { id: 'groups', icon: UsersRound, labelKey: 'nav.groups' },
  { id: 'architecture', icon: Network, labelKey: 'nav.architecture' },
  { id: 'configuration', icon: Settings, labelKey: 'nav.configuration' },
  { id: 'production', icon: Rocket, labelKey: 'nav.production' },
];

export default function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } ${resolvedTheme === 'dark' ? 'bg-surface-900 border-r border-surface-700' : 'bg-white border-r border-surface-200'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-inherit">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-sm gradient-text">PrayChat</h1>
            <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              {t('app.tagline')}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-3 border-t ${
        resolvedTheme === 'dark' ? 'border-surface-700' : 'border-surface-200'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className={`sidebar-item flex-1 ${collapsed ? 'justify-center' : ''}`}
            title={t(`theme.${theme}`)}
          >
            {theme === 'system' ? <Monitor size={18} /> : <ThemeIcon size={18} />}
            {!collapsed && <span className="text-xs">{t(`theme.${theme}`)}</span>}
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className={`sidebar-item ${collapsed ? 'justify-center' : ''}`}
            title={language === 'en' ? 'हिंदी' : 'English'}
          >
            <Globe size={18} />
            {!collapsed && <span className="text-xs">{language === 'en' ? 'EN' : 'हि'}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
