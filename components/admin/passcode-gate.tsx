"use client";

import { useState, type FormEvent } from "react";
import { Shield } from "lucide-react";
import { setAdminSession, verifyAdminPasscode } from "@/lib/admin-auth";

export function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!verifyAdminPasscode(passcode)) {
      setError("Incorrect passcode.");
      return;
    }
    setAdminSession();
    onUnlock();
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy text-brand-accent">
          <Shield className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-center text-xl font-bold text-brand-navy">
          Admin Access
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Enter the admin passcode to continue.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Passcode
          </span>
          <input
            type="password"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
            autoFocus
          />
        </label>

        {error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
