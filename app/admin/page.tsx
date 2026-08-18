"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { getAllUsers, type MockUser } from "@/lib/local-auth";
import { clearAdminSession, hasAdminSession } from "@/lib/admin-auth";
import { PasscodeGate } from "@/components/admin/passcode-gate";
import { StatsCards } from "@/components/admin/stats-cards";
import { UsersTable } from "@/components/admin/users-table";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { BroadcastEmailForm } from "@/components/admin/broadcast-email-form";

type Tab = "accounts" | "settings";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checkedGate, setCheckedGate] = useState(false);
  const [users, setUsers] = useState<MockUser[]>([]);
  const [tab, setTab] = useState<Tab>("accounts");

  useEffect(() => {
    setUnlocked(hasAdminSession());
    setCheckedGate(true);
  }, []);

  useEffect(() => {
    if (unlocked) setUsers(getAllUsers());
  }, [unlocked]);

  if (!checkedGate) {
    return null;
  }

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-brand-accent">
              <Shield className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-brand-navy">
              Admin
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              clearAdminSession();
              setUnlocked(false);
            }}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-slate-600">
          Monitor accounts, manage VIP status, and site settings.
        </p>

        <div className="mt-6 flex gap-2 border-b border-slate-200">
          {(
            [
              { id: "accounts", label: "Accounts" },
              { id: "settings", label: "Settings" },
            ] as { id: Tab; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "border-brand-accent text-brand-navy"
                  : "border-transparent text-slate-500 hover:text-brand-navy"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "accounts" && (
          <>
            <div className="mt-6">
              <StatsCards users={users} />
            </div>
            <div className="mt-6">
              <UsersTable users={users} onChange={setUsers} />
            </div>
          </>
        )}

        {tab === "settings" && (
          <div className="mt-6 space-y-6">
            <ChangePasswordForm />
            <BroadcastEmailForm users={users} />
          </div>
        )}
      </main>
    </div>
  );
}
