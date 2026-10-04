import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import {
  authStore, userStore, chatStore, messageStore, statusStore, callStore,
  contactStore, privacyStore, uid, formatTime, formatDate, formatLastSeen,
  getChatName, getChatAvatar,
  User, Chat, Message, Status, CallRecord
} from './store';
import {
  MessageCircle, Phone, Video, Search, Plus, Settings, LogOut, Moon, Sun,
  Send, Smile, Paperclip, Mic, ArrowLeft, MoreVertical, Check, CheckCheck,
  Camera, Image, MapPin, User as UserIcon, Users, Shield, Bell, Lock,
  Globe, Trash2, Edit3, Star, Reply, Forward, Copy, Pin, X, PhoneCall,
  PhoneMissed, PhoneIncoming, PhoneOutgoing, Clock, Heart, ThumbsUp,
  Archive, VolumeX, UserPlus, ChevronRight, RefreshCw, AlertCircle
} from 'lucide-react';

// ============ LANGUAGE ============
const translations: Record<string, Record<string, string>> = {
  en: { welcome: 'Welcome to PrayChat', tagline: 'Connect with Faith', phone: 'Phone Number', name: 'Your Name', continue: 'Continue', enterName: 'Enter your name', verifyPhone: 'Verify your phone', otpSent: 'OTP sent to', enterOtp: 'Enter 6-digit OTP', verify: 'Verify', chats: 'Chats', status: 'Status', calls: 'Calls', newChat: 'New Chat', newGroup: 'New Group', settings: 'Settings', search: 'Search...', typeMessage: 'Type a message', online: 'online', lastSeen: 'last seen', today: 'Today', yesterday: 'Yesterday', noChats: 'No conversations yet', startChat: 'Start a conversation', myStatus: 'My Status', addStatus: 'Add status', recentUpdates: 'Recent updates', noStatus: 'No status updates', callHistory: 'Call History', noCalls: 'No call history', profile: 'Profile', account: 'Account', privacy: 'Privacy', notifications: 'Notifications', appearance: 'Appearance', language: 'Language', help: 'Help', about: 'About', logout: 'Logout', deleteAccount: 'Delete Account', blocked: 'Blocked Users', darkMode: 'Dark Mode', lightMode: 'Light Mode', systemTheme: 'System Theme', aboutMe: 'About', username: 'Username', phoneNum: 'Phone', editProfile: 'Edit Profile', save: 'Save', cancel: 'Cancel', create: 'Create', groupName: 'Group Name', selectMembers: 'Select Members', groupAbout: 'Group Description (optional)', members: 'members', admin: 'Admin', leaveGroup: 'Leave Group', deleteChat: 'Delete Chat', archiveChat: 'Archive Chat', muteChat: 'Mute Chat', pinChat: 'Pin Chat', reply: 'Reply', forward: 'Forward', copy: 'Copy', star: 'Star', delete: 'Delete', deleteForEveryone: 'Delete for Everyone', edit: 'Edit', report: 'Report', block: 'Block', unblock: 'Unblock', messageDeleted: 'This message was deleted', typing: 'typing...', sent: 'sent', delivered: 'delivered', read: 'read', you: 'You', created: 'created', added: 'added', removed: 'removed', left: 'left', voiceCall: 'Voice Call', videoCall: 'Video Call', incoming: 'Incoming', outgoing: 'Outgoing', missed: 'Missed', completed: 'Completed' },
  hi: { welcome: 'PrayChat में आपका स्वागत है', tagline: 'विश्वास से जुड़ें', phone: 'फ़ोन नंबर', name: 'आपका नाम', continue: 'आगे बढ़ें', enterName: 'अपना नाम दर्ज करें', verifyPhone: 'अपना फ़ोन सत्यापित करें', otpSent: 'OTP भेजा गया', enterOtp: '6 अंकों का OTP दर्ज करें', verify: 'सत्यापित करें', chats: 'चैट', status: 'स्टेटस', calls: 'कॉल', newChat: 'नई चैट', newGroup: 'नया समूह', settings: 'सेटिंग्स', search: 'खोजें...', typeMessage: 'संदेश लिखें', online: 'ऑनलाइन', lastSeen: 'अंतिम बार देखा', today: 'आज', yesterday: 'कल', noChats: 'कोई बातचीत नहीं', startChat: 'बातचीत शुरू करें', myStatus: 'मेरा स्टेटस', addStatus: 'स्टेटस जोड़ें', recentUpdates: 'हाल के अपडेट', noStatus: 'कोई स्टेटस नहीं', callHistory: 'कॉल इतिहास', noCalls: 'कोई कॉल नहीं', profile: 'प्रोफ़ाइल', account: 'खाता', privacy: 'गोपनीयता', notifications: 'सूचनाएं', appearance: 'रूप', language: 'भाषा', help: 'सहायता', about: 'के बारे में', logout: 'लॉगआउट', deleteAccount: 'खाता हटाएं', blocked: 'ब्लॉक किए गए', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', systemTheme: 'सिस्टम थीम', aboutMe: 'मेरे बारे में', username: 'यूज़रनेम', phoneNum: 'फ़ोन', editProfile: 'प्रोफ़ाइल संपादित करें', save: 'सहेजें', cancel: 'रद्द करें', create: 'बनाएं', groupName: 'समूह का नाम', selectMembers: 'सदस्य चुनें', groupAbout: 'विवरण (वैकल्पिक)', members: 'सदस्य', admin: 'एडमिन', leaveGroup: 'समूह छोड़ें', deleteChat: 'चैट हटाएं', archiveChat: 'चैट संग्रहित करें', muteChat: 'चैट म्यूट करें', pinChat: 'चैट पिन करें', reply: 'जवाब', forward: 'अग्रेषित', copy: 'कॉपी', star: 'तारांकित', delete: 'हटाएं', deleteForEveryone: 'सभी के लिए हटाएं', edit: 'संपादित', report: 'रिपोर्ट', block: 'ब्लॉक', unblock: 'अनब्लॉक', messageDeleted: 'यह संदेश हटा दिया गया', typing: 'टाइप कर रहा...', sent: 'भेजा', delivered: 'पहुंचाया', read: 'पढ़ा', you: 'आप', created: 'ने बनाया', added: 'ने जोड़ा', removed: 'हटाया', left: 'छोड़ दिया', voiceCall: 'वॉइस कॉल', videoCall: 'वीडियो कॉल', incoming: 'आने वाली', outgoing: 'जाने वाली', missed: 'छूटी हुई', completed: 'पूर्ण' }
};

function useT() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem('pc-lang') || 'en');
  const t = useCallback((key: string) => translations[lang]?.[key] || translations.en[key] || key, [lang]);
  const toggleLang = () => { const n = lang === 'en' ? 'hi' : 'en'; setLang(n); localStorage.setItem('pc-lang', n); };
  return { t, lang, toggleLang };
}

// ============ AVATAR COMPONENT ============
function Avatar({ name, color, size = 40, online, src }: { name: string; color: string; size?: number; online?: boolean; src?: string }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: color, fontSize: size * 0.4 }}>
        {name?.[0]?.toUpperCase() || '?'}
      </div>
      {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-surface-900" />}
    </div>
  );
}

// ============ AUTH SCREENS ============
function AuthScreen() {
  const { resolved } = useTheme();
  const { t } = useT();
  const [step, setStep] = useState<'welcome' | 'phone' | 'otp' | 'name'>('welcome');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = () => {
    if (phone.length < 10) { setError('Enter a valid phone number'); return; }
    setError('');
    setLoading(true);
    // Generate OTP (in production, this comes from SMS provider)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 800);
  };

  const handleOtpSubmit = () => {
    if (otp !== generatedOtp) { setError('Invalid OTP. Try: ' + generatedOtp); return; }
    setError('');
    setStep('name');
  };

  const handleNameSubmit = () => {
    if (name.trim().length < 2) { setError('Enter a valid name'); return; }
    setLoading(true);
    authStore.register(phone, name.trim());
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-gradient-to-br from-primary-50 to-accent-50'}`}>
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">PrayChat</h1>
          <p className={`text-sm mt-1 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('tagline')}</p>
        </div>

        {/* Welcome */}
        {step === 'welcome' && (
          <div className="animate-slide-up text-center">
            <h2 className={`text-xl font-semibold mb-2 ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('welcome')}</h2>
            <p className={`text-sm mb-8 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              Secure messaging for everyone. Send messages, share media, make calls.
            </p>
            <button onClick={() => setStep('phone')} className="btn-primary w-full">
              {t('continue')} →
            </button>
          </div>
        )}

        {/* Phone */}
        {step === 'phone' && (
          <div className="animate-slide-up">
            <h2 className={`text-lg font-semibold mb-1 text-center ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('verifyPhone')}</h2>
            <p className={`text-sm mb-6 text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Enter your phone number</p>
            <div className="flex gap-2 mb-4">
              <div className={`px-3 py-3 rounded-xl text-sm font-medium ${resolved === 'dark' ? 'bg-surface-800 text-surface-300 border border-surface-700' : 'bg-white border border-surface-200'}`}>+91</div>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                placeholder="9876543210"
                className="input-field flex-1"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button onClick={handlePhoneSubmit} disabled={loading || phone.length < 10} className="btn-primary w-full">
              {loading ? <RefreshCw size={18} className="animate-spin" /> : t('continue')}
            </button>
            <button onClick={() => setStep('welcome')} className={`w-full text-center text-sm mt-4 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              ← Back
            </button>
          </div>
        )}

        {/* OTP */}
        {step === 'otp' && (
          <div className="animate-slide-up">
            <h2 className={`text-lg font-semibold mb-1 text-center ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('enterOtp')}</h2>
            <p className={`text-sm mb-6 text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('otpSent')} +91{phone}</p>
            <div className={`p-3 rounded-lg mb-4 text-xs text-center ${resolved === 'dark' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
              Demo OTP: <strong>{generatedOtp}</strong> (In production, sent via SMS)
            </div>
            <input
              type="number"
              value={otp}
              onChange={e => { setOtp(e.target.value.slice(0, 6)); setError(''); }}
              placeholder="000000"
              className="input-field text-center text-2xl tracking-widest mb-4"
              autoFocus
              maxLength={6}
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button onClick={handleOtpSubmit} disabled={otp.length !== 6} className="btn-primary w-full">
              {t('verify')}
            </button>
            <button onClick={() => setStep('phone')} className={`w-full text-center text-sm mt-4 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              ← Change number
            </button>
          </div>
        )}

        {/* Name */}
        {step === 'name' && (
          <div className="animate-slide-up">
            <h2 className={`text-lg font-semibold mb-1 text-center ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('enterName')}</h2>
            <p className={`text-sm mb-6 text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>This will be your display name</p>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="John Doe"
              className="input-field mb-4"
              autoFocus
              maxLength={50}
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button onClick={handleNameSubmit} disabled={loading || name.trim().length < 2} className="btn-primary w-full">
              {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Start Chatting →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
type Screen = 'chats' | 'status' | 'calls' | 'chat' | 'newChat' | 'newGroup' | 'settings' | 'profile' | 'chatInfo' | 'statusView' | 'statusCreate';

function MainApp() {
  const { resolved } = useTheme();
  const { t, lang, toggleLang } = useT();
  const [screen, setScreen] = useState<Screen>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(authStore.getCurrentUser());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => { setUser(authStore.getCurrentUser()); forceUpdate(n => n + 1); };
    window.addEventListener('pc-data-change', handler);
    return () => window.removeEventListener('pc-data-change', handler);
  }, []);

  useEffect(() => {
    if (user) userStore.setOnline(user.id, true);
    return () => { if (user) userStore.setOnline(user.id, false); };
  }, [user?.id]);

  if (!user) return <AuthScreen />;

  const openChat = (chatId: string) => { setSelectedChatId(chatId); setScreen('chat'); };

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120] text-surface-200' : 'bg-surface-50 text-surface-800'}`}>
      {screen === 'chat' && selectedChatId ? (
        <ChatView chatId={selectedChatId} onBack={() => setScreen('chats')} onOpenInfo={() => setScreen('chatInfo')} />
      ) : screen === 'newChat' ? (
        <NewChatScreen onBack={() => setScreen('chats')} onOpenChat={openChat} />
      ) : screen === 'newGroup' ? (
        <NewGroupScreen onBack={() => setScreen('chats')} onOpenChat={openChat} />
      ) : screen === 'settings' ? (
        <SettingsScreen onBack={() => setScreen('chats')} user={user} />
      ) : screen === 'profile' ? (
        <ProfileScreen onBack={() => setScreen('settings')} user={user} />
      ) : screen === 'chatInfo' && selectedChatId ? (
        <ChatInfoScreen chatId={selectedChatId} onBack={() => setScreen('chat')} />
      ) : screen === 'statusView' ? (
        <StatusViewer onBack={() => setScreen('status')} />
      ) : screen === 'statusCreate' ? (
        <StatusCreator onBack={() => setScreen('status')} />
      ) : (
        <>
          {/* Home Header */}
          <header className={`px-4 pt-3 pb-2 safe-top ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold gradient-text">PrayChat</h1>
              <div className="flex items-center gap-1">
                <button onClick={() => setScreen('statusCreate')} className={`p-2.5 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><Camera size={20} /></button>
                <button onClick={() => setScreen('newChat')} className={`p-2.5 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><Plus size={20} /></button>
                <button onClick={() => setScreen('settings')} className={`p-2.5 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><MoreVertical size={20} /></button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {screen === 'chats' && <ChatList onOpenChat={openChat} onNewChat={() => setScreen('newChat')} />}
            {screen === 'status' && <StatusList onViewStatus={() => setScreen('statusView')} onCreateStatus={() => setScreen('statusCreate')} />}
            {screen === 'calls' && <CallList />}
          </div>

          {/* Bottom Nav */}
          <nav className={`flex items-center safe-bottom border-t ${resolved === 'dark' ? 'bg-[#0b1120] border-surface-800' : 'bg-white border-surface-200'}`}>
            {[
              { id: 'chats' as Screen, icon: MessageCircle, label: t('chats') },
              { id: 'status' as Screen, icon: Clock, label: t('status') },
              { id: 'calls' as Screen, icon: Phone, label: t('calls') },
            ].map(tab => {
              const Icon = tab.icon;
              const active = screen === tab.id;
              return (
                <button key={tab.id} onClick={() => setScreen(tab.id)} className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${active ? 'text-primary-500' : resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                  <Icon size={22} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}

// ============ CHAT LIST ============
function ChatList({ onOpenChat, onNewChat }: { onOpenChat: (id: string) => void; onNewChat: () => void }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const load = () => setChats(chatStore.getAll());
    load();
    window.addEventListener('pc-data-change', load);
    return () => window.removeEventListener('pc-data-change', load);
  }, []);

  const filtered = chats.filter(c => getChatName(c).toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="px-4 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
          <Search size={18} className={resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search')} className={`flex-1 bg-transparent outline-none text-sm ${resolved === 'dark' ? 'text-white placeholder:text-surface-500' : 'text-surface-800 placeholder:text-surface-400'}`} />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
              <MessageCircle size={32} className="text-primary-500" />
            </div>
            <p className={`text-base font-medium mb-1 ${resolved === 'dark' ? 'text-surface-300' : 'text-surface-700'}`}>{t('noChats')}</p>
            <p className={`text-sm mb-4 ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>{t('startChat')}</p>
            <button onClick={onNewChat} className="btn-primary text-sm">{t('newChat')}</button>
          </div>
        ) : (
          sorted.map(chat => {
            const av = getChatAvatar(chat);
            const name = getChatName(chat);
            const lastMsg = chat.lastMessage;
            const otherId = chat.type === 'direct' ? chat.members.find(m => m !== authStore.getCurrentUser()?.id) : null;
            const other = otherId ? userStore.getById(otherId) : null;
            return (
              <button key={chat.id} onClick={() => onOpenChat(chat.id)} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${resolved === 'dark' ? 'hover:bg-surface-800/50 active:bg-surface-800' : 'hover:bg-surface-50 active:bg-surface-100'}`}>
                <Avatar name={av.name} color={av.color} size={50} online={other?.isOnline} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-[15px] truncate ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>
                      {chat.isPinned && <Pin size={12} className="inline mr-1 text-primary-500" />}
                      {name}
                    </span>
                    <span className={`text-[11px] flex-shrink-0 ${chat.unreadCount > 0 ? 'text-primary-500 font-semibold' : resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>
                      {lastMsg ? formatTime(lastMsg.createdAt) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-sm truncate ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                      {lastMsg?.deletedForEveryone ? t('messageDeleted') : lastMsg?.type === 'system' ? lastMsg.content : lastMsg?.content || ''}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 min-w-[20px] h-5 px-1.5 bg-primary-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">{chat.unreadCount}</span>
                    )}
                    {chat.isMuted && <VolumeX size={14} className="text-surface-400 ml-1" />}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============ CHAT VIEW ============
function ChatView({ chatId, onBack, onOpenInfo }: { chatId: string; onBack: () => void; onOpenInfo: () => void }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMsg, setEditingMsg] = useState<Message | null>(null);
  const [longPressMsg, setLongPressMsg] = useState<Message | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = () => { setMessages(messageStore.getAll(chatId)); setChat(chatStore.getById(chatId) ?? null); };
    load();
    chatStore.markRead(chatId);
    window.addEventListener('pc-data-change', load);
    return () => window.removeEventListener('pc-data-change', load);
  }, [chatId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const me = authStore.getCurrentUser()!;
  const otherId = chat?.type === 'direct' ? chat.members.find(m => m !== me.id) : null;
  const other = otherId ? userStore.getById(otherId) : null;
  const av = chat ? getChatAvatar(chat) : { name: '?', color: '#6366f1' };
  const chatName = chat ? getChatName(chat) : '';

  const sendMessage = () => {
    if (!input.trim()) return;
    if (editingMsg) {
      messageStore.edit(editingMsg.id, input.trim());
      setEditingMsg(null);
    } else {
      messageStore.add(chatId, input.trim(), 'text', replyTo?.id);
      setReplyTo(null);
    }
    setInput('');
    setShowEmoji(false);
  };

  const emojis = ['😀', '😂', '❤️', '👍', '🙏', '😊', '🎉', '🔥', '💯', '😍', '🤔', '😢', '👋', '✨', '💪', '🙌', '😎', '🥰', '😅', '🤣', '💕', '🌟', '🙏🏻', '💐'];

  const filteredMessages = searchQuery ? messageStore.search(chatId, searchQuery) : messages;

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-100'}`}>
      {/* Header */}
      <header className={`flex items-center gap-3 px-3 py-2 safe-top ${resolved === 'dark' ? 'bg-surface-900 border-b border-surface-800' : 'bg-white border-b border-surface-200'}`}>
        <button onClick={onBack} className={`p-1.5 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><ArrowLeft size={22} /></button>
        <button onClick={onOpenInfo} className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar name={av.name} color={av.color} size={38} online={other?.isOnline} />
          <div className="text-left min-w-0">
            <p className={`font-semibold text-[15px] truncate ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{chatName}</p>
            <p className={`text-xs truncate ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              {chat?.type === 'group' ? `${chat.members.length} ${t('members')}` : other?.isOnline ? t('online') : `${t('lastSeen')} ${formatLastSeen(other?.lastSeen || 0)}`}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => setSearchMode(!searchMode)} className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><Search size={18} /></button>
          <button className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><Phone size={18} /></button>
          <button className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}><Video size={18} /></button>
        </div>
      </header>

      {/* Search Bar */}
      {searchMode && (
        <div className={`px-3 py-2 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
            <Search size={16} className="text-surface-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('search')} autoFocus className="flex-1 bg-transparent outline-none text-sm" />
            <button onClick={() => { setSearchMode(false); setSearchQuery(''); }}><X size={16} className="text-surface-400" /></button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin" style={{ backgroundImage: resolved === 'dark' ? 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.03) 0%, transparent 50%)' : 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 50%)' }}>
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={`text-sm ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          <>
            {filteredMessages.map((msg, idx) => {
              const isMe = msg.senderId === me.id;
              const isSystem = msg.type === 'system';
              const showDate = idx === 0 || formatDate(msg.createdAt) !== formatDate(filteredMessages[idx - 1].createdAt);
              const sender = userStore.getById(msg.senderId);
              const replyMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;

              if (isSystem) return (
                <React.Fragment key={msg.id}>
                  {showDate && <div className="flex justify-center my-3"><span className={`text-[11px] px-3 py-1 rounded-full ${resolved === 'dark' ? 'bg-surface-800 text-surface-400' : 'bg-white text-surface-500 shadow-sm'}`}>{formatDate(msg.createdAt)}</span></div>}
                  <div className="flex justify-center my-2"><span className={`text-[11px] px-3 py-1 rounded-full ${resolved === 'dark' ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>{msg.content}</span></div>
                </React.Fragment>
              );

              return (
                <React.Fragment key={msg.id}>
                  {showDate && <div className="flex justify-center my-3"><span className={`text-[11px] px-3 py-1 rounded-full ${resolved === 'dark' ? 'bg-surface-800 text-surface-400' : 'bg-white text-surface-500 shadow-sm'}`}>{formatDate(msg.createdAt)}</span></div>}
                  <div className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`} onContextMenu={(e) => { e.preventDefault(); setLongPressMsg(msg); }}>
                    <div className={`max-w-[80%] ${isMe ? 'bubble-out' : 'bubble-in'} px-3 py-2 relative`}>
                      {chat?.type === 'group' && !isMe && <p className="text-[11px] font-semibold mb-0.5" style={{ color: sender?.avatar || '#6366f1' }}>{sender?.name}</p>}
                      {replyMsg && (
                        <div className={`text-[11px] px-2 py-1 rounded mb-1 ${isMe ? 'bg-white/20' : resolved === 'dark' ? 'bg-surface-700' : 'bg-surface-100'}`}>
                          <p className="font-medium truncate">{replyMsg.senderId === me.id ? t('you') : userStore.getById(replyMsg.senderId)?.name}</p>
                          <p className="truncate opacity-70">{replyMsg.content}</p>
                        </div>
                      )}
                      {msg.deletedForEveryone ? (
                        <p className="text-sm italic opacity-60">🚫 {t('messageDeleted')}</p>
                      ) : (
                        <p className="text-[15px] leading-snug break-words whitespace-pre-wrap">{msg.content}</p>
                      )}
                      <div className={`flex items-center justify-end gap-1 mt-0.5 ${isMe ? 'text-white/70' : resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>
                        {msg.editedAt && <span className="text-[9px]">edited</span>}
                        <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={14} className="text-sky-300" /> :
                          msg.status === 'delivered' ? <CheckCheck size={14} /> :
                          msg.status === 'sent' ? <Check size={14} /> : null
                        )}
                      </div>
                      {/* Reactions */}
                      {Object.keys(msg.reactions).length > 0 && (
                        <div className={`absolute -bottom-3 ${isMe ? 'left-1' : 'right-1'} flex gap-0.5`}>
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <span key={emoji} className={`text-xs px-1.5 py-0.5 rounded-full ${resolved === 'dark' ? 'bg-surface-700 border border-surface-600' : 'bg-white border border-surface-200 shadow-sm'}`}>
                              {emoji}{users.length > 1 && <span className="text-[9px]"> {users.length}</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Long Press Menu */}
      {longPressMsg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setLongPressMsg(null)}>
          <div className={`w-full max-w-md rounded-t-2xl p-4 animate-slide-up ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-surface-400 mx-auto mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Reply, label: t('reply'), action: () => { setReplyTo(longPressMsg); setLongPressMsg(null); inputRef.current?.focus(); } },
                { icon: Copy, label: t('copy'), action: () => { navigator.clipboard.writeText(longPressMsg.content); setLongPressMsg(null); } },
                { icon: Star, label: t('star'), action: () => { messageStore.star(longPressMsg.id); setLongPressMsg(null); } },
                { icon: Forward, label: t('forward'), action: () => setLongPressMsg(null) },
                ...(longPressMsg.senderId === me.id ? [
                  { icon: Edit3, label: t('edit'), action: () => { setEditingMsg(longPressMsg); setInput(longPressMsg.content); setLongPressMsg(null); inputRef.current?.focus(); } },
                ] : []),
                { icon: Trash2, label: t('delete'), action: () => { messageStore.deleteForMe(longPressMsg.id); setLongPressMsg(null); } },
                ...(longPressMsg.senderId === me.id ? [
                  { icon: Trash2, label: t('deleteForEveryone'), action: () => { messageStore.deleteForEveryone(longPressMsg.id); setLongPressMsg(null); } },
                ] : []),
              ].map((item, idx) => (
                <button key={idx} onClick={item.action} className={`flex flex-col items-center gap-1 p-3 rounded-xl ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
                  <item.icon size={20} className={resolved === 'dark' ? 'text-surface-300' : 'text-surface-600'} />
                  <span className={`text-[10px] text-center ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{item.label}</span>
                </button>
              ))}
            </div>
            {/* Quick reactions */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-surface-700/30">
              {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                <button key={emoji} onClick={() => { messageStore.react(longPressMsg.id, emoji); setLongPressMsg(null); }} className="text-2xl p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-transform hover:scale-125">
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji && (
        <div className={`px-3 py-2 border-t ${resolved === 'dark' ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
          <div className="emoji-grid">
            {emojis.map(e => <button key={e} className="emoji-btn" onClick={() => setInput(prev => prev + e)}>{e}</button>)}
          </div>
        </div>
      )}

      {/* Reply Preview */}
      {replyTo && (
        <div className={`flex items-center gap-2 px-4 py-2 border-t ${resolved === 'dark' ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
          <Reply size={16} className="text-primary-500" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary-500">{replyTo.senderId === me.id ? t('you') : userStore.getById(replyTo.senderId)?.name}</p>
            <p className={`text-xs truncate ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)}><X size={16} className="text-surface-400" /></button>
        </div>
      )}

      {/* Composer */}
      <div className={`flex items-center gap-2 px-3 py-2 safe-bottom ${resolved === 'dark' ? 'bg-surface-900 border-t border-surface-800' : 'bg-white border-t border-surface-200'}`}>
        <button onClick={() => setShowEmoji(!showEmoji)} className={`p-2 rounded-full ${resolved === 'dark' ? 'text-surface-400 hover:bg-surface-800' : 'text-surface-500 hover:bg-surface-100'}`}>
          <Smile size={22} />
        </button>
        <button className={`p-2 rounded-full ${resolved === 'dark' ? 'text-surface-400 hover:bg-surface-800' : 'text-surface-500 hover:bg-surface-100'}`}>
          <Paperclip size={22} />
        </button>
        <div className="flex-1">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={editingMsg ? 'Edit message...' : t('typeMessage')}
            className={`w-full px-4 py-2.5 rounded-full text-[15px] outline-none ${resolved === 'dark' ? 'bg-surface-800 text-white placeholder:text-surface-500' : 'bg-surface-100 text-surface-800 placeholder:text-surface-400'}`}
          />
        </div>
        {input.trim() ? (
          <button onClick={sendMessage} className="p-2.5 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30">
            {editingMsg ? <Check size={20} /> : <Send size={20} />}
          </button>
        ) : (
          <button className={`p-2.5 rounded-full ${resolved === 'dark' ? 'text-surface-400 hover:bg-surface-800' : 'text-surface-500 hover:bg-surface-100'}`}>
            <Mic size={22} />
          </button>
        )}
      </div>
    </div>
  );
}

// ============ NEW CHAT ============
function NewChatScreen({ onBack, onOpenChat }: { onBack: () => void; onOpenChat: (id: string) => void }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const [search, setSearch] = useState('');
  const users = search ? userStore.search(search) : userStore.getAll().filter(u => u.id !== authStore.getCurrentUser()?.id);

  const startChat = (userId: string) => {
    const chat = chatStore.getOrCreateDirect(userId);
    onOpenChat(chat.id);
  };

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 safe-top ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={onBack} className="p-1"><ArrowLeft size={22} /></button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('newChat')}</h2>
      </header>
      <div className="px-4 py-2">
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
          <Search size={18} className="text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, username, or phone" autoFocus className={`flex-1 bg-transparent outline-none text-sm ${resolved === 'dark' ? 'text-white placeholder:text-surface-500' : 'text-surface-800 placeholder:text-surface-400'}`} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {!search && (
          <button onClick={onBack} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center"><Users size={20} className="text-white" /></div>
            <span className={`font-medium ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('newGroup')}</span>
          </button>
        )}
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <AlertCircle size={40} className="text-surface-400 mb-3" />
            <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              {search ? 'No users found. Try a different search.' : 'No other users yet. Register another account to chat with!'}
            </p>
          </div>
        ) : (
          users.map(u => (
            <button key={u.id} onClick={() => startChat(u.id)} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
              <Avatar name={u.name} color={u.avatar} size={48} online={u.isOnline} />
              <div className="text-left">
                <p className={`font-medium ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{u.name}</p>
                <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{u.about}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ============ NEW GROUP ============
function NewGroupScreen({ onBack, onOpenChat }: { onBack: () => void; onOpenChat: (id: string) => void }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const [step, setStep] = useState<'members' | 'details'>('members');
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const users = userStore.getAll().filter(u => u.id !== authStore.getCurrentUser()?.id);

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const createGroup = () => {
    if (!name.trim() || selected.length === 0) return;
    const chat = chatStore.createGroup(name.trim(), selected, about.trim() || undefined);
    onOpenChat(chat.id);
  };

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 safe-top ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={step === 'details' ? () => setStep('members') : onBack} className="p-1"><ArrowLeft size={22} /></button>
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
                const u = userStore.getById(id);
                return u ? (
                  <span key={id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/20 text-primary-500 text-xs">
                    {u.name}
                    <button onClick={() => toggleSelect(id)}><X size={12} /></button>
                  </span>
                ) : null;
              })}
            </div>
          )}
          {users.map(u => (
            <button key={u.id} onClick={() => toggleSelect(u.id)} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
              <Avatar name={u.name} color={u.avatar} size={44} />
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
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Family Group" className="input-field" maxLength={100} />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${resolved === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>{t('groupAbout')}</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="What's this group about?" className={`input-field resize-none h-20`} maxLength={500} />
          </div>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{selected.length} {t('members')} selected</p>
          <button onClick={createGroup} disabled={!name.trim()} className="btn-primary w-full">{t('create')} Group</button>
        </div>
      )}
    </div>
  );
}

// ============ STATUS LIST ============
function StatusList({ onViewStatus, onCreateStatus }: { onViewStatus: () => void; onCreateStatus: () => void }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const me = authStore.getCurrentUser()!;
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    const load = () => setStatuses(statusStore.getAll());
    load();
    window.addEventListener('pc-data-change', load);
    return () => window.removeEventListener('pc-data-change', load);
  }, []);

  const myStatuses = statuses.filter(s => s.userId === me.id);
  const othersStatuses = statuses.filter(s => s.userId !== me.id);
  const groupedByUser: Record<string, Status[]> = {};
  othersStatuses.forEach(s => { if (!groupedByUser[s.userId]) groupedByUser[s.userId] = []; groupedByUser[s.userId].push(s); });

  return (
    <div className="h-full overflow-y-auto">
      {/* My Status */}
      <div className={`px-4 py-3 flex items-center gap-3 ${resolved === 'dark' ? 'border-b border-surface-800' : 'border-b border-surface-200'}`}>
        <button onClick={onCreateStatus}>
          {myStatuses.length > 0 ? (
            <div className="status-ring-seen"><Avatar name={me.name} color={me.avatar} size={50} /></div>
          ) : (
            <div className="relative">
              <Avatar name={me.name} color={me.avatar} size={50} />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900">
                <Plus size={12} className="text-white" />
              </div>
            </div>
          )}
        </button>
        <div>
          <p className={`font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('myStatus')}</p>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            {myStatuses.length > 0 ? `${myStatuses.length} status(es) active` : t('addStatus')}
          </p>
        </div>
      </div>

      {/* Others */}
      {Object.keys(groupedByUser).length > 0 && (
        <div className="px-4 py-2">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('recentUpdates')}</p>
        </div>
      )}
      {Object.entries(groupedByUser).map(([userId, userStatuses]) => {
        const u = userStore.getById(userId);
        if (!u) return null;
        const hasViewed = userStatuses.every(s => s.viewedBy.includes(me.id));
        return (
          <button key={userId} onClick={onViewStatus} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800/50' : 'hover:bg-surface-50'}`}>
            <div className={hasViewed ? 'status-ring-seen' : 'status-ring'}>
              <div className="rounded-full overflow-hidden bg-white dark:bg-surface-900 p-[2px]">
                <Avatar name={u.name} color={u.avatar} size={46} />
              </div>
            </div>
            <div className="text-left">
              <p className={`font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{u.name}</p>
              <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                {formatTime(userStatuses[userStatuses.length - 1].createdAt)}
              </p>
            </div>
          </button>
        );
      })}

      {Object.keys(groupedByUser).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
            <Clock size={28} className="text-primary-500" />
          </div>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('noStatus')}</p>
        </div>
      )}
    </div>
  );
}

// ============ STATUS VIEWER ============
function StatusViewer({ onBack }: { onBack: () => void }) {
  const { resolved } = useTheme();
  const me = authStore.getCurrentUser()!;
  const [statuses] = useState(() => statusStore.getAll().filter(s => s.userId !== me.id));
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (statuses[currentIdx]) statusStore.view(statuses[currentIdx].id);
    const timer = setTimeout(() => {
      if (currentIdx < statuses.length - 1) setCurrentIdx(currentIdx + 1);
      else onBack();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const current = statuses[currentIdx];
  if (!current) { onBack(); return null; }
  const user = userStore.getById(current.userId);

  return (
    <div className="h-screen flex flex-col bg-black relative">
      {/* Progress bars */}
      <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
        {statuses.map((_, idx) => (
          <div key={idx} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
            <div className={`h-full bg-white rounded-full transition-all ${idx < currentIdx ? 'w-full' : idx === currentIdx ? 'w-full animate-[grow_5s_linear]' : 'w-0'}`} />
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="absolute top-6 left-3 right-3 flex items-center gap-3 z-10">
        <button onClick={onBack}><ArrowLeft size={22} className="text-white" /></button>
        {user && <Avatar name={user.name} color={user.avatar} size={32} />}
        <div>
          <p className="text-white font-semibold text-sm">{user?.name}</p>
          <p className="text-white/60 text-xs">{formatTime(current.createdAt)}</p>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: current.bgColor || '#6366f1' }}>
        <p className="text-white text-2xl font-semibold text-center leading-relaxed">{current.content}</p>
      </div>
      {/* Navigation */}
      <div className="absolute inset-0 flex">
        <button className="flex-1" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} />
        <button className="flex-1" onClick={() => currentIdx < statuses.length - 1 ? setCurrentIdx(currentIdx + 1) : onBack()} />
      </div>
    </div>
  );
}

// ============ STATUS CREATOR ============
function StatusCreator({ onBack }: { onBack: () => void }) {
  const { resolved } = useTheme();
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#6366f1');
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#1e293b'];

  const post = () => {
    if (!content.trim()) return;
    statusStore.create(content.trim(), 'text', bgColor);
    onBack();
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      <header className="flex items-center gap-3 px-4 py-3 safe-top">
        <button onClick={onBack}><ArrowLeft size={22} className="text-white" /></button>
        <div className="flex-1" />
        <button onClick={post} disabled={!content.trim()} className="text-white font-semibold disabled:opacity-50">Post</button>
      </header>
      <div className="flex-1 flex items-center justify-center p-8">
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Type a status..." className="w-full bg-transparent text-white text-2xl text-center font-semibold outline-none resize-none placeholder:text-white/50" maxLength={500} autoFocus />
      </div>
      <div className="flex items-center justify-center gap-2 pb-8 safe-bottom">
        {colors.map(c => (
          <button key={c} onClick={() => setBgColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${bgColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

// ============ CALL LIST ============
function CallList() {
  const { resolved } = useTheme();
  const { t } = useT();
  const [calls, setCalls] = useState<CallRecord[]>([]);

  useEffect(() => {
    const load = () => setCalls(callStore.getAll());
    load();
    window.addEventListener('pc-data-change', load);
    return () => window.removeEventListener('pc-data-change', load);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      {calls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
            <Phone size={28} className="text-primary-500" />
          </div>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('noCalls')}</p>
        </div>
      ) : (
        calls.map(call => {
          const me = authStore.getCurrentUser()!;
          const isOutgoing = call.callerId === me.id;
          const otherId = isOutgoing ? call.receiverId : call.callerId;
          const other = userStore.getById(otherId);
          if (!other) return null;
          const Icon = call.status === 'missed' ? PhoneMissed : isOutgoing ? PhoneOutgoing : PhoneIncoming;
          const iconColor = call.status === 'missed' ? 'text-red-500' : 'text-green-500';
          return (
            <div key={call.id} className={`flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'border-b border-surface-800' : 'border-b border-surface-100'}`}>
              <Avatar name={other.name} color={other.avatar} size={48} />
              <div className="flex-1">
                <p className={`font-medium ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{other.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Icon size={14} className={iconColor} />
                  <span className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                    {isOutgoing ? t('outgoing') : t('incoming')} · {formatDate(call.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{formatTime(call.createdAt)}</p>
                {call.duration && <p className={`text-xs ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>{Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}</p>}
              </div>
              <button className={`p-2 ml-1 ${call.type === 'video' ? 'text-primary-500' : 'text-green-500'}`}>
                {call.type === 'video' ? <Video size={20} /> : <Phone size={20} />}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

// ============ CHAT INFO ============
function ChatInfoScreen({ chatId, onBack }: { chatId: string; onBack: () => void }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    const load = () => setChat(chatStore.getById(chatId) ?? null);
    load();
    window.addEventListener('pc-data-change', load);
    return () => window.removeEventListener('pc-data-change', load);
  }, [chatId]);

  if (!chat) return null;
  const av = getChatAvatar(chat);
  const name = getChatName(chat);
  const me = authStore.getCurrentUser()!;

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 safe-top ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={onBack} className="p-1"><ArrowLeft size={22} /></button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{chat.type === 'group' ? 'Group Info' : 'Contact Info'}</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className={`flex flex-col items-center py-8 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <Avatar name={av.name} color={av.color} size={80} />
          <h3 className={`text-xl font-bold mt-3 ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{name}</h3>
          {chat.type === 'direct' && (
            <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              @{userStore.getById(chat.members.find(m => m !== me.id) || '')?.username}
            </p>
          )}
          {chat.type === 'group' && <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{chat.members.length} {t('members')}</p>}
        </div>

        {/* About */}
        <div className={`mt-2 px-4 py-3 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('about')}</p>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
            {chat.type === 'direct' ? userStore.getById(chat.members.find(m => m !== me.id) || '')?.about : chat.about || 'No description'}
          </p>
        </div>

        {/* Group Members */}
        {chat.type === 'group' && (
          <div className={`mt-2 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider px-4 pt-3 pb-1 ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('members')}</p>
            {chat.members.map(memberId => {
              const u = userStore.getById(memberId);
              if (!u) return null;
              const isAdmin = chat.admins?.includes(memberId);
              return (
                <div key={memberId} className={`flex items-center gap-3 px-4 py-2.5 ${resolved === 'dark' ? 'border-b border-surface-800' : 'border-b border-surface-100'}`}>
                  <Avatar name={u.name} color={u.avatar} size={40} online={u.isOnline} />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{u.name}{memberId === me.id ? ' (You)' : ''}</p>
                    <p className={`text-xs ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{u.about}</p>
                  </div>
                  {isAdmin && <span className="badge badge-info text-[10px]">{t('admin')}</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className={`mt-2 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <button onClick={() => { chatStore.update(chatId, { isPinned: !chat.isPinned }); }} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800 border-b border-surface-800' : 'hover:bg-surface-50 border-b border-surface-100'}`}>
            <Pin size={20} className="text-surface-400" />
            <span className={`text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{chat.isPinned ? 'Unpin' : t('pinChat')}</span>
          </button>
          <button onClick={() => { chatStore.update(chatId, { isMuted: !chat.isMuted }); }} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800 border-b border-surface-800' : 'hover:bg-surface-50 border-b border-surface-100'}`}>
            <VolumeX size={20} className="text-surface-400" />
            <span className={`text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{chat.isMuted ? 'Unmute' : t('muteChat')}</span>
          </button>
          {chat.type === 'group' && (
            <button onClick={() => { chatStore.leaveGroup(chatId); onBack(); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500">
              <LogOut size={20} />
              <span className="text-sm">{t('leaveGroup')}</span>
            </button>
          )}
          <button onClick={() => { chatStore.delete(chatId); onBack(); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500">
            <Trash2 size={20} />
            <span className="text-sm">{t('deleteChat')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS ============
function SettingsScreen({ onBack, user }: { onBack: () => void; user: User }) {
  const { resolved, theme, setTheme } = useTheme();
  const { t, lang, toggleLang } = useT();

  const handleLogout = () => { authStore.logout(); window.location.reload(); };
  const handleDeleteAccount = () => { if (confirm('Are you sure? This cannot be undone.')) { authStore.deleteAccount(); window.location.reload(); } };

  const items = [
    { icon: UserIcon, label: t('profile'), action: () => {} },
    { icon: Shield, label: t('privacy'), action: () => {} },
    { icon: Bell, label: t('notifications'), action: () => {} },
    { icon: Lock, label: 'Security', action: () => {} },
    { icon: Archive, label: 'Storage', action: () => {} },
  ];

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 safe-top ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={onBack} className="p-1"><ArrowLeft size={22} /></button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('settings')}</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className={`mx-4 mt-4 p-4 rounded-2xl flex items-center gap-4 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <Avatar name={user.name} color={user.avatar} size={60} />
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{user.name}</h3>
            <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>@{user.username}</p>
            <p className={`text-xs mt-0.5 ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>{user.about}</p>
          </div>
          <ChevronRight size={20} className="text-surface-400" />
        </div>

        {/* Settings Items */}
        <div className={`mx-4 mt-4 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          {items.map((item, idx) => (
            <button key={idx} className={`w-full flex items-center gap-3 px-4 py-3.5 ${resolved === 'dark' ? 'hover:bg-surface-800 border-b border-surface-800' : 'hover:bg-surface-50 border-b border-surface-100'} last:border-b-0`}>
              <item.icon size={20} className="text-primary-500" />
              <span className={`flex-1 text-left text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{item.label}</span>
              <ChevronRight size={16} className="text-surface-400" />
            </button>
          ))}
        </div>

        {/* Appearance */}
        <div className={`mx-4 mt-4 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <div className={`px-4 py-3 border-b ${resolved === 'dark' ? 'border-surface-800' : 'border-surface-100'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('appearance')}</p>
          </div>
          {(['light', 'dark', 'system'] as const).map(mode => (
            <button key={mode} onClick={() => setTheme(mode)} className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-50'}`}>
              {mode === 'light' ? <Sun size={20} className="text-yellow-500" /> : mode === 'dark' ? <Moon size={20} className="text-indigo-400" /> : <RefreshCw size={20} className="text-surface-400" />}
              <span className={`flex-1 text-left text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                {mode === 'light' ? t('lightMode') : mode === 'dark' ? t('darkMode') : t('systemTheme')}
              </span>
              {theme === mode && <Check size={18} className="text-primary-500" />}
            </button>
          ))}
        </div>

        {/* Language */}
        <div className={`mx-4 mt-4 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <button onClick={toggleLang} className={`w-full flex items-center gap-3 px-4 py-3.5 ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-50'}`}>
            <Globe size={20} className="text-primary-500" />
            <span className={`flex-1 text-left text-sm ${resolved === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{t('language')}</span>
            <span className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{lang === 'en' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className={`mx-4 mt-4 mb-8 rounded-2xl overflow-hidden ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3.5 border-b ${resolved === 'dark' ? 'hover:bg-surface-800 border-surface-800' : 'hover:bg-surface-50 border-surface-100'}`}>
            <LogOut size={20} className="text-red-500" />
            <span className="text-sm text-red-500">{t('logout')}</span>
          </button>
          <button onClick={handleDeleteAccount} className="w-full flex items-center gap-3 px-4 py-3.5">
            <Trash2 size={20} className="text-red-500" />
            <span className="text-sm text-red-500">{t('deleteAccount')}</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center pb-8">
          <p className="text-xs gradient-text font-bold">PrayChat</p>
          <p className={`text-[10px] ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>Version 1.0.0 · Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}

// ============ PROFILE ============
function ProfileScreen({ onBack, user }: { onBack: () => void; user: User }) {
  const { resolved } = useTheme();
  const { t } = useT();
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);
  const [saved, setSaved] = useState(false);

  const save = () => {
    authStore.updateProfile({ name: name.trim(), about: about.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`h-screen flex flex-col ${resolved === 'dark' ? 'bg-[#0b1120]' : 'bg-surface-50'}`}>
      <header className={`flex items-center gap-3 px-4 py-3 safe-top ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <button onClick={onBack} className="p-1"><ArrowLeft size={22} /></button>
        <h2 className={`text-lg font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('editProfile')}</h2>
        <button onClick={save} className="ml-auto text-primary-500 font-semibold text-sm">{saved ? '✓ Saved' : t('save')}</button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar name={user.name} color={user.avatar} size={100} />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
              <Camera size={16} className="text-white" />
            </button>
          </div>
        </div>
        {/* Name */}
        <div>
          <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('name')}</label>
          <input value={name} onChange={e => setName(e.target.value)} className="input-field mt-1" maxLength={50} />
        </div>
        {/* Username */}
        <div>
          <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('username')}</label>
          <input value={user.username} disabled className="input-field mt-1 opacity-60" />
          <p className={`text-xs mt-1 ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>Username cannot be changed yet</p>
        </div>
        {/* About */}
        <div>
          <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('aboutMe')}</label>
          <textarea value={about} onChange={e => setAbout(e.target.value)} className="input-field mt-1 resize-none h-20" maxLength={200} />
        </div>
        {/* Phone */}
        <div>
          <label className={`text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('phoneNum')}</label>
          <input value={user.phone} disabled className="input-field mt-1 opacity-60" />
        </div>
      </div>
    </div>
  );
}

// ============ APP ROOT ============
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
