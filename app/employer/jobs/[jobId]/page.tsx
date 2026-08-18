"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllUsers, getSession, type MockUser } from "@/lib/local-auth";
import { getJobById } from "@/lib/jobs-store";
import type { JobPosting } from "@/lib/types";
import { SkillBadge } from "@/components/landing/skill-badge";
import { ApplicantsList } from "@/components/employer/applicants-list";

export default function JobApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [session, setSession] = useState<MockUser | null>(null);
  const [job, setJob] = useState<JobPosting | null>(null);
  const [applicants, setApplicants] = useState<MockUser[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setJob(getJobById(jobId));
    const users = getAllUsers();
    setApplicants(
      users.filter(
        (u) => u.role === "jobseeker" && u.appliedJobIds?.includes(jobId)
      )
    );
    setChecked(true);
  }, [jobId]);

  if (!checked) {
    return null;
  }

  if (!job) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">Job not found.</p>
      </div>
    );
  }

  if (!session || job.postedByEmail !== session.email) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You don&rsquo;t have access to this job posting.
        </div>
      </div>
    );
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

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-brand-navy">{job.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {job.companyName} &middot; {job.employmentType} &middot;{" "}
              {job.category}
            </p>
          </div>
          <span className="text-sm font-semibold text-brand-navy">
            ${job.monthlySalaryMinUsd.toLocaleString()}&ndash;$
            {job.monthlySalaryMaxUsd.toLocaleString()}/mo
          </span>
        </div>

        {job.requiredSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => (
              <SkillBadge key={skill} label={skill} />
            ))}
          </div>
        )}

        <p className="mt-3 text-sm text-slate-600">{job.description}</p>
      </div>

      <h2 className="mt-8 text-base font-semibold text-brand-navy">
        Applicants ({applicants.length})
      </h2>
      <div className="mt-4">
        <ApplicantsList job={job} applicants={applicants} employerEmail={session.email} />
      </div>
    </div>
  );
}
