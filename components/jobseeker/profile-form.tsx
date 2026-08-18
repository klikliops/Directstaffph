"use client";

import { useState, type FormEvent } from "react";
import { CANDIDATE_CATEGORIES } from "@/lib/types";
import { updateProfile, type MockUser } from "@/lib/local-auth";

export function ProfileForm({
  session,
  onUpdate,
}: {
  session: MockUser;
  onUpdate: (user: MockUser) => void;
}) {
  const [firstName, setFirstName] = useState(session.firstName ?? "");
  const [lastName, setLastName] = useState(session.lastName ?? "");
  const [jobInterest, setJobInterest] = useState(session.jobInterest ?? "");
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const updated = updateProfile(session.email, {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      jobInterest: jobInterest || undefined,
    });
    if (updated) {
      onUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h2 className="text-base font-semibold text-brand-navy">
        Basic information
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Your name and role help employers know who they&rsquo;re talking to.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            First Name
          </span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Maria"
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Last Name
          </span>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Santos"
            className={inputClasses}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-slate-600">
          Job Interest / Role
        </span>
        <select
          value={jobInterest}
          onChange={(event) => setJobInterest(event.target.value)}
          className={inputClasses}
        >
          <option value="">Select a role</option>
          {CANDIDATE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          Save changes
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

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none";
