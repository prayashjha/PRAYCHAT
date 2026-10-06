// App.tsx - Main routing + tabs
// Auth screen → Main app with 3 tabs (Chats, Status, Calls)
// Chat screen as overlay

import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { LanguageProvider, useLang } from './LanguageContext';
import { useStore, selectChatName, selectChatAvatar } from './store';
import ChatList from './components/ChatList';
import ChatScreen from './components/ChatScreen';
import StatusTab from './components/StatusTab';
import CallsTab from './components/CallsTab';
import SettingsTab from './components/SettingsTab';
import { MessageCircle, Clock, Phone, Plus, Users, ArrowLeft, Check, Download, X } from 'lucide-react';

type Screen = 'auth' | 'main' | 'chat' | 'newChat' | 'newGroup' | 'settings';
type Tab = 'chats' | 'status' | 'calls';

function AppContent() {
  const { resolved } = useTheme();
  const { t } = useLang();
  const { user, users, login } = useStore();
  
  const [screen, setScreen] = useState<Screen>(user ? 'main' : 'auth');
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Auth state
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');

  // PWA install
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('pc-install-dismissed');
      if (!dismissed) setTimeout(() => setShowInstall(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShowInstall(false);
    setDeferredPrompt(null);
  };

  const handleDismissInstall = () => {
    setShowInstall(false);
    localStorage.setItem('pc-install-dismissed', 'true');
  };

  // Auth handlers
  const handlePhoneSubmit = () => {
    if (phone.length < 10) { setError('Enter valid phone number'); return; }
    setError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setAuthStep('otp');
  };

  const handleOtpSubmit = () => {
    if (otp !== generatedOtp) { setError(`Invalid OTP. Demo: ${generatedOtp}`); return; }
    setError('');
    setAuthStep('name');
  };

  const handleNameSubmit = () => {
    if (name.trim().length < 2) { setError('Enter valid name'); return; }
    login(phone, name.trim());
    setScreen('main');
  };

  // New chat/group handlers
  const handleNewChat = (userId: string) => {
    const chatId = useStore.getState().createDirectChat(userId);
    setActiveChatId(chatId);
    setScreen('chat');
  };

  const handleNewGroup = (name: string, memberIds: string[], about?: string) => {
    const chatId = useStore.getState().createGroup(name, memberIds, about);
    setActiveChatId(chatId);
    setScreen('chat');
  };

  // Auth screen
  if (screen === 'auth') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-gradient-to-br from-primary-50 to-accent-50'}`}>
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center mb-4 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold gradient-text">PrayChat</h1>
            <p className={`text-sm mt-1 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('tagline')}</p>
          </div>

          {/* Phone step */}
          {authStep === 'phone' && (
            <div>
              <h2 className={`text-lg font-semibold mb-1 text-center ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('enterPhone')}</h2>
              <p className={`text-sm mb-6 text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('verifyPhone')}</p>
              <div className="flex gap-2 mb-4">
                <div className={`px-3 py-3 rounded-xl text-sm font-medium ${resolved === 'dark' ? 'bg-surface-800 text-surface-300 border border-surface-700' : 'bg-white border border-surface-200'}`}>+91</div>
                <input type="tel" value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }} placeholder="9876543210" className={`flex-1 px-4 py-3 rounded-xl outline-none ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700 placeholder:text-surface-500' : 'bg-white text-surface-900 border border-surface-200 placeholder:text-surface-400'}`} autoFocus />
              </div>
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button onClick={handlePhoneSubmit} disabled={phone.length < 10} className="btn-primary w-full">{t('continue')}</button>
            </div>
          )}

          {/* OTP step */}
          {authStep === 'otp' && (
            <div>
              <h2 className={`text-lg font-semibold mb-1 text-center ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('enterOtp')}</h2>
              <p className={`text-sm mb-4 text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('otpSent')} +91{phone}</p>
              <div className={`p-3 rounded-lg mb-4 text-xs text-center ${resolved === 'dark' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                {t('demoOtp')}: <strong>{generatedOtp}</strong>
              </div>
              <input type="number" value={otp} onChange={e => { setOtp(e.target.value.slice(0, 6)); setError(''); }} placeholder="000000" className={`w-full px-4 py-3 rounded-xl text-center text-2xl tracking-widest outline-none mb-4 ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700 placeholder:text-surface-500' : 'bg-white text-surface-900 border border-surface-200 placeholder:text-surface-400'}`} autoFocus maxLength={6} />
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button onClick={handleOtpSubmit} disabled={otp.length !== 6} className="btn-primary w-full">{t('verify')}</button>
              <button onClick={() => setAuthStep('phone')} className={`w-full text-center text-sm mt-4 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>← {t('changeNum')}</button>
            </div>
          )}

          {/* Name step */}
          {authStep === 'name' && (
            <div>
              <h2 className={`text-lg font-semibold mb-1 text-center ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('enterName')}</h2>
              <p className={`text-sm mb-6 text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Ye aapka display name hoga</p>
              <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="John Doe" className={`w-full px-4 py-3 rounded-xl outline-none mb-4 ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700 placeholder:text-surface-500' : 'bg-white text-surface-900 border border-surface-200 placeholder:text-surface-400'}`} autoFocus maxLength={50} />
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button onClick={handleNameSubmit} disabled={name.trim().length < 2} className="btn-primary w-full">{t('startChat')} →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat screen
  if (screen === 'chat' && activeChatId) {
    return <ChatScreen chatId={activeChatId} onBack={() => setScreen('main')} />;
  }

  // New chat screen
  if (screen === 'newChat') {
    return <NewChatScreen onBack={() => setScreen('main')} onSelect={handleNewChat} />;
  }

  // New group screen
  if (screen === 'newGroup') {
    return <NewGroupScreen onBack={() => setScreen('main')} onCreate={handleNewGroup} />;
  }

  // Settings screen
  if (screen === 'settings') {
    return <SettingsTab onBack={() => setScreen('main')} />;
  }

  // Main app with tabs
  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120] text-surface-200' : 'bg-surface-50 text-surface-800'}`}>
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'chats' && <ChatList onOpenChat={(id) => { setActiveChatId(id); setScreen('chat'); }} onNewChat={() => setScreen('newChat')} onNewGroup={() => setScreen('newGroup')} />}
        {tab === 'status' && <StatusTab />}
        {tab === 'calls' && <CallsTab />}
      </div>

      {/* Bottom nav */}
      <nav className={`flex items-center border-t ${resolved === 'dark' ? 'bg-[#0b1120] border-surface-800' : 'bg-white border-surface-200'}`}>
        {([
          { id: 'chats' as Tab, icon: MessageCircle, label: t('chats') },
          { id: 'status' as Tab, icon: Clock, label: t('status') },
          { id: 'calls' as Tab, icon: Phone, label: t('calls') },
        ]).map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${active ? 'text-primary-500' : resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* PWA install prompt */}
      {showInstall && deferredPrompt && (
        <div className="fixed bottom-20 left-4 right-4 z-50">
          <div className={`rounded-2xl p-4 shadow-2xl ${resolved === 'dark' ? 'bg-surface-800 border border-surface-700' : 'bg-white border border-surface-200'}`}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center flex-shrink-0">
                <Download size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-sm mb-1 ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('installApp')}</h3>
                <p className={`text-xs ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('installDesc')}</p>
              </div>
              <button onClick={handleDismissInstall} className={`p-1 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleDismissInstall} className="flex-1 btn-secondary text-xs py-2">{t('later')}</button>
              <button onClick={handleInstall} className="flex-1 btn-primary text-xs py-2">
                <Download size={14} /> {t('install')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// New chat screen component
function NewChatScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (userId: string) => void }) {
  const { resolved } = useTheme();
  const { t } = useLang();
  const { user, users } = useStore();
  const [search, setSearch] = useState('');

  if (!user) return null;
  const filtered = users.filter(u => u.id !== user.id && (u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)));

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={onBack} className="p-1">←</button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('newChat')}</h2>
      </header>
      <div className="px-4 py-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search')} className={`w-full px-4 py-2.5 rounded-xl outline-none ${resolved === 'dark' ? 'bg-surface-800 text-white placeholder:text-surface-500' : 'bg-white text-surface-900 placeholder:text-surface-400'}`} autoFocus />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map(u => (
          <button key={u.id} onClick={() => onSelect(u.id)} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: u.avatar }}>
              {u.name[0]}
            </div>
            <div className="text-left">
              <p className={`font-medium ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{u.name}</p>
              <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{u.about}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// New group screen component
function NewGroupScreen({ onBack, onCreate }: { onBack: () => void; onCreate: (name: string, memberIds: string[], about?: string) => void }) {
  const { resolved } = useTheme();
  const { t } = useLang();
  const { user, users } = useStore();
  const [step, setStep] = useState<'members' | 'details'>('members');
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  if (!user) return null;
  const others = users.filter(u => u.id !== user.id);

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleCreate = () => {
    if (!name.trim() || selected.length === 0) return;
    onCreate(name.trim(), selected, about.trim() || undefined);
  };

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={step === 'details' ? () => setStep('members') : onBack} className="p-1">←</button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          {step === 'members' ? t('selectMembers') : t('newGroup')}
        </h2>
        {step === 'members' && selected.length > 0 && (
          <button onClick={() => setStep('details')} className="ml-auto text-primary-500 font-semibold text-sm">Next →</button>
        )}
      </header>

      {step === 'members' ? (
        <div className="flex-1 overflow-y-auto">
          {selected.length > 0 && (
            <div className={`px-4 py-2 flex flex-wrap gap-2 border-b ${resolved === 'dark' ? 'border-surface-800' : 'border-surface-200'}`}>
              {selected.map(id => {
                const u = users.find(usr => usr.id === id);
                return u ? (
                  <span key={id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/20 text-primary-500 text-xs">
                    {u.name}
                    <button onClick={() => toggleSelect(id)}><X size={12} /></button>
                  </span>
                ) : null;
              })}
            </div>
          )}
          {others.map(u => (
            <button key={u.id} onClick={() => toggleSelect(u.id)} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: u.avatar }}>
                {u.name[0]}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{u.name}</p>
                <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{u.about}</p>
              </div>
              {selected.includes(u.id) && <Check size={20} className="text-primary-500" />}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 p-4 space-y-4">
          <div>
            <label className={`text-sm font-medium mb-1 block ${resolved === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>{t('groupName')} *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Family Group" className={`w-full px-4 py-3 rounded-xl outline-none ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700 placeholder:text-surface-500' : 'bg-white text-surface-900 border border-surface-200 placeholder:text-surface-400'}`} maxLength={100} />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${resolved === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>{t('groupDesc')}</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="What's this group about?" className={`w-full px-4 py-3 rounded-xl outline-none resize-none h-20 ${resolved === 'dark' ? 'bg-surface-800 text-white border border-surface-700 placeholder:text-surface-500' : 'bg-white text-surface-900 border border-surface-200 placeholder:text-surface-400'}`} maxLength={500} />
          </div>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{selected.length} {t('members')} selected</p>
          <button onClick={handleCreate} disabled={!name.trim()} className="btn-primary w-full">{t('create')} Group</button>
        </div>
      )}
    </div>
  );
}

// Root component with providers
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
