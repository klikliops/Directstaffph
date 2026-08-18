"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSession } from "@/lib/local-auth";
import { Logo } from "@/components/shared/logo-mark";

export function JobseekerTopbar({ username }: { username: string | null }) {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo gradientId="topbar-logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold tracking-tight text-brand-navy">
            DirectStaff<span className="text-brand-accent-dark">PH</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {username && (
            <span className="hidden text-sm font-medium text-slate-600 sm:block">
              {username}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
