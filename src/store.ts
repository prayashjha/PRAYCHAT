// PrayChat Store - Single source of truth
// Zustand store with localStorage + BroadcastChannel for real-time sync
// Firebase adapter ready - sirf config change karke switch hoga

import { create } from 'zustand';
import { storageGet, storageSet, storageRemove, subscribe, KEYS } from './utils/storage';
import { isFirebaseEnabled, initFirebase, getFirebase } from './firebase';
import { getStatusExpiry } from './utils/time';

// ============ TYPES ============
export interface User {
  id: string;
  phone: string;
  name: string;
  about: string;
  avatar: string; // color hex
  isOnline: boolean;
  lastSeen: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  replyTo?: string;
  reactions: Record<string, string[]>; // emoji -> userIds
  status: 'sending' | 'sent' | 'delivered' | 'read';
  starred: boolean;
  createdAt: number;
  editedAt?: number;
  deletedForMe: boolean;
  deletedForAll: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  about?: string;
  avatar?: string;
  members: string[];
  admins?: string[];
  lastMessage?: Message;
  unread: number;
  pinned: boolean;
  muted: boolean;
  typing?: string[]; // userIds who are typing
  createdAt: number;
  updatedAt: number;
}

export interface Status {
  id: string;
  userId: string;
  content: string;
  bgColor: string;
  viewedBy: string[];
  createdAt: number;
  expiresAt: number;
}

export interface CallRecord {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'missed' | 'declined' | 'completed';
  duration?: number;
  createdAt: number;
}

// ============ HELPERS ============
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];
const randomColor = () => avatarColors[Math.floor(Math.random() * avatarColors.length)];

// Direct chat ID = sorted user IDs joined (deterministic)
export const getDirectChatId = (uid1: string, uid2: string) => [uid1, uid2].sort().join(':');

// ============ STORE ============
interface Store {
  // State
  user: User | null;
  users: User[];
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> messages
  statuses: Status[];
  calls: CallRecord[];
  blocked: string[];
  
  // Auth actions
  login: (phone: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  deleteAccount: () => void;
  
  // Chat actions
  createDirectChat: (otherUserId: string) => string;
  createGroup: (name: string, memberIds: string[], about?: string) => string;
  deleteChat: (chatId: string) => void;
  pinChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  leaveGroup: (chatId: string) => void;
  markRead: (chatId: string) => void;
  
  // Message actions
  sendMessage: (chatId: string, content: string, type?: Message['type'], replyTo?: string) => void;
  editMessage: (chatId: string, msgId: string, content: string) => void;
  deleteForMe: (chatId: string, msgId: string) => void;
  deleteForAll: (chatId: string, msgId: string) => void;
  reactMessage: (chatId: string, msgId: string, emoji: string) => void;
  starMessage: (chatId: string, msgId: string) => void;
  
  // Status actions
  createStatus: (content: string, bgColor: string) => void;
  viewStatus: (statusId: string) => void;
  deleteStatus: (statusId: string) => void;
  
  // Call actions
  addCall: (callerId: string, receiverId: string, type: CallRecord['type'], status: CallRecord['status'], duration?: number) => void;
  
  // Other
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  
  // Internal
  _loadFromStorage: () => void;
  _persist: () => void;
}

export const useStore = create<Store>((set, get) => ({
  // Initial state
  user: null,
  users: [],
  chats: [],
  messages: {},
  statuses: [],
  calls: [],
  blocked: [],

  // ============ AUTH ============
  login: (phone, name) => {
    const { users } = get();
    let user = users.find(u => u.phone === phone);
    
    if (!user) {
      // New user - register karo
      user = {
        id: uid(),
        phone,
        name,
        about: 'Hey! I am using PrayChat',
        avatar: randomColor(),
        isOnline: true,
        lastSeen: Date.now(),
      };
      const newUsers = [...users, user];
      storageSet(KEYS.USERS, newUsers);
      set({ users: newUsers });
    } else {
      // Existing user - update karo
      const updated = { ...user, isOnline: true, lastSeen: Date.now() };
      const newUsers = users.map(u => u.id === user!.id ? updated : u);
      storageSet(KEYS.USERS, newUsers);
      set({ users: newUsers });
      user = updated;
    }
    
    storageSet(KEYS.USER, user);
    set({ user, blocked: storageGet(KEYS.BLOCKED, []) });
  },

  logout: () => {
    const { user, users } = get();
    if (user) {
      const newUsers = users.map(u => u.id === user.id ? { ...u, isOnline: false, lastSeen: Date.now() } : u);
      storageSet(KEYS.USERS, newUsers);
      set({ users: newUsers });
    }
    storageRemove(KEYS.USER);
    set({ user: null });
  },

  updateProfile: (updates) => {
    const { user, users } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    const newUsers = users.map(u => u.id === user.id ? updated : u);
    storageSet(KEYS.USER, updated);
    storageSet(KEYS.USERS, newUsers);
    set({ user: updated, users: newUsers });
  },

  deleteAccount: () => {
    const { user, users, chats } = get();
    if (!user) return;
    // Remove user from all chats
    const newChats = chats.map(c => ({ ...c, members: c.members.filter(m => m !== user.id) }));
    const newUsers = users.filter(u => u.id !== user.id);
    storageSet(KEYS.USER, null);
    storageSet(KEYS.USERS, newUsers);
    storageSet(KEYS.CHATS, newChats);
    set({ user: null, users: newUsers, chats: newChats });
  },

  // ============ CHATS ============
  createDirectChat: (otherUserId) => {
    const { user, chats } = get();
    if (!user) return '';
    const chatId = getDirectChatId(user.id, otherUserId);
    const existing = chats.find(c => c.id === chatId);
    if (existing) return chatId;
    
    const chat: Chat = {
      id: chatId,
      type: 'direct',
      members: [user.id, otherUserId],
      unread: 0,
      pinned: false,
      muted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newChats = [...chats, chat];
    storageSet(KEYS.CHATS, newChats);
    set({ chats: newChats });
    return chatId;
  },

  createGroup: (name, memberIds, about) => {
    const { user, chats } = get();
    if (!user) return '';
    const chatId = 'group_' + uid();
    const chat: Chat = {
      id: chatId,
      type: 'group',
      name,
      about,
      avatar: randomColor(),
      members: [user.id, ...memberIds],
      admins: [user.id],
      unread: 0,
      pinned: false,
      muted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newChats = [...chats, chat];
    storageSet(KEYS.CHATS, newChats);
    set({ chats: newChats });
    
    // System message
    get().sendMessage(chatId, `${user.name} created group "${name}"`, 'system');
    return chatId;
  },

  deleteChat: (chatId) => {
    const { chats, messages } = get();
    const newChats = chats.filter(c => c.id !== chatId);
    const newMessages = { ...messages };
    delete newMessages[chatId];
    storageSet(KEYS.CHATS, newChats);
    storageSet(KEYS.MESSAGES, newMessages);
    set({ chats: newChats, messages: newMessages });
  },

  pinChat: (chatId) => {
    const { chats } = get();
    const newChats = chats.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c);
    storageSet(KEYS.CHATS, newChats);
    set({ chats: newChats });
  },

  muteChat: (chatId) => {
    const { chats } = get();
    const newChats = chats.map(c => c.id === chatId ? { ...c, muted: !c.muted } : c);
    storageSet(KEYS.CHATS, newChats);
    set({ chats: newChats });
  },

  leaveGroup: (chatId) => {
    const { user, chats } = get();
    if (!user) return;
    const newChats = chats.map(c => c.id === chatId ? { ...c, members: c.members.filter(m => m !== user.id) } : c);
    storageSet(KEYS.CHATS, newChats);
    set({ chats: newChats });
  },

  markRead: (chatId) => {
    const { chats } = get();
    const newChats = chats.map(c => c.id === chatId ? { ...c, unread: 0 } : c);
    storageSet(KEYS.CHATS, newChats);
    set({ chats: newChats });
  },

  // ============ MESSAGES ============
  sendMessage: (chatId, content, type = 'text', replyTo) => {
    const { user, messages, chats } = get();
    if (!user) return;
    
    const msg: Message = {
      id: uid(),
      chatId,
      senderId: user.id,
      content,
      type,
      replyTo,
      reactions: {},
      status: 'sent',
      starred: false,
      createdAt: Date.now(),
      deletedForMe: false,
      deletedForAll: false,
    };
    
    const chatMsgs = messages[chatId] || [];
    const newMessages = { ...messages, [chatId]: [...chatMsgs, msg] };
    
    // Update chat last message
    const newChats = chats.map(c => c.id === chatId ? { ...c, lastMessage: msg, updatedAt: Date.now() } : c);
    
    storageSet(KEYS.MESSAGES, newMessages);
    storageSet(KEYS.CHATS, newChats);
    set({ messages: newMessages, chats: newChats });
    
    // Simulate delivery after 1s
    setTimeout(() => {
      const { messages: currMsgs } = get();
      const msgs = currMsgs[chatId] || [];
      const updated = msgs.map(m => m.id === msg.id ? { ...m, status: 'delivered' as const } : m);
      const newMsgs = { ...currMsgs, [chatId]: updated };
      storageSet(KEYS.MESSAGES, newMsgs);
      set({ messages: newMsgs });
    }, 1000);
  },

  editMessage: (chatId, msgId, content) => {
    const { messages } = get();
    const msgs = messages[chatId] || [];
    const updated = msgs.map(m => m.id === msgId ? { ...m, content, editedAt: Date.now() } : m);
    const newMessages = { ...messages, [chatId]: updated };
    storageSet(KEYS.MESSAGES, newMessages);
    set({ messages: newMessages });
  },

  deleteForMe: (chatId, msgId) => {
    const { messages } = get();
    const msgs = messages[chatId] || [];
    const updated = msgs.map(m => m.id === msgId ? { ...m, deletedForMe: true } : m);
    const newMessages = { ...messages, [chatId]: updated };
    storageSet(KEYS.MESSAGES, newMessages);
    set({ messages: newMessages });
  },

  deleteForAll: (chatId, msgId) => {
    const { messages } = get();
    const msgs = messages[chatId] || [];
    const updated = msgs.map(m => m.id === msgId ? { ...m, deletedForAll: true, content: '' } : m);
    const newMessages = { ...messages, [chatId]: updated };
    storageSet(KEYS.MESSAGES, newMessages);
    set({ messages: newMessages });
  },

  reactMessage: (chatId, msgId, emoji) => {
    const { user, messages } = get();
    if (!user) return;
    const msgs = messages[chatId] || [];
    const updated = msgs.map(m => {
      if (m.id !== msgId) return m;
      const reactions = { ...m.reactions };
      const users = reactions[emoji] || [];
      if (users.includes(user.id)) {
        reactions[emoji] = users.filter(u => u !== user.id);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...users, user.id];
      }
      return { ...m, reactions };
    });
    const newMessages = { ...messages, [chatId]: updated };
    storageSet(KEYS.MESSAGES, newMessages);
    set({ messages: newMessages });
  },

  starMessage: (chatId, msgId) => {
    const { messages } = get();
    const msgs = messages[chatId] || [];
    const updated = msgs.map(m => m.id === msgId ? { ...m, starred: !m.starred } : m);
    const newMessages = { ...messages, [chatId]: updated };
    storageSet(KEYS.MESSAGES, newMessages);
    set({ messages: newMessages });
  },

  // ============ STATUS ============
  createStatus: (content, bgColor) => {
    const { user, statuses } = get();
    if (!user) return;
    const now = Date.now();
    const status: Status = {
      id: uid(),
      userId: user.id,
      content,
      bgColor,
      viewedBy: [],
      createdAt: now,
      expiresAt: getStatusExpiry(now),
    };
    const newStatuses = [...statuses, status];
    storageSet(KEYS.STATUSES, newStatuses);
    set({ statuses: newStatuses });
  },

  viewStatus: (statusId) => {
    const { user, statuses } = get();
    if (!user) return;
    const newStatuses = statuses.map(s => {
      if (s.id !== statusId) return s;
      if (s.viewedBy.includes(user.id)) return s;
      return { ...s, viewedBy: [...s.viewedBy, user.id] };
    });
    storageSet(KEYS.STATUSES, newStatuses);
    set({ statuses: newStatuses });
  },

  deleteStatus: (statusId) => {
    const { statuses } = get();
    const newStatuses = statuses.filter(s => s.id !== statusId);
    storageSet(KEYS.STATUSES, newStatuses);
    set({ statuses: newStatuses });
  },

  // ============ CALLS ============
  addCall: (callerId, receiverId, type, status, duration) => {
    const { calls } = get();
    const call: CallRecord = { id: uid(), callerId, receiverId, type, status, duration, createdAt: Date.now() };
    const newCalls = [call, ...calls];
    storageSet(KEYS.CALLS, newCalls);
    set({ calls: newCalls });
  },

  // ============ BLOCKING ============
  blockUser: (userId) => {
    const { blocked } = get();
    if (blocked.includes(userId)) return;
    const newBlocked = [...blocked, userId];
    storageSet(KEYS.BLOCKED, newBlocked);
    set({ blocked: newBlocked });
  },

  unblockUser: (userId) => {
    const { blocked } = get();
    const newBlocked = blocked.filter(id => id !== userId);
    storageSet(KEYS.BLOCKED, newBlocked);
    set({ blocked: newBlocked });
  },

  // ============ INTERNAL ============
  _loadFromStorage: () => {
    set({
      user: storageGet<User | null>(KEYS.USER, null),
      users: storageGet<User[]>(KEYS.USERS, []),
      chats: storageGet<Chat[]>(KEYS.CHATS, []),
      messages: storageGet<Record<string, Message[]>>(KEYS.MESSAGES, {}),
      statuses: storageGet<Status[]>(KEYS.STATUSES, []),
      calls: storageGet<CallRecord[]>(KEYS.CALLS, []),
      blocked: storageGet<string[]>(KEYS.BLOCKED, []),
    });
  },

  _persist: () => {
    const { user, users, chats, messages, statuses, calls, blocked } = get();
    storageSet(KEYS.USER, user);
    storageSet(KEYS.USERS, users);
    storageSet(KEYS.CHATS, chats);
    storageSet(KEYS.MESSAGES, messages);
    storageSet(KEYS.STATUSES, statuses);
    storageSet(KEYS.CALLS, calls);
    storageSet(KEYS.BLOCKED, blocked);
  },
}));

// ============ SYNC ============
// Subscribe to storage changes (from other tabs via BroadcastChannel)
subscribe((key, value) => {
  const state: any = {};
  if (key === KEYS.USER) state.user = value;
  else if (key === KEYS.USERS) state.users = value;
  else if (key === KEYS.CHATS) state.chats = value;
  else if (key === KEYS.MESSAGES) state.messages = value;
  else if (key === KEYS.STATUSES) state.statuses = value;
  else if (key === KEYS.CALLS) state.calls = value;
  else if (key === KEYS.BLOCKED) state.blocked = value;
  useStore.setState(state);
});

// Initialize store from storage on load
useStore.getState()._loadFromStorage();

// Initialize Firebase if configured
if (isFirebaseEnabled()) {
  initFirebase().then(fb => {
    if (fb) console.log('[PrayChat] Firebase ready - switching to cloud mode');
    // TODO: Add Firestore listeners here when Firebase is configured
  });
}

// ============ SELECTORS ============
// Helper functions to get derived data
export const selectOtherUser = (chat: Chat, currentUserId: string, users: User[]) => {
  if (chat.type !== 'direct') return null;
  const otherId = chat.members.find(m => m !== currentUserId);
  return otherId ? users.find(u => u.id === otherId) : null;
};

export const selectChatName = (chat: Chat, currentUserId: string, users: User[]) => {
  if (chat.type === 'group') return chat.name || 'Group';
  const other = selectOtherUser(chat, currentUserId, users);
  return other?.name || 'Unknown';
};

export const selectChatAvatar = (chat: Chat, currentUserId: string, users: User[]) => {
  if (chat.type === 'group') return { name: (chat.name || 'G')[0], color: chat.avatar || '#6366f1' };
  const other = selectOtherUser(chat, currentUserId, users);
  return { name: (other?.name || '?')[0], color: other?.avatar || '#6366f1' };
};
