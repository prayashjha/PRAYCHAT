// StatusTab - Status/Stories screen
// My status, others' status, status viewer, status creator

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { useLang } from '../LanguageContext';
import { formatTime, isStatusExpired } from '../utils/time';
import { Plus, X, ArrowLeft } from 'lucide-react';

export default function StatusTab() {
  const { resolved } = useTheme();
  const { t } = useLang();
  const { user, users, statuses, createStatus, viewStatus } = useStore();
  const [viewing, setViewing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#6366f1');

  if (!user) return null;

  // Clean expired statuses
  const activeStatuses = statuses.filter(s => !isStatusExpired(s.expiresAt));
  const myStatuses = activeStatuses.filter(s => s.userId === user.id);
  const othersStatuses = activeStatuses.filter(s => s.userId !== user.id);

  // Group by user
  const grouped: Record<string, typeof activeStatuses> = {};
  othersStatuses.forEach(s => {
    if (!grouped[s.userId]) grouped[s.userId] = [];
    grouped[s.userId].push(s);
  });

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#1e293b'];

  const handleCreate = () => {
    if (!content.trim()) return;
    createStatus(content.trim(), bgColor);
    setContent('');
    setCreating(false);
  };

  // Status viewer
  if (viewing) {
    const status = activeStatuses.find(s => s.id === viewing);
    if (!status) { setViewing(null); return null; }
    const statusUser = users.find(u => u.id === status.userId);
    
    useEffect(() => {
      viewStatus(status.id);
      const timer = setTimeout(() => setViewing(null), 5000);
      return () => clearTimeout(timer);
    }, [viewing]);

    return (
      <div className="h-full flex flex-col bg-black relative">
        {/* Progress bar */}
        <div className="absolute top-2 left-2 right-2 h-0.5 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[grow_5s_linear]" />
        </div>
        {/* Header */}
        <div className="absolute top-6 left-3 right-3 flex items-center gap-3 z-10">
          <button onClick={() => setViewing(null)}>
            <ArrowLeft size={22} className="text-white" />
          </button>
          {statusUser && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: statusUser.avatar }}>
              {statusUser.name[0]}
            </div>
          )}
          <div>
            <p className="text-white font-semibold text-sm">{statusUser?.name}</p>
            <p className="text-white/60 text-xs">{formatTime(status.createdAt)}</p>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: status.bgColor }}>
          <p className="text-white text-2xl font-semibold text-center">{status.content}</p>
        </div>
      </div>
    );
  }

  // Status creator
  if (creating) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: bgColor }}>
        <header className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setCreating(false)}>
            <ArrowLeft size={22} className="text-white" />
          </button>
          <div className="flex-1" />
          <button onClick={handleCreate} disabled={!content.trim()} className="text-white font-semibold disabled:opacity-50">
            Post
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center p-8">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type a status..."
            className="w-full bg-transparent text-white text-2xl text-center font-semibold outline-none resize-none placeholder:text-white/50"
            maxLength={500}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-center gap-2 pb-8">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setBgColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${bgColor === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Status list
  return (
    <div className="h-full overflow-y-auto">
      {/* My status */}
      <div className={`px-4 py-3 flex items-center gap-3 ${resolved === 'dark' ? 'border-b border-surface-800' : 'border-b border-surface-200'}`}>
        <button onClick={() => setCreating(true)} className="relative">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold" style={{ backgroundColor: user.avatar }}>
            {user.name[0]}
          </div>
          {myStatuses.length === 0 && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900">
              <Plus size={14} className="text-white" />
            </div>
          )}
        </button>
        <div>
          <p className={`font-semibold ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{t('myStatus')}</p>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            {myStatuses.length > 0 ? `${myStatuses.length} active` : t('addStatus')}
          </p>
        </div>
      </div>

      {/* Others' statuses */}
      {Object.keys(grouped).length > 0 && (
        <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
          {t('recent')}
        </div>
      )}
      {Object.entries(grouped).map(([userId, userStatuses]) => {
        const u = users.find(usr => usr.id === userId);
        if (!u) return null;
        const hasViewed = userStatuses.every(s => s.viewedBy.includes(user.id));
        return (
          <button
            key={userId}
            onClick={() => setViewing(userStatuses[0].id)}
            className={`w-full flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'hover:bg-surface-800/50' : 'hover:bg-surface-50'}`}
          >
            <div className={`w-14 h-14 rounded-full p-0.5 ${hasViewed ? 'bg-surface-400' : 'bg-gradient-to-tr from-primary-500 to-accent-500'}`}>
              <div className="w-full h-full rounded-full flex items-center justify-center text-white text-xl font-semibold bg-white dark:bg-surface-900 p-0.5">
                <div className="w-full h-full rounded-full flex items-center justify-center text-white" style={{ backgroundColor: u.avatar }}>
                  {u.name[0]}
                </div>
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

      {Object.keys(grouped).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
            <Plus size={28} className="text-primary-500" />
          </div>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('noStatus')}</p>
        </div>
      )}
    </div>
  );
}
