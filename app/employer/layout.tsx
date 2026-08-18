"use client";

import { useEffect, useState } from "react";
import { getDisplayName, getSession, type MockUser } from "@/lib/local-auth";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<MockUser | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <DashboardTopbar
        displayName={session ? getDisplayName(session) : null}
        email={session?.email ?? null}
        isVip={session?.isVip}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
