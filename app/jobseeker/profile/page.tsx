"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type MockUser } from "@/lib/local-auth";
import { ProfileForm } from "@/components/jobseeker/profile-form";
import { PointsChecklist } from "@/components/jobseeker/points-checklist";
import { StatsRow } from "@/components/jobseeker/stats-row";

export default function JobseekerProfilePage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setCheckedSession(true);
  }, []);

  if (!checkedSession) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an account to edit a profile.{" "}
          <Link href="/signup?role=jobseeker" className="font-semibold underline">
            Create a free profile
          </Link>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        My Profile
      </h1>
      <p className="mt-1 text-slate-600">
        Keep your details up to date so employers can find you.
      </p>

      <div className="mt-8 space-y-6">
        <StatsRow />
        <ProfileForm session={session} onUpdate={setSession} />
        <PointsChecklist session={session} onUpdate={setSession} />
      </div>
    </div>
  );
}
