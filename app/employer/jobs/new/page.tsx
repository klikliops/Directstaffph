"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type MockUser } from "@/lib/local-auth";
import { PostJobForm } from "@/components/employer/post-job-form";

export default function PostJobPage() {
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
          You need an employer account to post a job.{" "}
          <Link href="/signup?role=employer" className="font-semibold underline">
            Create a free employer account
          </Link>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Post a Job
      </h1>
      <p className="mt-1 text-slate-600">
        Reach verified Filipino specialists actively looking for direct-hire
        roles.
      </p>

      <div className="mt-8">
        <PostJobForm session={session} />
      </div>
    </div>
  );
}
