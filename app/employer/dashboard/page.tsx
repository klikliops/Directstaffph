"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, getDisplayName, getSession, type MockUser } from "@/lib/local-auth";
import { getJobsByEmployer } from "@/lib/jobs-store";
import { StatsRow } from "@/components/employer/stats-row";
import { PlanCard } from "@/components/employer/plan-card";
import { MyJobsList } from "@/components/employer/my-jobs-list";
import { RecommendedCandidates } from "@/components/employer/recommended-candidates";
import type { JobPosting } from "@/lib/types";

export default function EmployerDashboardPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checkedSession, setCheckedSession] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const current = getSession();
    setSession(current);
    setCheckedSession(true);

    if (current) {
      const users = getAllUsers();
      const myJobs = getJobsByEmployer(current.email).map((job) => ({
        ...job,
        applicantCount: users.filter(
          (u) => u.role === "jobseeker" && u.appliedJobIds?.includes(job.id)
        ).length,
      }));
      setJobs(myJobs);
    }
  }, []);

  if (!checkedSession) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
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
        Welcome{session ? `, ${getDisplayName(session)}` : ""}
      </h1>
      <p className="mt-1 text-slate-600">
        Here&rsquo;s what&rsquo;s happening with your hiring.
      </p>

      <div className="mt-8">
        <StatsRow activeJobPosts={jobs.length} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PlanCard />
        </div>
        <div className="lg:col-span-3">
          <MyJobsList jobs={jobs} />
        </div>
      </div>

      <div className="mt-6">
        <RecommendedCandidates />
      </div>
    </div>
  );
}
