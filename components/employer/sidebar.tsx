"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  Crown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Plus,
  Search,
  Settings,
  Trophy,
} from "lucide-react";
import {
  clearSession,
  getDisplayName,
  getSession,
  SESSION_CHANGE_EVENT,
  type MockUser,
} from "@/lib/local-auth";
import { Logo } from "@/components/shared/logo-mark";
import { NotificationsBell } from "@/components/shared/notifications-bell";

const NAV_ITEMS = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/talent", label: "Browse Talent", icon: Search },
  { href: "/employer/jobs/new", label: "Post a Job", icon: Plus },
  { href: "/employer/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/employer/billing", label: "Plans & Billing", icon: CreditCard },
  { href: "/employer/settings", label: "Account Settings", icon: Settings },
  { href: "/employer/support", label: "Support", icon: LifeBuoy },
];

function getInitials(session: MockUser | null): string {
  if (!session) return "EM";
  const initials = `${session.firstName?.[0] ?? ""}${session.lastName?.[0] ?? ""}`;
  if (initials) return initials.toUpperCase();
  return session.email.slice(0, 2).toUpperCase();
}

export function EmployerSidebar() {
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
        <Link href="/employer/dashboard" className="flex items-center gap-2">
          <Logo gradientId="employer-sidebar-logo" className="h-7 w-auto" />
          <span className="text-base font-semibold tracking-tight text-brand-navy">
            DirectStaff<span className="text-brand-accent-dark">PH</span>
          </span>
        </Link>
        <NotificationsBell email={session?.email ?? null} />
      </div>

      <div className="mt-6 flex items-center gap-3 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-300 text-sm font-semibold text-white">
          {getInitials(session)}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-brand-navy">
            <span className="truncate">
              {session ? getDisplayName(session) : "Employer"}
            </span>
            {session?.isVip && (
              <Crown
                className="h-3.5 w-3.5 shrink-0 text-amber-500"
                aria-label="VIP member"
              />
            )}
          </p>
          <p className="text-xs text-slate-400">Employer</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cyan-50 text-brand-accent-dark"
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
