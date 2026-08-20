"use client";

import { useState, type FormEvent } from "react";
import { Building2 } from "lucide-react";
import { updateProfile, type MockUser } from "@/lib/local-auth";

export function CompanyProfileForm({
  session,
  onUpdate,
}: {
  session: MockUser;
  onUpdate: (user: MockUser) => void;
}) {
  const [companyName, setCompanyName] = useState(session.companyName ?? "");
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const updated = updateProfile(session.email, {
      companyName: companyName.trim(),
    });
    if (updated) onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-brand-accent-dark" />
        <h2 className="text-base font-semibold text-brand-navy">
          Company Profile
        </h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Shown to jobseekers when you message them from the talent page or
        leaderboard.
      </p>

      <label className="mt-4 block max-w-sm">
        <span className="mb-1.5 block text-sm font-medium text-slate-600">
          Company name
        </span>
        <input
          type="text"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder="e.g. Northbound Apparel Co."
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          Save
        </button>
        {saved && (
          <span className="text-sm font-medium text-brand-accent-dark">
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
