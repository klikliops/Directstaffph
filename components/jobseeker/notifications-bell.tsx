"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (item) => !readIds.has(item.id)
  ).length;

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

  function handleToggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setReadIds(new Set(MOCK_NOTIFICATIONS.map((item) => item.id)));
      }
      return next;
    });
  }

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
            {MOCK_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-brand-navy">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">{item.timeAgo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
