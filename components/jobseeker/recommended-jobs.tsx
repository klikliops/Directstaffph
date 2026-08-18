"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Briefcase, Check, MapPin, Search } from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-data";
import {
  applyToJob,
  getSession,
  toggleBookmark,
  type MockUser,
} from "@/lib/local-auth";
import { SkillBadge } from "@/components/landing/skill-badge";

export function RecommendedJobs() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSession(getSession());
  }, []);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_JOBS;
    return MOCK_JOBS.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.requiredSkills.some((skill) => skill.toLowerCase().includes(q))
    );
  }, [query]);

  function handleApply(jobId: string) {
    if (!session) return;
    const updated = applyToJob(session.username, jobId);
    if (updated) setSession(updated);
  }

  function handleToggleBookmark(jobId: string) {
    if (!session) return;
    const updated = toggleBookmark(session.username, jobId);
    if (updated) setSession(updated);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-brand-navy">
        Popular roles right now
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        A few open roles from employers actively hiring on DirectStaffPH.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by role, company, or skill"
          className="w-full bg-transparent text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="mt-5 space-y-4">
        {filteredJobs.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">
            No roles match &ldquo;{query}&rdquo;.
          </p>
        )}

        {filteredJobs.map((job) => {
          const applied = Boolean(session?.appliedJobIds?.includes(job.id));
          const bookmarked = Boolean(
            session?.bookmarkedJobIds?.includes(job.id)
          );

          return (
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
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-brand-navy">
                    ${job.monthlySalaryMinUsd.toLocaleString()}&ndash;$
                    {job.monthlySalaryMaxUsd.toLocaleString()}/mo
                  </span>
                  {session && (
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(job.id)}
                      aria-label={
                        bookmarked ? "Remove bookmark" : "Bookmark this job"
                      }
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                        bookmarked
                          ? "text-brand-accent-dark"
                          : "text-slate-400 hover:text-brand-navy"
                      }`}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <SkillBadge key={skill} label={skill} />
                  ))}
                </div>

                {session ? (
                  <button
                    type="button"
                    disabled={applied}
                    onClick={() => handleApply(job.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      applied
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-brand-accent text-brand-navy hover:bg-cyan-300"
                    }`}
                  >
                    {applied && <Check className="h-3.5 w-3.5" />}
                    {applied ? "Applied" : "Apply"}
                  </button>
                ) : (
                  <Link
                    href="/signup?role=jobseeker"
                    className="shrink-0 rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
                  >
                    Apply
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
