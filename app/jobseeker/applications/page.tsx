"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, FileText, MapPin } from "lucide-react";
import { getSession, type MockUser } from "@/lib/local-auth";
import { MOCK_JOBS } from "@/lib/mock-data";
import { SkillBadge } from "@/components/landing/skill-badge";
import { ComingSoon } from "@/components/jobseeker/coming-soon";

export default function JobApplicationsPage() {
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
          You need an account to track applications.{" "}
          <Link href="/signup?role=jobseeker" className="font-semibold underline">
            Create a free profile
          </Link>
          .
        </div>
      </div>
    );
  }

  const appliedJobs = MOCK_JOBS.filter((job) =>
    session.appliedJobIds?.includes(job.id)
  );

  if (appliedJobs.length === 0) {
    return (
      <ComingSoon
        icon={FileText}
        title="Job Applications"
        description="You haven't applied to any roles yet. Apply from the dashboard and they'll show up here."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Job Applications
      </h1>
      <p className="mt-1 text-slate-600">
        {appliedJobs.length} role{appliedJobs.length === 1 ? "" : "s"} you&rsquo;ve applied to.
      </p>

      <div className="mt-6 space-y-4">
        {appliedJobs.map((job) => (
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
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-brand-accent-dark">
                Applied
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
    </div>
  );
}
