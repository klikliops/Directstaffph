"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDisplayName, getSession, type MockUser } from "@/lib/local-auth";
import { PointsBanner } from "@/components/jobseeker/points-banner";
import { DashboardHighlights } from "@/components/jobseeker/dashboard-highlights";
import { VipUpsellBanner } from "@/components/jobseeker/vip-upsell-banner";
import { DailyCheckIn } from "@/components/jobseeker/daily-checkin";

export default function JobseekerDashboardPage() {
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
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {!session && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You&rsquo;re viewing this page without an account.{" "}
          <Link href="/signup?role=jobseeker" className="font-semibold underline">
            Create a free profile
          </Link>{" "}
          to save your progress.
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            Welcome{session ? `, ${getDisplayName(session)}` : ""}
          </h1>
          <p className="mt-1 text-slate-600">
            Here&rsquo;s what&rsquo;s happening with your profile.
          </p>
        </div>
        <PointsBanner session={session} />
      </div>

      <div className="mt-6">
        <VipUpsellBanner session={session} />
      </div>

      {session && (
        <div className="mt-6">
          <DailyCheckIn session={session} onUpdate={setSession} />
        </div>
      )}

      <div className="mt-6">
        <DashboardHighlights session={session} onSessionUpdate={setSession} />
      </div>
    </div>
  );
}
