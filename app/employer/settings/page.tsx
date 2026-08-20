"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type MockUser } from "@/lib/local-auth";
import { ChangePasswordForm } from "@/components/shared/change-password-form";
import { DangerZone } from "@/components/shared/danger-zone";
import { CompanyProfileForm } from "@/components/employer/company-profile-form";

export default function EmployerSettingsPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an employer account to manage settings.{" "}
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
        Account Settings
      </h1>
      <p className="mt-1 text-slate-600">
        Manage your company profile, password, and account.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Email
          </p>
          <p className="mt-1 text-sm font-medium text-brand-navy">
            {session.email}
          </p>
        </div>

        <CompanyProfileForm session={session} onUpdate={setSession} />
        <ChangePasswordForm email={session.email} />
        <DangerZone email={session.email} />
      </div>
    </div>
  );
}
