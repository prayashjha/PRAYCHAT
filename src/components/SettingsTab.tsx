// SettingsTab - Settings screen
// Profile, theme, language, logout, delete account

import React, { useState } from 'react';
import { useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { useLang } from '../LanguageContext';
import { User, Shield, Bell, Lock, Globe, Moon, Sun, Monitor, LogOut, Trash2, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function SettingsTab({ onBack }: Props) {
  const { resolved, theme, setTheme } = useTheme();
  const { t, lang, setLang } = useLang();
  const { user, logout, deleteAccount, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [about, setAbout] = useState(user?.about || '');

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ name: name.trim(), about: about.trim() });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleDelete = () => {
    if (confirm(t('deleteConfirm'))) {
      deleteAccount();
    }
  };

  if (editing) {
    return (
      <div className={`h-full flex flex-col ${resolved === 'dark' ? 'bg-surface-900' : 'bg-surface-50'}`}>
        <header className={`flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'bg-surface-900 border-b border-surface-800' : 'bg-white border-b border-surface-200'}`}>
          <button onClick={() => setEditing(false)} className="p-1">←</button>
          <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('editProfile')}</h2>
          <button onClick={handleSave} className="ml-auto text-primary-500 font-semibold text-sm">{t('save')}</button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold" style={{ backgroundColor: user.avatar }}>
              {user.name[0]}
            </div>
          </div>
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('name')}</label>
            <input value={name} onChange={e => setName(e.target.value)} className={`w-full mt-1 px-4 py-3 rounded-xl outline-none ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700' : 'bg-white text-surface-900 border border-surface-200'}`} maxLength={50} />
          </div>
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('about')}</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} className={`w-full mt-1 px-4 py-3 rounded-xl outline-none resize-none h-24 ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700' : 'bg-white text-surface-900 border border-surface-200'}`} maxLength={200} />
          </div>
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('phoneNum')}</label>
            <input value={user.phone} disabled className={`w-full mt-1 px-4 py-3 rounded-xl outline-none opacity-60 ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700' : 'bg-white text-surface-900 border border-surface-200'}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${resolved === 'dark' ? 'bg-surface-900' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'bg-surface-900 border-b border-surface-800' : 'bg-white border-b border-surface-200'}`}>
        <button onClick={onBack} className="p-1">←</button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('settings')}</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        {/* Profile card */}
        <button onClick={() => setEditing(true)} className={`w-full mx-4 mt-4 p-4 rounded-2xl flex items-center gap-4 ${resolved === 'dark' ? 'bg-surface-800 hover:bg-surface-700' : 'bg-white hover:bg-surface-50'} transition-colors`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold" style={{ backgroundColor: user.avatar }}>
            {user.name[0]}
          </div>
          <div className="flex-1 text-left">
            <h3 className={`font-bold text-lg ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{user.name}</h3>
            <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{user.about}</p>
          </div>
          <ChevronRight size={20} className="text-surface-400" />
        </button>

        {/* Settings items */}
        <div className={`mx-4 mt-4 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-800' : 'bg-white'}`}>
          {[
            { icon: User, label: t('profile') },
            { icon: Shield, label: t('privacy') },
            { icon: Bell, label: t('notifications') },
            { icon: Lock, label: 'Security' },
          ].map((item, idx) => (
            <button key={idx} className={`w-full flex items-center gap-3 px-4 py-3.5 ${resolved === 'dark' ? 'hover:bg-surface-700 border-b border-surface-700' : 'hover:bg-surface-50 border-b border-surface-100'} last:border-b-0`}>
              <item.icon size={20} className="text-primary-500" />
              <span className={`flex-1 text-left text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{item.label}</span>
              <ChevronRight size={16} className="text-surface-400" />
            </button>
          ))}
        </div>

        {/* Appearance */}
        <div className={`mx-4 mt-4 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-800' : 'bg-white'}`}>
          <div className={`px-4 py-3 border-b ${resolved === 'dark' ? 'border-surface-700' : 'border-surface-100'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('appearance')}</p>
          </div>
          {(['light', 'dark', 'system'] as const).map(mode => (
            <button key={mode} onClick={() => setTheme(mode)} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-50'}`}>
              {mode === 'light' ? <Sun size={20} className="text-yellow-500" /> : mode === 'dark' ? <Moon size={20} className="text-indigo-400" /> : <Monitor size={20} className="text-surface-400" />}
              <span className={`flex-1 text-left text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                {mode === 'light' ? t('lightMode') : mode === 'dark' ? t('darkMode') : t('systemTheme')}
              </span>
              {theme === mode && <span className="text-primary-500">✓</span>}
            </button>
          ))}
        </div>

        {/* Language */}
        <div className={`mx-4 mt-4 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-800' : 'bg-white'}`}>
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className={`w-full flex items-center gap-3 px-4 py-3.5 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-50'}`}>
            <Globe size={20} className="text-primary-500" />
            <span className={`flex-1 text-left text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{t('language')}</span>
            <span className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{lang === 'en' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>

        {/* Danger zone */}
        <div className={`mx-4 mt-4 mb-8 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-800' : 'bg-white'}`}>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3.5 border-b ${resolved === 'dark' ? 'hover:bg-surface-700 border-surface-700' : 'hover:bg-surface-50 border-surface-100'}`}>
            <LogOut size={20} className="text-red-500" />
            <span className="text-sm text-red-500">{t('logout')}</span>
          </button>
          <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-3.5">
            <Trash2 size={20} className="text-red-500" />
            <span className="text-sm text-red-500">{t('deleteAccount')}</span>
          </button>
        </div>

        {/* App info */}
        <div className="text-center pb-8">
          <p className="text-xs gradient-text font-bold">PrayChat</p>
          <p className={`text-[10px] ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
