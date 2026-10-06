// MessageBubble - Single message UI component
// Incoming/Outgoing messages with reactions, reply preview, status indicators

import React, { useState } from 'react';
import { Message, useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { useLang } from '../LanguageContext';
import { formatTime } from '../utils/time';
import { Check, CheckCheck, Star, Smile, Edit2, Trash2, Reply, Copy } from 'lucide-react';

interface Props {
  message: Message;
  isMe: boolean;
  senderName?: string;
  senderColor?: string;
  showSender?: boolean;
  replyContent?: string;
  replySender?: string;
}

export default function MessageBubble({ message, isMe, senderName, senderColor, showSender, replyContent, replySender }: Props) {
  const { resolved } = useTheme();
  const { t } = useLang();
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const { reactMessage, deleteForMe, deleteForAll, starMessage } = useStore();

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '💯'];

  if (message.deletedForMe) return null;

  const handleLongPress = () => {
    if (isMe) setShowMenu(true);
  };

  const handleReact = (emoji: string) => {
    reactMessage(message.chatId, message.id, emoji);
    setShowEmoji(false);
  };

  const handleDelete = (forAll: boolean) => {
    if (forAll) deleteForAll(message.chatId, message.id);
    else deleteForMe(message.chatId, message.id);
    setShowMenu(false);
  };

  const handleStar = () => {
    starMessage(message.chatId, message.id);
    setShowMenu(false);
  };

  // System message
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className={`text-xs px-3 py-1 rounded-full ${resolved === 'dark' ? 'bg-surface-800 text-surface-400' : 'bg-surface-200 text-surface-600'}`}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative max-w-[75%] ${isMe ? 'bg-primary-600 text-white' : resolved === 'dark' ? 'bg-surface-800 text-surface-100' : 'bg-white text-surface-900'} rounded-2xl px-3 py-2 shadow-sm`}>
        {/* Sender name (group chats) */}
        {showSender && !isMe && senderName && (
          <div className="text-xs font-semibold mb-1" style={{ color: senderColor }}>
            {senderName}
          </div>
        )}

        {/* Reply preview */}
        {replyContent && (
          <div className={`text-xs px-2 py-1 mb-1 rounded ${isMe ? 'bg-primary-700/50' : resolved === 'dark' ? 'bg-surface-700' : 'bg-surface-100'}`}>
            <div className="font-semibold">{replySender}</div>
            <div className="truncate">{replyContent}</div>
          </div>
        )}

        {/* Message content */}
        {message.deletedForAll ? (
          <div className="italic opacity-60">🚫 {t('msgDeleted')}</div>
        ) : (
          <div className="text-sm break-words whitespace-pre-wrap">{message.content}</div>
        )}

        {/* Timestamp + status */}
        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-white/70' : resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>
          {message.editedAt && <span>{t('edited')}</span>}
          <span>{formatTime(message.createdAt)}</span>
          {isMe && message.status === 'sent' && <Check size={12} />}
          {isMe && message.status === 'delivered' && <CheckCheck size={12} />}
          {isMe && message.status === 'read' && <CheckCheck size={12} className="text-blue-400" />}
          {message.starred && <Star size={10} className="fill-yellow-400 text-yellow-400" />}
        </div>

        {/* Reactions */}
        {Object.keys(message.reactions).length > 0 && (
          <div className={`absolute -bottom-3 ${isMe ? 'left-2' : 'right-2'} flex gap-0.5`}>
            {Object.entries(message.reactions).map(([emoji, users]) => (
              <div key={emoji} className={`text-xs px-1.5 py-0.5 rounded-full ${resolved === 'dark' ? 'bg-surface-700' : 'bg-white'} shadow-sm border ${resolved === 'dark' ? 'border-surface-600' : 'border-surface-200'}`}>
                {emoji} {users.length > 1 && <span className="text-[9px]">{users.length}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Long press menu */}
        {showMenu && (
          <div className={`absolute ${isMe ? 'right-0' : 'left-0'} top-full mt-1 z-10 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-white'} rounded-lg shadow-lg border ${resolved === 'dark' ? 'border-surface-700' : 'border-surface-200'} py-1 min-w-[140px]`}>
            <button onClick={() => { setShowEmoji(!showEmoji); }} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
              <Smile size={14} /> {t('reacted')}
            </button>
            {isMe && (
              <>
                <button onClick={() => { /* TODO: reply */ setShowMenu(false); }} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
                  <Reply size={14} /> {t('reply')}
                </button>
                <button onClick={() => { /* TODO: edit */ setShowMenu(false); }} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
                  <Edit2 size={14} /> {t('edit')}
                </button>
              </>
            )}
            <button onClick={handleStar} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
              <Star size={14} /> {t('star')}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(message.content); setShowMenu(false); }} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
              <Copy size={14} /> {t('copy')}
            </button>
            <button onClick={() => handleDelete(false)} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-500 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
              <Trash2 size={14} /> {t('deleteMe')}
            </button>
            {isMe && (
              <button onClick={() => handleDelete(true)} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-500 ${resolved === 'dark' ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}>
                <Trash2 size={14} /> {t('deleteAll')}
              </button>
            )}
          </div>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div className={`absolute ${isMe ? 'right-0' : 'left-0'} top-full mt-1 z-10 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-white'} rounded-lg shadow-lg border ${resolved === 'dark' ? 'border-surface-700' : 'border-surface-200'} p-2 grid grid-cols-4 gap-1`}>
            {emojis.map(e => (
              <button key={e} onClick={() => handleReact(e)} className="text-2xl hover:scale-110 transition-transform">
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Invisible overlay for long press */}
      {!showMenu && (
        <div
          className="absolute inset-0"
          onContextMenu={(e) => { e.preventDefault(); handleLongPress(); }}
          onTouchStart={() => {
            const timer = setTimeout(handleLongPress, 500);
            const cancel = () => clearTimeout(timer);
            document.addEventListener('touchend', cancel, { once: true });
            document.addEventListener('touchmove', cancel, { once: true });
          }}
        />
      )}
    </div>
  );
}
