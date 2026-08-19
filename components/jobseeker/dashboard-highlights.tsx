"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Trophy } from "lucide-react";
import { getAllUsers, type MockUser } from "@/lib/local-auth";
import { getAllJobs } from "@/lib/jobs-store";
import { rankJobseekers } from "@/lib/points";
import type { JobPosting } from "@/lib/types";
import { SkillBadge } from "@/components/landing/skill-badge";

export function DashboardHighlights({ session }: { session: MockUser | null }) {
  const [rank, setRank] = useState<number | null>(null);
  const [totalRanked, setTotalRanked] = useState(0);
  const [featuredJobs, setFeaturedJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    // getAllUsers()/getAllJobs() read localStorage, which isn't available
    // during SSR -- computing this eagerly would return different data on
    // the server (empty) vs. the client's first paint, causing a hydration
    // mismatch. Deferring to an effect keeps the first client render in
    // sync with SSR.
    const ranked = rankJobseekers(getAllUsers());
    const rankIndex = session
      ? ranked.findIndex((entry) => entry.user.email === session.email)
      : -1;
    setRank(rankIndex === -1 ? null : rankIndex + 1);
    setTotalRanked(ranked.length);

    const allJobs = getAllJobs();
    const matching = session?.jobInterest
      ? allJobs.filter((job) => job.category === session.jobInterest)
      : [];
    const rest = allJobs.filter((job) => !matching.includes(job));
    setFeaturedJobs([...matching, ...rest].slice(0, 3));
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold text-brand-navy">
              {rank ? `#${rank}` : "—"}
              {rank && (
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  of {totalRanked}
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500">Leaderboard position</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-brand-accent-dark">
            <Briefcase className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {session?.recruitedJobId ? (
              <>
                <p className="truncate text-base font-bold text-brand-navy">
                  {session.recruitedCompanyName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {session.recruitedEmploymentType} &middot; {session.recruitedJobTitle}
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-brand-navy">Open to work</p>
                <p className="text-xs text-slate-500">Not currently employed</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-brand-navy">
            Featured jobs for you
          </h2>
          <Link
            href="/jobseeker/jobs"
            className="text-sm font-medium text-brand-accent-dark hover:underline"
          >
            Browse Job Boards
          </Link>
        </div>

        {featuredJobs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No open roles right now &mdash; check back soon.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-brand-navy">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Briefcase className="h-3 w-3" />
                      {job.companyName}
                      <span aria-hidden>&middot;</span>
                      <MapPin className="h-3 w-3" />
                      {job.isRemote ? "Remote" : "On-site"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-navy">
                    ${job.monthlySalaryMinUsd.toLocaleString()}&ndash;$
                    {job.monthlySalaryMaxUsd.toLocaleString()}/mo
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <SkillBadge key={skill} label={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
