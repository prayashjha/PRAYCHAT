// ChatList - Main chat list screen
// Shows all chats with search, pinned section, online indicators

import React, { useState } from 'react';
import { useStore, selectChatName, selectChatAvatar, selectOtherUser } from '../store';
import { useTheme } from '../ThemeContext';
import { useLang } from '../LanguageContext';
import { formatChatDate } from '../utils/time';
import { Search, Plus, MessageCircle } from 'lucide-react';

interface Props {
  onOpenChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

export default function ChatList({ onOpenChat, onNewChat, onNewGroup }: Props) {
  const { resolved } = useTheme();
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const { user, users, chats } = useStore();

  if (!user) return null;

  // Filter and sort chats
  const filtered = chats.filter(c => {
    if (!c.members.includes(user.id)) return false;
    if (!search) return true;
    const name = selectChatName(c, user.id, users).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const pinned = filtered.filter(c => c.pinned);
  const regular = filtered.filter(c => !c.pinned).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-4 pt-3 pb-2 ${resolved === 'dark' ? 'bg-surface-900' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold gradient-text">PrayChat</h1>
          <div className="flex gap-1">
            <button onClick={onNewGroup} className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
              <Plus size={20} />
            </button>
            <button onClick={onNewChat} className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
              <MessageCircle size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
          <Search size={16} className={resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search')}
            className={`flex-1 bg-transparent outline-none text-sm ${resolved === 'dark' ? 'text-white placeholder:text-surface-500' : 'text-surface-900 placeholder:text-surface-400'}`}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {pinned.length === 0 && regular.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
              <MessageCircle size={28} className="text-primary-500" />
            </div>
            <p className={`font-medium mb-1 ${resolved === 'dark' ? 'text-surface-300' : 'text-surface-700'}`}>{t('noChats')}</p>
            <p className={`text-sm ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>{t('startConv')}</p>
          </div>
        ) : (
          <>
            {/* Pinned chats */}
            {pinned.length > 0 && (
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                📌 {t('pinned')}
              </div>
            )}
            {pinned.map(chat => (
              <ChatItem key={chat.id} chat={chat} onClick={() => onOpenChat(chat.id)} />
            ))}

            {/* Regular chats */}
            {regular.map(chat => (
              <ChatItem key={chat.id} chat={chat} onClick={() => onOpenChat(chat.id)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ChatItem({ chat, onClick }: { chat: any; onClick: () => void }) {
  const { resolved } = useTheme();
  const { user, users } = useStore();
  if (!user) return null;

  const name = selectChatName(chat, user.id, users);
  const avatar = selectChatAvatar(chat, user.id, users);
  const other = selectOtherUser(chat, user.id, users);
  const lastMsg = chat.lastMessage;

  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${resolved === 'dark' ? 'hover:bg-surface-800/50 active:bg-surface-800' : 'hover:bg-surface-50 active:bg-surface-100'}`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: avatar.color, fontSize: '18px' }}>
          {avatar.name}
        </div>
        {other?.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-surface-900" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <span className={`font-semibold text-[15px] truncate ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>
            {name}
          </span>
          {lastMsg && (
            <span className={`text-[11px] flex-shrink-0 ${chat.unread > 0 ? 'text-primary-500 font-semibold' : resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>
              {formatChatDate(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className={`text-sm truncate ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            {lastMsg?.deletedForAll ? '🚫 Message deleted' : lastMsg?.content || ''}
          </p>
          {chat.unread > 0 && (
            <span className="ml-2 min-w-[20px] h-5 px-1.5 bg-primary-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
