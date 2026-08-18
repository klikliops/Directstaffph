"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type MockUser } from "@/lib/local-auth";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";
import { StatsRow } from "@/components/employer/stats-row";
import { PlanCard } from "@/components/employer/plan-card";
import { RecommendedCandidates } from "@/components/employer/recommended-candidates";

export default function EmployerDashboardPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setCheckedSession(true);
  }, []);

  if (!checkedSession) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <DashboardTopbar username={session?.username ?? null} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {!session && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You&rsquo;re viewing this page without an account.{" "}
            <Link href="/signup?role=employer" className="font-semibold underline">
              Create a free employer account
            </Link>{" "}
            to save your progress.
          </div>
        )}

        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
          Welcome{session ? `, ${session.username}` : ""}
        </h1>
        <p className="mt-1 text-slate-600">
          Here&rsquo;s what&rsquo;s happening with your hiring.
        </p>

        <div className="mt-8">
          <StatsRow />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <PlanCard />
          </div>
          <div className="lg:col-span-3">
            <RecommendedCandidates />
          </div>
        </div>
      </main>
    </div>
  );
}
