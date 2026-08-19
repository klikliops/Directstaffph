"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { PRICING_PLANS } from "@/lib/mock-data";
import { getSession, upgradeEmployerPlan, type MockUser } from "@/lib/local-auth";
import type { PricingPlanId } from "@/lib/types";

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function EmployerCheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan: planParam } = use(params);
  const [session, setSession] = useState<MockUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    setSession(getSession());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  const plan = PRICING_PLANS.find((p) => p.id === planParam);
  const isPurchasable = plan && plan.id !== "free";

  if (!isPurchasable) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Unknown plan.{" "}
          <Link href="/employer/billing" className="font-semibold underline">
            Back to Plans &amp; Billing
          </Link>
          .
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an employer account to check out.{" "}
          <Link href="/signup?role=employer" className="font-semibold underline">
            Create a free employer account
          </Link>
          .
        </div>
      </div>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session || !plan) return;
    setProcessing(true);
    // Simulated processing delay -- no real card network call happens here.
    window.setTimeout(() => {
      upgradeEmployerPlan(session.email, plan.id as PricingPlanId);
      setProcessing(false);
      setSuccess(true);
    }, 900);
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-brand-navy">
          You&rsquo;re on the {plan.name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Contact info, video intros, and direct messaging are unlocked.
        </p>
        <Link
          href="/employer/dashboard"
          className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/employer/billing"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plans
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-brand-navy sm:text-3xl">
        Checkout
      </h1>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs text-indigo-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <strong>Demo checkout.</strong> This form simulates a Stripe-style
          card payment for international employers &mdash; no real card
          network is contacted and no money moves. Connecting a live Stripe
          account requires a backend to hold secret keys, which this demo
          doesn&rsquo;t have yet.
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{plan.name}</p>
          <p className="text-xs text-slate-500">{plan.billingNote}</p>
        </div>
        <p className="text-xl font-bold text-brand-navy">
          ${plan.priceUsdPerMonth}
          <span className="text-sm font-normal text-slate-500">/mo</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Lock className="h-3.5 w-3.5" />
          Pay with card &middot; powered by Stripe (demo)
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">
            Name on card
          </label>
          <input
            required
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Jane Cooper"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">
            Card number
          </label>
          <input
            required
            inputMode="numeric"
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600">
              Expiry
            </label>
            <input
              required
              inputMode="numeric"
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">CVC</label>
            <input
              required
              inputMode="numeric"
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {processing
            ? "Processing…"
            : `Pay $${plan.priceUsdPerMonth}/mo (Demo)`}
        </button>
      </form>
    </div>
  );
}
