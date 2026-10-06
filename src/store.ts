// PrayChat Local Data Store
// NOTE: This uses localStorage for demo/development persistence.
// In production, all operations go through backend services via API.
// This store simulates the service layer for a fully functional client.

export interface User {
  id: string;
  phone: string;
  name: string;
  username: string;
  about: string;
  avatar: string; // color for avatar
  avatarUrl?: string;
  isOnline: boolean;
  lastSeen: number;
  createdAt: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'audio' | 'system';
  content: string;
  replyTo?: string;
  reactions: Record<string, string[]>; // emoji -> userIds
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: number;
  editedAt?: number;
  deletedForMe?: boolean;
  deletedForEveryone?: boolean;
  starred?: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  about?: string;
  avatar?: string;
  members: string[];
  admins?: string[];
  createdBy?: string;
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  disappearingMessages: 'off' | '24h' | '7d' | '90d';
  createdAt: number;
  updatedAt: number;
}

export interface Status {
  id: string;
  userId: string;
  type: 'text' | 'image';
  content: string;
  bgColor?: string;
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

export interface PrivacySettings {
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  about: 'everyone' | 'contacts' | 'nobody';
  status: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  groups: 'everyone' | 'contacts';
}

const DB_KEYS = {
  users: 'pc_users',
  currentUserId: 'pc_current_user',
  chats: 'pc_chats',
  messages: 'pc_messages',
  statuses: 'pc_statuses',
  calls: 'pc_calls',
  contacts: 'pc_contacts',
  blocked: 'pc_blocked',
  privacy: 'pc_privacy',
};

function get<T>(key: string, fallback: T): T {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch { return fallback; }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('pc-data-change', { detail: { key } }));
}

export const uid = () => Math.random().toString(36).substring(2, 12) + Date.now().toString(36);

// ============ AUTH ============
export const authStore = {
  getCurrentUser(): User | null {
    const id = localStorage.getItem(DB_KEYS.currentUserId);
    if (!id) return null;
    const users = get<User[]>(DB_KEYS.users, []);
    return users.find(u => u.id === id) || null;
  },
  register(phone: string, name: string): User {
    const users = get<User[]>(DB_KEYS.users, []);
    const existing = users.find(u => u.phone === phone);
    if (existing) {
      localStorage.setItem(DB_KEYS.currentUserId, existing.id);
      return existing;
    }
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];
    const user: User = {
      id: uid(),
      phone,
      name,
      username: name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substring(2, 5),
      about: 'Hey there! I am using PrayChat',
      avatar: colors[Math.floor(Math.random() * colors.length)],
      isOnline: true,
      lastSeen: Date.now(),
      createdAt: Date.now(),
    };
    users.push(user);
    set(DB_KEYS.users, users);
    localStorage.setItem(DB_KEYS.currentUserId, user.id);
    // Set default privacy
    const priv = get<Record<string, PrivacySettings>>('pc_privacy_all', {});
    priv[user.id] = { lastSeen: 'everyone', profilePhoto: 'everyone', about: 'everyone', status: 'contacts', readReceipts: true, groups: 'everyone' };
    set('pc_privacy_all', priv);
    return user;
  },
  logout() {
    const user = this.getCurrentUser();
    if (user) {
      const users = get<User[]>(DB_KEYS.users, []);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) { users[idx].isOnline = false; users[idx].lastSeen = Date.now(); set(DB_KEYS.users, users); }
    }
    localStorage.removeItem(DB_KEYS.currentUserId);
  },
  updateProfile(updates: Partial<User>) {
    const user = this.getCurrentUser();
    if (!user) return null;
    const users = get<User[]>(DB_KEYS.users, []);
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) { users[idx] = { ...users[idx], ...updates }; set(DB_KEYS.users, users); return users[idx]; }
    return null;
  },
  deleteAccount() {
    const user = this.getCurrentUser();
    if (!user) return;
    let users = get<User[]>(DB_KEYS.users, []);
    users = users.filter(u => u.id !== user.id);
    set(DB_KEYS.users, users);
    // Remove user from all chats
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    const updated = chats.map(c => ({ ...c, members: c.members.filter(m => m !== user.id) }));
    set(DB_KEYS.chats, updated);
    localStorage.removeItem(DB_KEYS.currentUserId);
  }
};

// ============ USERS ============
export const userStore = {
  getAll(): User[] { return get<User[]>(DB_KEYS.users, []); },
  getById(id: string): User | undefined { return this.getAll().find(u => u.id === id); },
  search(query: string): User[] {
    const me = authStore.getCurrentUser();
    const q = query.toLowerCase();
    return this.getAll().filter(u => u.id !== me?.id && (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.phone.includes(q)));
  },
  setOnline(id: string, online: boolean) {
    const users = get<User[]>(DB_KEYS.users, []);
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { users[idx].isOnline = online; users[idx].lastSeen = Date.now(); set(DB_KEYS.users, users); }
  }
};

// ============ CHATS ============
export const chatStore = {
  getAll(): Chat[] {
    const me = authStore.getCurrentUser();
    if (!me) return [];
    return get<Chat[]>(DB_KEYS.chats, []).filter(c => c.members.includes(me.id) && !c.isArchived);
  },
  getArchived(): Chat[] {
    const me = authStore.getCurrentUser();
    if (!me) return [];
    return get<Chat[]>(DB_KEYS.chats, []).filter(c => c.members.includes(me.id) && c.isArchived);
  },
  getById(id: string): Chat | undefined { return get<Chat[]>(DB_KEYS.chats, []).find(c => c.id === id); },
  getOrCreateDirect(otherUserId: string): Chat {
    const me = authStore.getCurrentUser()!;
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    const existing = chats.find(c => c.type === 'direct' && c.members.includes(me.id) && c.members.includes(otherUserId));
    if (existing) return existing;
    const chat: Chat = {
      id: uid(), type: 'direct', members: [me.id, otherUserId],
      unreadCount: 0, isPinned: false, isMuted: false, isArchived: false,
      disappearingMessages: 'off', createdAt: Date.now(), updatedAt: Date.now()
    };
    chats.push(chat);
    set(DB_KEYS.chats, chats);
    return chat;
  },
  createGroup(name: string, memberIds: string[], about?: string): Chat {
    const me = authStore.getCurrentUser()!;
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    const chat: Chat = {
      id: uid(), type: 'group', name, about, avatar: colors[Math.floor(Math.random() * colors.length)],
      members: [me.id, ...memberIds], admins: [me.id], createdBy: me.id,
      unreadCount: 0, isPinned: false, isMuted: false, isArchived: false,
      disappearingMessages: 'off', createdAt: Date.now(), updatedAt: Date.now()
    };
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    chats.push(chat);
    set(DB_KEYS.chats, chats);
    // System message
    messageStore.addSystem(chat.id, `${me.name} created group "${name}"`);
    return chat;
  },
  update(id: string, updates: Partial<Chat>) {
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    const idx = chats.findIndex(c => c.id === id);
    if (idx >= 0) { chats[idx] = { ...chats[idx], ...updates, updatedAt: Date.now() }; set(DB_KEYS.chats, chats); }
  },
  delete(id: string) {
    let chats = get<Chat[]>(DB_KEYS.chats, []);
    chats = chats.filter(c => c.id !== id);
    set(DB_KEYS.chats, chats);
    // Delete messages too
    let msgs = get<Message[]>(DB_KEYS.messages, []);
    msgs = msgs.filter(m => m.chatId !== id);
    set(DB_KEYS.messages, msgs);
  },
  leaveGroup(id: string) {
    const me = authStore.getCurrentUser()!;
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    const idx = chats.findIndex(c => c.id === id);
    if (idx >= 0) {
      chats[idx].members = chats[idx].members.filter(m => m !== me.id);
      set(DB_KEYS.chats, chats);
    }
  },
  markRead(chatId: string) {
    const me = authStore.getCurrentUser()!;
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    const idx = chats.findIndex(c => c.id === chatId);
    if (idx >= 0) { chats[idx].unreadCount = 0; set(DB_KEYS.chats, chats); }
    // Mark messages as read
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    msgs.forEach(m => { if (m.chatId === chatId && m.senderId !== me.id && m.status !== 'read') m.status = 'read'; });
    set(DB_KEYS.messages, msgs);
  }
};

// ============ MESSAGES ============
export const messageStore = {
  getAll(chatId: string): Message[] {
    return get<Message[]>(DB_KEYS.messages, []).filter(m => m.chatId === chatId && !m.deletedForMe).sort((a, b) => a.createdAt - b.createdAt);
  },
  add(chatId: string, content: string, type: Message['type'] = 'text', replyTo?: string): Message {
    const me = authStore.getCurrentUser()!;
    const msg: Message = {
      id: uid(), chatId, senderId: me.id, type, content, replyTo,
      reactions: {}, status: 'sent', createdAt: Date.now()
    };
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    msgs.push(msg);
    set(DB_KEYS.messages, msgs);
    // Update chat last message
    const chats = get<Chat[]>(DB_KEYS.chats, []);
    const idx = chats.findIndex(c => c.id === chatId);
    if (idx >= 0) { chats[idx].lastMessage = msg; chats[idx].updatedAt = Date.now(); set(DB_KEYS.chats, chats); }
    // Simulate delivery after a moment
    setTimeout(() => {
      const all = get<Message[]>(DB_KEYS.messages, []);
      const mi = all.findIndex(m => m.id === msg.id);
      if (mi >= 0) { all[mi].status = 'delivered'; set(DB_KEYS.messages, all); }
    }, 800);
    return msg;
  },
  addSystem(chatId: string, content: string) {
    const msg: Message = {
      id: uid(), chatId, senderId: 'system', type: 'system', content,
      reactions: {}, status: 'sent', createdAt: Date.now()
    };
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    msgs.push(msg);
    set(DB_KEYS.messages, msgs);
  },
  edit(id: string, content: string) {
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    const idx = msgs.findIndex(m => m.id === id);
    if (idx >= 0) { msgs[idx].content = content; msgs[idx].editedAt = Date.now(); set(DB_KEYS.messages, msgs); }
  },
  deleteForMe(id: string) {
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    const idx = msgs.findIndex(m => m.id === id);
    if (idx >= 0) { msgs[idx].deletedForMe = true; set(DB_KEYS.messages, msgs); }
  },
  deleteForEveryone(id: string) {
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    const idx = msgs.findIndex(m => m.id === id);
    if (idx >= 0) { msgs[idx].deletedForEveryone = true; msgs[idx].content = 'This message was deleted'; set(DB_KEYS.messages, msgs); }
  },
  react(msgId: string, emoji: string) {
    const me = authStore.getCurrentUser()!;
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    const idx = msgs.findIndex(m => m.id === msgId);
    if (idx < 0) return;
    const r = msgs[idx].reactions;
    if (!r[emoji]) r[emoji] = [];
    const ui = r[emoji].indexOf(me.id);
    if (ui >= 0) r[emoji].splice(ui, 1); else r[emoji].push(me.id);
    if (r[emoji].length === 0) delete r[emoji];
    set(DB_KEYS.messages, msgs);
  },
  star(id: string) {
    const msgs = get<Message[]>(DB_KEYS.messages, []);
    const idx = msgs.findIndex(m => m.id === id);
    if (idx >= 0) { msgs[idx].starred = !msgs[idx].starred; set(DB_KEYS.messages, msgs); }
  },
  search(chatId: string, query: string): Message[] {
    const q = query.toLowerCase();
    return this.getAll(chatId).filter(m => m.content.toLowerCase().includes(q));
  }
};

// ============ STATUS ============
export const statusStore = {
  getAll(): Status[] {
    const now = Date.now();
    return get<Status[]>(DB_KEYS.statuses, []).filter(s => s.expiresAt > now);
  },
  getForUser(userId: string): Status[] {
    return this.getAll().filter(s => s.userId === userId);
  },
  create(content: string, type: Status['type'] = 'text', bgColor?: string): Status {
    const me = authStore.getCurrentUser()!;
    const s: Status = {
      id: uid(), userId: me.id, type, content, bgColor: bgColor || '#6366f1',
      viewedBy: [], createdAt: Date.now(), expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
    const all = get<Status[]>(DB_KEYS.statuses, []);
    all.push(s);
    set(DB_KEYS.statuses, all);
    return s;
  },
  view(id: string) {
    const me = authStore.getCurrentUser()!;
    const all = get<Status[]>(DB_KEYS.statuses, []);
    const idx = all.findIndex(s => s.id === id);
    if (idx >= 0 && !all[idx].viewedBy.includes(me.id)) {
      all[idx].viewedBy.push(me.id);
      set(DB_KEYS.statuses, all);
    }
  },
  delete(id: string) {
    let all = get<Status[]>(DB_KEYS.statuses, []);
    all = all.filter(s => s.id !== id);
    set(DB_KEYS.statuses, all);
  }
};

// ============ CALLS ============
export const callStore = {
  getAll(): CallRecord[] {
    const me = authStore.getCurrentUser();
    if (!me) return [];
    return get<CallRecord[]>(DB_KEYS.calls, []).filter(c => c.callerId === me.id || c.receiverId === me.id).sort((a, b) => b.createdAt - a.createdAt);
  },
  add(callerId: string, receiverId: string, type: CallRecord['type'], status: CallRecord['status'], duration?: number) {
    const call: CallRecord = { id: uid(), callerId, receiverId, type, status, duration, createdAt: Date.now() };
    const all = get<CallRecord[]>(DB_KEYS.calls, []);
    all.push(call);
    set(DB_KEYS.calls, all);
    return call;
  }
};

// ============ CONTACTS & BLOCKING ============
export const contactStore = {
  getContacts(): string[] {
    const me = authStore.getCurrentUser();
    if (!me) return [];
    const all = get<Record<string, string[]>>('pc_contacts_all', {});
    return all[me.id] || [];
  },
  add(userId: string) {
    const me = authStore.getCurrentUser()!;
    const all = get<Record<string, string[]>>('pc_contacts_all', {});
    if (!all[me.id]) all[me.id] = [];
    if (!all[me.id].includes(userId)) all[me.id].push(userId);
    set('pc_contacts_all', all);
  },
  remove(userId: string) {
    const me = authStore.getCurrentUser()!;
    const all = get<Record<string, string[]>>('pc_contacts_all', {});
    if (all[me.id]) all[me.id] = all[me.id].filter(id => id !== userId);
    set('pc_contacts_all', all);
  },
  getBlocked(): string[] {
    const me = authStore.getCurrentUser();
    if (!me) return [];
    const all = get<Record<string, string[]>>('pc_blocked_all', {});
    return all[me.id] || [];
  },
  block(userId: string) {
    const me = authStore.getCurrentUser()!;
    const all = get<Record<string, string[]>>('pc_blocked_all', {});
    if (!all[me.id]) all[me.id] = [];
    if (!all[me.id].includes(userId)) all[me.id].push(userId);
    set('pc_blocked_all', all);
  },
  unblock(userId: string) {
    const me = authStore.getCurrentUser()!;
    const all = get<Record<string, string[]>>('pc_blocked_all', {});
    if (all[me.id]) all[me.id] = all[me.id].filter(id => id !== userId);
    set('pc_blocked_all', all);
  }
};

// ============ PRIVACY ============
export const privacyStore = {
  get(): PrivacySettings {
    const me = authStore.getCurrentUser();
    if (!me) return { lastSeen: 'everyone', profilePhoto: 'everyone', about: 'everyone', status: 'contacts', readReceipts: true, groups: 'everyone' };
    const all = get<Record<string, PrivacySettings>>('pc_privacy_all', {});
    return all[me.id] || { lastSeen: 'everyone', profilePhoto: 'everyone', about: 'everyone', status: 'contacts', readReceipts: true, groups: 'everyone' };
  },
  update(settings: Partial<PrivacySettings>) {
    const me = authStore.getCurrentUser()!;
    const all = get<Record<string, PrivacySettings>>('pc_privacy_all', {});
    all[me.id] = { ...this.get(), ...settings };
    set('pc_privacy_all', all);
  }
};

// ============ HELPERS ============
export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
export function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000 && d.getDate() === now.getDate()) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}
export function formatLastSeen(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return formatDate(ts);
}
export function getChatName(chat: Chat): string {
  if (chat.type === 'group') return chat.name || 'Group';
  const me = authStore.getCurrentUser();
  const otherId = chat.members.find(m => m !== me?.id);
  if (!otherId) return 'Unknown';
  const other = userStore.getById(otherId);
  return other?.name || 'Unknown';
}
export function getChatAvatar(chat: Chat): { name: string; color: string } {
  if (chat.type === 'group') return { name: (chat.name || 'G')[0].toUpperCase(), color: chat.avatar || '#6366f1' };
  const me = authStore.getCurrentUser();
  const otherId = chat.members.find(m => m !== me?.id);
  const other = otherId ? userStore.getById(otherId) : null;
  return { name: (other?.name || '?')[0].toUpperCase(), color: other?.avatar || '#6366f1' };
}
