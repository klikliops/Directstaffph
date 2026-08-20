"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Check,
  Flag,
  Lock,
  MapPin,
} from "lucide-react";
import { getJobById } from "@/lib/jobs-store";
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

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [session, setSession] = useState<MockUser | null>(null);
  const [job, setJob] = useState<JobPosting | null | undefined>(undefined);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    setSession(getSession());
    // getJobById() reads localStorage-backed employer postings, which isn't
    // available during SSR -- computing this eagerly could return a
    // different result on the server vs. the client's first paint for
    // employer-created (non-seed) jobs, causing a hydration mismatch.
    setJob(getJobById(jobId));
  }, [jobId]);

  if (job === undefined) {
    return null;
  }

  if (!job) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">Job not found.</p>
        <Link
          href="/jobseeker/jobs"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent-dark hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Job Boards
        </Link>
      </div>
    );
  }

  const applied = Boolean(session?.appliedJobIds?.includes(job.id));
  const bookmarked = Boolean(session?.bookmarkedJobIds?.includes(job.id));
  const locked = isLockedFromApplying(session);

  function handleApply() {
    if (!session || !job) return;
    const updated = applyToJob(session.email, job.id);
    if (updated) setSession(updated);
  }

  function handleToggleBookmark() {
    if (!session || !job) return;
    const updated = toggleBookmark(session.email, job.id);
    if (updated) setSession(updated);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/jobseeker/jobs"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Job Boards
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">
              {job.title}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              <Briefcase className="h-3.5 w-3.5" />
              {job.companyName}
              <span aria-hidden>&middot;</span>
              <MapPin className="h-3.5 w-3.5" />
              {job.isRemote ? "Remote" : "On-site"}
              <span aria-hidden>&middot;</span>
              {job.employmentType}
              <span aria-hidden>&middot;</span>
              {job.category}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {session && (
              <button
                type="button"
                onClick={handleToggleBookmark}
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark this job"}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  bookmarked
                    ? "border-brand-accent bg-cyan-50 text-brand-accent-dark"
                    : "border-slate-200 text-slate-400 hover:text-brand-navy"
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
                onClick={() => setReporting(true)}
                aria-label={`Report ${job.companyName}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:text-red-500"
              >
                <Flag className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-lg font-bold text-brand-navy">
            ${job.monthlySalaryMinUsd.toLocaleString()}&ndash;$
            {job.monthlySalaryMaxUsd.toLocaleString()}
          </span>
          <span className="text-sm text-slate-500">/mo</span>
        </div>

        {job.requiredSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => (
              <SkillBadge key={skill} label={skill} />
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-5">
          <h2 className="text-sm font-semibold text-brand-navy">
            Job Description
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
            {job.description}
          </p>
        </div>

        {locked && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Lock className="h-4 w-4 shrink-0" />
            You&rsquo;re recruited full-time for {session?.recruitedJobTitle}{" "}
            at {session?.recruitedCompanyName}. You can&rsquo;t apply to other
            jobs while full-time recruited.
          </div>
        )}

        <div className="mt-5">
          {!session ? (
            <Link
              href="/signup?role=jobseeker"
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300 sm:w-auto"
            >
              Apply
            </Link>
          ) : applied ? (
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-600">
              <Check className="h-4 w-4" />
              Applied
            </span>
          ) : locked ? (
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
              Unavailable
            </span>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300 sm:w-auto"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {reporting && session && (
        <ReportEmployerModal
          reporterEmail={session.email}
          reporterName={getDisplayName(session)}
          employerEmail={job.postedByEmail}
          companyName={job.companyName}
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setReporting(false)}
        />
      )}
    </div>
  );
}
