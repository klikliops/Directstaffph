// DEMO-ONLY notification store, backed by localStorage. Real-time delivery
// would need a backend (Supabase Realtime, web push, etc.) -- this just
// persists entries per recipient email and fires a same-tab event so open
// tabs update immediately.

export interface UserNotification {
  id: string;
  recipientEmail: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = "directstaffph_notifications";
export const NOTIFICATIONS_CHANGE_EVENT = "directstaffph:notifications-change";

function readAll(): UserNotification[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserNotification[];
  } catch {
    return [];
  }
}

function writeAll(notifications: UserNotification[]) {
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT));
}

export function getNotificationsFor(email: string): UserNotification[] {
  return readAll()
    .filter((n) => n.recipientEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNotification(
  recipientEmail: string,
  title: string,
  message: string
): UserNotification {
  const entry: UserNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    recipientEmail,
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  writeAll([...readAll(), entry]);
  return entry;
}

export function markAllRead(email: string) {
  const all = readAll();
  writeAll(
    all.map((n) =>
      n.recipientEmail.toLowerCase() === email.toLowerCase()
        ? { ...n, read: true }
        : n
    )
  );
}
