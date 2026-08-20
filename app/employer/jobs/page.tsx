"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Users } from "lucide-react";
import { getAllUsers, getSession, type MockUser } from "@/lib/local-auth";
import { deleteJob, getJobsByEmployer } from "@/lib/jobs-store";
import type { JobPosting } from "@/lib/types";

export default function EmployerJobsPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const current = getSession();
    setSession(current);
    setChecked(true);

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

  if (!checked) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an employer account to view your job postings.{" "}
          <Link href="/signup?role=employer" className="font-semibold underline">
            Create a free employer account
          </Link>
          .
        </div>
      </div>
    );
  }

  function handleDelete(job: JobPosting) {
    if (!session) return;
    if (!window.confirm(`Delete "${job.title}"? This can't be undone.`)) return;
    if (deleteJob(job.id, session.email)) {
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/employer/dashboard"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to dashboard
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            Your Job Postings
          </h1>
          <p className="mt-1 text-slate-600">
            {jobs.length} job{jobs.length === 1 ? "" : "s"} posted.
          </p>
        </div>
        <Link
          href="/employer/jobs/new"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          <Plus className="h-3.5 w-3.5" />
          Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">
          You haven&rsquo;t posted any jobs yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <Link href={`/employer/jobs/${job.id}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-navy hover:underline">
                  {job.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {job.employmentType} &middot; {job.category}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-brand-accent-dark">
                  <Users className="h-3.5 w-3.5" />
                  {job.applicantCount} applicant{job.applicantCount === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(job)}
                  aria-label={`Delete ${job.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
