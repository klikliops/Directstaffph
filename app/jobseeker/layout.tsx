"use client";

import { useEffect, useState } from "react";
import { getSession, type MockUser } from "@/lib/local-auth";
import { JobseekerSidebar } from "@/components/jobseeker/sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";

export default function JobseekerLayout({
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
      <JobseekerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="md:hidden">
          <DashboardTopbar
            username={session?.username ?? null}
            isVip={session?.isVip}
          />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
