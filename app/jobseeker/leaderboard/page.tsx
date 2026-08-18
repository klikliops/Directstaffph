"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import { getSession, type MockUser } from "@/lib/local-auth";
import { LeaderboardTable } from "@/components/jobseeker/leaderboard-table";

export default function LeaderboardPage() {
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
          You need an account to view the leaderboard.{" "}
          <Link href="/signup?role=jobseeker" className="font-semibold underline">
            Create a free profile
          </Link>
          .
        </div>
      </div>
    );
  }

  if (!session.isVip) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
          Leaderboard
        </h1>

        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-500">
            <Crown className="h-6 w-6" />
          </span>
          <p className="mt-4 text-base font-semibold text-brand-navy">
            VIP members only
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-slate-600">
            See how you rank against other jobseekers and get noticed by top
            employers. Ask DirectStaffPH to upgrade your account to VIP to
            unlock it.
          </p>
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
        <LeaderboardTable currentEmail={session.email} />
      </div>
    </div>
  );
}
