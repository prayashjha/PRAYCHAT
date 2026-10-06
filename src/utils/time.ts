// Time formatting utilities - WhatsApp style timestamps
// Sab timestamps UTC milliseconds mein store hote hain

export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatChatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const dayMs = 86400000;

  // Today → show time
  if (diff < dayMs && d.getDate() === now.getDate()) return formatTime(ts);
  // Yesterday
  if (diff < dayMs * 2) return 'Yesterday';
  // Within 7 days → day name
  if (diff < dayMs * 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  // Older → date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export function formatMessageDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const dayMs = 86400000;

  if (diff < dayMs && d.getDate() === now.getDate()) return 'Today';
  if (diff < dayMs * 2) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export function formatLastSeen(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return formatChatDate(ts);
}

// Status 24 hours expire check
export function isStatusExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

// Status expiry = 24 hours from creation
export function getStatusExpiry(createdAt: number): number {
  return createdAt + 86400000;
}

// Call duration formatter
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
