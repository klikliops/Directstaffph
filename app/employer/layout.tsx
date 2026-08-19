"use client";

import { useEffect, useState } from "react";
import { getDisplayName, getSession, type MockUser } from "@/lib/local-auth";
import { EmployerSidebar } from "@/components/employer/sidebar";
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
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 md:flex-row">
      <EmployerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="md:hidden">
          <DashboardTopbar
            displayName={session ? getDisplayName(session) : null}
            email={session?.email ?? null}
            showCrown={Boolean(session?.planId && session.planId !== "free")}
            homeHref="/employer/dashboard"
          />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
