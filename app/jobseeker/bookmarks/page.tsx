"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Briefcase, MapPin } from "lucide-react";
import { getSession, toggleBookmark, type MockUser } from "@/lib/local-auth";
import { MOCK_JOBS } from "@/lib/mock-data";
import { SkillBadge } from "@/components/landing/skill-badge";
import { ComingSoon } from "@/components/jobseeker/coming-soon";

export default function BookmarkedJobsPage() {
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
          You need an account to bookmark jobs.{" "}
          <Link href="/signup?role=jobseeker" className="font-semibold underline">
            Create a free profile
          </Link>
          .
        </div>
      </div>
    );
  }

  const bookmarkedJobs = MOCK_JOBS.filter((job) =>
    session.bookmarkedJobIds?.includes(job.id)
  );

  function handleRemove(jobId: string) {
    if (!session) return;
    const updated = toggleBookmark(session.username, jobId);
    if (updated) setSession(updated);
  }

  if (bookmarkedJobs.length === 0) {
    return (
      <ComingSoon
        icon={Bookmark}
        title="Bookmarked Jobs"
        description="Save roles you're interested in from the dashboard and they'll show up here."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Bookmarked Jobs
      </h1>
      <p className="mt-1 text-slate-600">
        {bookmarkedJobs.length} role{bookmarkedJobs.length === 1 ? "" : "s"} you&rsquo;ve saved.
      </p>

      <div className="mt-6 space-y-4">
        {bookmarkedJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
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
              <button
                type="button"
                onClick={() => handleRemove(job.id)}
                className="flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-brand-accent-dark transition-colors hover:bg-cyan-100"
              >
                <BookmarkCheck className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill) => (
                <SkillBadge key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
