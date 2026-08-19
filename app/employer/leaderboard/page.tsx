"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getSession, type MockUser } from "@/lib/local-auth";
import { LeaderboardTable } from "@/components/employer/leaderboard-table";

export default function EmployerLeaderboardPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an employer account to view the leaderboard.{" "}
          <Link href="/signup?role=employer" className="font-semibold underline">
            Create a free employer account
          </Link>
          .
        </div>
      </div>
    );
  }

  const planId = session.planId ?? "free";

  if (planId === "free") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
          Leaderboard
        </h1>

        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-accent-dark">
            <Lock className="h-6 w-6" />
          </span>
          <p className="mt-4 text-base font-semibold text-brand-navy">
            Business Pass or Enterprise Plan required
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-slate-600">
            See the top-scoring jobseekers on the platform and get a head
            start on recruiting them.
          </p>
          <Link
            href="/employer/billing"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Leaderboard
      </h1>
      <p className="mt-1 text-slate-600">
        The top-scoring jobseekers on DirectStaffPH, ranked by profile
        completion.
      </p>

      <div className="mt-8">
        <LeaderboardTable employer={session} contactUnlocked />
      </div>
    </div>
  );
}
