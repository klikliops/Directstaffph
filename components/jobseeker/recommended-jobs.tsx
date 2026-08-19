"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
  Lock,
  MapPin,
  Search,
} from "lucide-react";
import { getAllJobs } from "@/lib/jobs-store";
import {
  applyToJob,
  getDisplayName,
  getSession,
  isLockedFromApplying,
  toggleBookmark,
  type MockUser,
} from "@/lib/local-auth";
import type { JobPosting } from "@/lib/types";
import { SkillBadge } from "@/components/landing/skill-badge";
import { ReportEmployerModal } from "@/components/jobseeker/report-employer-modal";

export function RecommendedJobs() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<JobPosting | null>(null);

  useEffect(() => {
    setSession(getSession());
    // getAllJobs() reads localStorage, which isn't available during SSR --
    // computing this eagerly would return different data on the server
    // (just the static seed jobs) vs. the client's first paint (seed jobs
    // plus any real employer postings), causing a hydration mismatch.
    setJobs(getAllJobs());
  }, []);

  const filteredJobs = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.requiredSkills.some((skill) => skill.toLowerCase().includes(q))
    );
  })();

  const locked = isLockedFromApplying(session);

  function handleApply(jobId: string) {
    if (!session) return;
    const updated = applyToJob(session.email, jobId);
    if (updated) setSession(updated);
  }

  function handleToggleBookmark(jobId: string) {
    if (!session) return;
    const updated = toggleBookmark(session.email, jobId);
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

      {locked && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Lock className="h-4 w-4 shrink-0" />
          You&rsquo;re recruited full-time for {session?.recruitedJobTitle} at{" "}
          {session?.recruitedCompanyName}. You can&rsquo;t apply to other jobs
          while full-time recruited.
        </div>
      )}

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
          const expanded = expandedJobId === job.id;

          return (
            <div
              key={job.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedJobId(expanded ? null : job.id)}
                  className="flex-1 text-left"
                >
                  <h3 className="flex items-center gap-1 text-sm font-semibold text-brand-navy">
                    {job.title}
                    {expanded ? (
                      <ChevronUp className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    )}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Briefcase className="h-3 w-3" />
                    {job.companyName}
                    <span aria-hidden>&middot;</span>
                    <MapPin className="h-3 w-3" />
                    {job.isRemote ? "Remote" : "On-site"}
                  </p>
                </button>
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
                  {session && (
                    <button
                      type="button"
                      onClick={() => setReportTarget(job)}
                      aria-label={`Report ${job.companyName}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-red-500"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {expanded && (
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {job.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <SkillBadge key={skill} label={skill} />
                  ))}
                </div>

                {!session ? (
                  <Link
                    href="/signup?role=jobseeker"
                    className="shrink-0 rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
                  >
                    Apply
                  </Link>
                ) : applied ? (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    Applied
                  </span>
                ) : locked ? (
                  <span className="shrink-0 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-400">
                    Unavailable
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApply(job.id)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {reportTarget && session && (
        <ReportEmployerModal
          reporterEmail={session.email}
          reporterName={getDisplayName(session)}
          employerEmail={reportTarget.postedByEmail}
          companyName={reportTarget.companyName}
          jobId={reportTarget.id}
          jobTitle={reportTarget.title}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}
