import Link from "next/link";
import { Plus, Users } from "lucide-react";
import type { JobPosting } from "@/lib/types";

export function MyJobsList({ jobs }: { jobs: JobPosting[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Your job postings
        </h2>
        <Link
          href="/employer/jobs/new"
          className="flex items-center gap-1.5 rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          <Plus className="h-3.5 w-3.5" />
          Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          You haven&rsquo;t posted any jobs yet. Post one to start receiving
          applications.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/employer/jobs/${job.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:border-brand-accent"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-navy">
                    {job.title}
                  </p>
                  <p className="text-xs text-slate-500">{job.employmentType}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-brand-accent-dark">
                  <Users className="h-3.5 w-3.5" />
                  {job.applicantCount} applicant{job.applicantCount === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
