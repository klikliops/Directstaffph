"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotificationsFor,
  markAllRead,
  NOTIFICATIONS_CHANGE_EVENT,
  type UserNotification,
} from "@/lib/notifications-store";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsBell({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function refresh() {
      if (email) setNotifications(getNotificationsFor(email));
    }
    refresh();
    window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, refresh);
  }, [email]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleToggle() {
    const next = !open;
    setOpen(next);
    // Side effect (dispatches NOTIFICATIONS_CHANGE_EVENT, which triggers
    // setState in every mounted NotificationsBell) must run outside the
    // setOpen updater -- React invokes that updater during render, and
    // triggering another component's setState mid-render throws.
    if (next && email) markAllRead(email);
  }

  if (!email) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-brand-navy"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-accent-dark ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          <p className="px-3 py-2 text-sm font-semibold text-brand-navy">
            Notifications
          </p>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-slate-400">
                No notifications yet.
              </p>
            )}
            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-brand-navy">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {timeAgo(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
