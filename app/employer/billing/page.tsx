"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CreditCard } from "lucide-react";
import { PRICING_PLANS } from "@/lib/mock-data";
import { getSession, type MockUser } from "@/lib/local-auth";

export default function EmployerBillingPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  const currentPlanId = session?.planId ?? "free";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Plans &amp; Billing
      </h1>
      <p className="mt-1 text-slate-600">
        You&rsquo;re currently on the{" "}
        <span className="font-semibold text-brand-navy">
          {PRICING_PLANS.find((p) => p.id === currentPlanId)?.name ?? "Free"}
        </span>{" "}
        plan. Upgrade to unlock contact info, video intros, and direct
        messaging.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
        International checkout via card (Stripe-style demo). No real charge
        is made &mdash; this is a demo flow until a live Stripe account is
        connected.
      </div>

      {!session && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an employer account to upgrade.{" "}
          <Link href="/signup?role=employer" className="font-semibold underline">
            Create a free employer account
          </Link>
          .
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.isMostPopular
                  ? "border-brand-accent bg-cyan-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.isMostPopular && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-navy">
                  Most Popular
                </span>
              )}

              <h2 className="text-lg font-semibold text-brand-navy">
                {plan.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-brand-navy">
                  ${plan.priceUsdPerMonth}
                </span>
                <span className="text-sm text-slate-500">
                  /{plan.billingNote.split(",")[0]}
                </span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent-dark" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {isCurrent ? (
                  <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600">
                    Current Plan
                  </span>
                ) : plan.id === "free" ? (
                  <span className="block text-center text-xs text-slate-500">
                    Downgrades aren&rsquo;t self-serve yet &mdash; contact us.
                  </span>
                ) : session ? (
                  <Link
                    href={`/employer/billing/checkout/${plan.id}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {plan.ctaLabel}
                  </Link>
                ) : (
                  <Link
                    href="/signup?role=employer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Sign up to upgrade
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
