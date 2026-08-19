"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Crown, ShieldCheck, Wallet } from "lucide-react";
import { VIP_FEATURES, VIP_PRICE_PHP } from "@/lib/mock-data";
import { getSession, upgradeJobseekerVip, type MockUser } from "@/lib/local-auth";

type PaymentMethod = "gcash" | "maya";

const METHODS: { id: PaymentMethod; label: string; accent: string }[] = [
  { id: "gcash", label: "GCash", accent: "border-sky-400 bg-sky-50 text-sky-700" },
  { id: "maya", label: "Maya", accent: "border-emerald-400 bg-emerald-50 text-emerald-700" },
];

export default function JobseekerUpgradePage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("gcash");
  const [mobileNumber, setMobileNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need a jobseeker account to upgrade.{" "}
          <Link href="/signup?role=jobseeker" className="font-semibold underline">
            Create a free profile
          </Link>
          .
        </div>
      </div>
    );
  }

  if (session.isVip || success) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-brand-navy">
          You&rsquo;re a VIP member
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your crown badge is live and you&rsquo;ll stand out on the employer
          leaderboard.
        </p>
        <Link
          href="/jobseeker/dashboard"
          className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session) return;
    setProcessing(true);
    // Simulated processing delay -- no real e-wallet API call happens here.
    window.setTimeout(() => {
      upgradeJobseekerVip(session.email);
      setProcessing(false);
      setSuccess(true);
    }, 900);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <Crown className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
          Go VIP
        </h1>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        A local Philippines perk for jobseekers &mdash; pay with your GCash
        or Maya wallet.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs text-indigo-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <strong>Demo checkout.</strong> This simulates a GCash/Maya wallet
          payment &mdash; no real e-wallet is contacted and no money moves.
          Connecting real payments needs a PH payment processor (e.g.
          PayMongo or Xendit) and a backend to hold its secret keys.
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-navy">VIP Membership</p>
          <p className="text-xl font-bold text-brand-navy">
            ₱{VIP_PRICE_PHP}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </p>
        </div>
        <ul className="mt-4 space-y-2">
          {VIP_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Wallet className="h-3.5 w-3.5" />
          Pay with e-wallet (demo)
        </div>

        <div className="grid grid-cols-2 gap-3">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                method === m.id ? m.accent : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">
            {method === "gcash" ? "GCash" : "Maya"} mobile number
          </label>
          <input
            required
            inputMode="numeric"
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="09XX XXX XXXX"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {processing ? "Processing…" : `Pay ₱${VIP_PRICE_PHP} via ${method === "gcash" ? "GCash" : "Maya"} (Demo)`}
        </button>
      </form>
    </div>
  );
}
