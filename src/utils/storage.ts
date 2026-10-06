// Storage adapter - localStorage ↔ Firebase bridge
// Ye file decide karti hai ki data kahan store hoga
// Firebase config hone pe Firestore use hoga, otherwise localStorage

// BroadcastChannel for cross-tab real-time sync (localStorage mode)
let channel: BroadcastChannel | null = null;
try {
  channel = new BroadcastChannel('praychat-sync');
} catch {
  // Browser doesn't support BroadcastChannel - fallback to storage events
}

type Listener = (key: string, value: any) => void;
const listeners = new Set<Listener>();

// Internal storage events (for same-tab updates)
export function notifyChange(key: string, value: any) {
  listeners.forEach(fn => fn(key, value));
  // Broadcast to other tabs
  channel?.postMessage({ key, value });
}

// Listen for changes from other tabs
if (channel) {
  channel.onmessage = (e) => {
    listeners.forEach(fn => fn(e.data.key, e.data.value));
  };
}

// Also listen to storage events (fallback for older browsers)
window.addEventListener('storage', (e) => {
  if (e.key && e.newValue) {
    try {
      listeners.forEach(fn => fn(e.key!, JSON.parse(e.newValue!)));
    } catch { /* ignore parse errors */ }
  }
});

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Generic get/set for localStorage
export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function storageSet(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange(key, value);
  } catch (e) {
    console.warn('[PrayChat] Storage full or unavailable:', e);
  }
}

export function storageRemove(key: string) {
  localStorage.removeItem(key);
  notifyChange(key, null);
}

// Storage keys
export const KEYS = {
  USER: 'pc_user',
  USERS: 'pc_users',
  CHATS: 'pc_chats',
  MESSAGES: 'pc_msgs',
  STATUSES: 'pc_statuses',
  CALLS: 'pc_calls',
  BLOCKED: 'pc_blocked',
  PRIVACY: 'pc_privacy',
  THEME: 'pc_theme',
  LANG: 'pc_lang',
};
