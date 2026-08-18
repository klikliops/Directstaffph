"use client";

import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { getAdminPasscode, setAdminPasscode } from "@/lib/admin-auth";

export function ChangePasswordForm() {
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (currentPasscode !== getAdminPasscode()) {
      setError("Current passcode is incorrect.");
      return;
    }
    if (newPasscode.length < 6) {
      setError("New passcode must be at least 6 characters.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setError("New passcodes do not match.");
      return;
    }

    setAdminPasscode(newPasscode);
    setCurrentPasscode("");
    setNewPasscode("");
    setConfirmPasscode("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-brand-accent-dark" />
        <h2 className="text-base font-semibold text-brand-navy">
          Change Admin Passcode
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Current passcode
          </span>
          <input
            type="password"
            value={currentPasscode}
            onChange={(event) => setCurrentPasscode(event.target.value)}
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            New passcode
          </span>
          <input
            type="password"
            value={newPasscode}
            onChange={(event) => setNewPasscode(event.target.value)}
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Confirm new passcode
          </span>
          <input
            type="password"
            value={confirmPasscode}
            onChange={(event) => setConfirmPasscode(event.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          Update passcode
        </button>
        {saved && (
          <span className="text-sm font-medium text-brand-accent-dark">
            Passcode updated
          </span>
        )}
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none";
