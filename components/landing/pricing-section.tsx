import Link from "next/link";
import { Check } from "lucide-react";
import { PRICING_PLANS } from "@/lib/mock-data";

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-brand-navy py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-blue/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-brand-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple pricing for employers
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Browsing and posting jobs is always free. Pay only when you're
            ready to talk to candidates.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.isMostPopular
                  ? "border-brand-accent bg-gradient-to-b from-white/[0.09] to-white/[0.02] shadow-xl shadow-cyan-500/20 ring-1 ring-brand-accent/30"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.isMostPopular && (
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-navy">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-white">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  ${plan.priceUsdPerMonth}
                </span>
                <span className="text-sm text-slate-400">
                  /{plan.billingNote.split(",")[0]}
                </span>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?role=employer"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  plan.isMostPopular
                    ? "bg-brand-accent text-brand-navy hover:bg-cyan-300"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
