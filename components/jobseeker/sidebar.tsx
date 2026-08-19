"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  Crown,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import {
  clearSession,
  getDisplayName as getUserDisplayName,
  getSession,
  SESSION_CHANGE_EVENT,
  type MockUser,
} from "@/lib/local-auth";
import { JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";
import { Logo } from "@/components/shared/logo-mark";
import { NotificationsBell } from "@/components/shared/notifications-bell";

const BASE_NAV_ITEMS = [
  { href: "/jobseeker/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobseeker/profile", label: "My Profile", icon: UserRound },
  { href: "/jobseeker/applications", label: "Job Applications", icon: FileText },
  { href: "/jobseeker/bookmarks", label: "Bookmarked Jobs", icon: Bookmark },
  { href: "/jobseeker/settings", label: "Account Settings", icon: Settings },
  { href: "/jobseeker/support", label: "Support", icon: LifeBuoy },
];

const VIP_NAV_ITEM = { href: "/jobseeker/upgrade", label: "Go VIP", icon: Crown };

function getDisplayName(session: MockUser | null): string {
  return getUserDisplayName(session) || "Jobseeker";
}

function getInitials(session: MockUser | null): string {
  if (!session) return "JS";
  const initials = `${session.firstName?.[0] ?? ""}${session.lastName?.[0] ?? ""}`;
  if (initials) return initials.toUpperCase();
  return session.email.slice(0, 2).toUpperCase();
}

export function JobseekerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<MockUser | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  useEffect(() => {
    function handleSessionChange() {
      setSession(getSession());
    }
    window.addEventListener(SESSION_CHANGE_EVENT, handleSessionChange);
    return () =>
      window.removeEventListener(SESSION_CHANGE_EVENT, handleSessionChange);
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex items-center justify-between px-5 pt-5">
        <Link href="/jobseeker/dashboard" className="flex items-center gap-2">
          <Logo gradientId="sidebar-logo" className="h-7 w-auto" />
          <span className="text-base font-semibold tracking-tight text-brand-navy">
            DirectStaff<span className="text-brand-accent-dark">PH</span>
          </span>
        </Link>
        <NotificationsBell email={session?.email ?? null} />
      </div>

      <div className="mt-6 flex items-center gap-3 px-5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
            session?.profilePictureSet
              ? `bg-gradient-to-br ${session.avatarColorFrom} ${session.avatarColorTo}`
              : "bg-slate-300"
          }`}
        >
          {getInitials(session)}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-brand-navy">
            <span className="truncate">{getDisplayName(session)}</span>
            {session?.isVip && (
              <Crown
                className="h-3.5 w-3.5 shrink-0 text-amber-500"
                aria-label="VIP member"
              />
            )}
          </p>
          <p className="text-xs text-slate-400">
            Jobseeker &middot;{" "}
            <span className="font-semibold text-brand-accent-dark">
              {calculatePoints(session, JOBSEEKER_POINT_TASKS)} pts
            </span>
          </p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {(session?.isVip ? BASE_NAV_ITEMS : [...BASE_NAV_ITEMS, VIP_NAV_ITEM]).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isVipLink = item.href === "/jobseeker/upgrade";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cyan-50 text-brand-accent-dark"
                  : isVipLink
                    ? "text-amber-600 hover:bg-amber-50"
                    : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
