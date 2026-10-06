// ChatScreen - Individual chat view
// Messages list, composer, emoji picker, reply/edit indicators

import React, { useState, useRef, useEffect } from 'react';
import { useStore, selectChatName, selectChatAvatar, selectOtherUser, Message } from '../store';
import { useTheme } from '../ThemeContext';
import { useLang } from '../LanguageContext';
import { formatMessageDate } from '../utils/time';
import MessageBubble from './MessageBubble';
import { ArrowLeft, Phone, Video, Smile, Send, Mic, Paperclip, X, Check } from 'lucide-react';

interface Props {
  chatId: string;
  onBack: () => void;
}

export default function ChatScreen({ chatId, onBack }: Props) {
  const { resolved } = useTheme();
  const { t } = useLang();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, users, chats, messages, sendMessage, markRead } = useStore();
  const chat = chats.find(c => c.id === chatId);
  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    markRead(chatId);
  }, [chatId, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  if (!user || !chat) return null;

  const name = selectChatName(chat, user.id, users);
  const avatar = selectChatAvatar(chat, user.id, users);
  const other = selectOtherUser(chat, user.id, users);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input.trim(), 'text', replyTo?.id);
    setInput('');
    setReplyTo(null);
    setShowEmoji(false);
  };

  const emojis = ['😀', '😂', '❤️', '👍', '🙏', '😊', '🎉', '🔥', '💯', '😍', '🤔', '😢', '👋', '✨', '💪', '🙌'];

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  chatMessages.forEach(msg => {
    const date = formatMessageDate(msg.createdAt);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  return (
    <div className={`flex flex-col h-full ${resolved === 'dark' ? 'bg-surface-900' : 'bg-surface-100'}`}>
      {/* Header */}
      <header className={`flex items-center gap-3 px-3 py-2 ${resolved === 'dark' ? 'bg-surface-900 border-b border-surface-800' : 'bg-white border-b border-surface-200'}`}>
        <button onClick={onBack} className={`p-1.5 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
          <ArrowLeft size={22} />
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: avatar.color }}>
          {avatar.name}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{name}</p>
          <p className={`text-xs ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            {chat.type === 'group' ? `${chat.members.length} ${t('members')}` : other?.isOnline ? t('online') : `${t('lastSeen')} recently`}
          </p>
        </div>
        <button className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
          <Phone size={20} />
        </button>
        <button className={`p-2 rounded-full ${resolved === 'dark' ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}>
          <Video size={20} />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {groupedMessages.map((group, gIdx) => (
          <div key={gIdx}>
            {/* Date separator */}
            <div className="flex justify-center my-3">
              <span className={`text-[11px] px-3 py-1 rounded-full ${resolved === 'dark' ? 'bg-surface-800 text-surface-400' : 'bg-white text-surface-500 shadow-sm'}`}>
                {group.date}
              </span>
            </div>
            {/* Messages */}
            {group.messages.map(msg => {
              const isMe = msg.senderId === user.id;
              const sender = users.find(u => u.id === msg.senderId);
              const replyMsg = msg.replyTo ? chatMessages.find(m => m.id === msg.replyTo) : null;
              const replySender = replyMsg ? users.find(u => u.id === replyMsg.senderId)?.name : undefined;
              
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isMe={isMe}
                  senderName={sender?.name}
                  senderColor={sender?.avatar}
                  showSender={chat.type === 'group' && !isMe}
                  replyContent={replyMsg?.content}
                  replySender={replySender}
                />
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className={`px-3 py-2 border-t ${resolved === 'dark' ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
          <div className="grid grid-cols-8 gap-2">
            {emojis.map(e => (
              <button key={e} onClick={() => setInput(prev => prev + e)} className="text-2xl p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reply preview */}
      {replyTo && (
        <div className={`flex items-center gap-2 px-4 py-2 border-t ${resolved === 'dark' ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary-500">
              {replyTo.senderId === user.id ? t('you') : users.find(u => u.id === replyTo.senderId)?.name}
            </p>
            <p className={`text-xs truncate ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              {replyTo.content}
            </p>
          </div>
          <button onClick={() => setReplyTo(null)}>
            <X size={16} className="text-surface-400" />
          </button>
        </div>
      )}

      {/* Composer */}
      <div className={`flex items-center gap-2 px-3 py-2 ${resolved === 'dark' ? 'bg-surface-900 border-t border-surface-800' : 'bg-white border-t border-surface-200'}`}>
        <button onClick={() => setShowEmoji(!showEmoji)} className={`p-2 rounded-full ${resolved === 'dark' ? 'text-surface-400 hover:bg-surface-800' : 'text-surface-500 hover:bg-surface-100'}`}>
          <Smile size={22} />
        </button>
        <button className={`p-2 rounded-full ${resolved === 'dark' ? 'text-surface-400 hover:bg-surface-800' : 'text-surface-500 hover:bg-surface-100'}`}>
          <Paperclip size={22} />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={t('typeMsg')}
          className={`flex-1 px-4 py-2.5 rounded-full text-[15px] outline-none ${resolved === 'dark' ? 'bg-surface-800 text-white placeholder:text-surface-500' : 'bg-surface-100 text-surface-900 placeholder:text-surface-400'}`}
        />
        {input.trim() ? (
          <button onClick={handleSend} className="p-2.5 rounded-full bg-primary-500 text-white shadow-lg">
            <Send size={20} />
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
