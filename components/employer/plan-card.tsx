import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { PlanId } from "@/lib/local-auth";

const PLAN_NAMES: Record<PlanId, string> = {
  free: "Free",
  business: "Business Pass",
  enterprise: "Enterprise Plan",
};

const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: ["Unlimited talent search & filtering", "Post unlimited job listings"],
  business: [
    "Unlimited talent search & filtering",
    "Post unlimited job listings",
    "Unlock candidate contact info",
    "Watch full video introductions",
    "Direct in-app messaging",
  ],
  enterprise: [
    "Everything in Business Pass",
    "Up to 5 team seats",
    "Priority candidate shortlisting",
    "Dedicated hiring concierge",
  ],
};

export function PlanCard({ planId = "free" }: { planId?: PlanId }) {
  const isPaid = planId !== "free";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Your plan
        </h2>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPaid
              ? "bg-cyan-50 text-brand-accent-dark"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {isPaid && <Sparkles className="h-3 w-3" />}
          {PLAN_NAMES[planId]}
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {PLAN_FEATURES[planId].map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent-dark" />
            {feature}
          </li>
        ))}
      </ul>

      {isPaid ? (
        <div className="mt-5 rounded-xl bg-cyan-50 p-4">
          <p className="text-sm font-medium text-brand-navy">
            You&rsquo;re on the {PLAN_NAMES[planId]}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Contact info, video intros, and direct messaging are unlocked.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-brand-navy">
            Unlock contact info & video intros
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Upgrade to a Business Pass to message candidates directly.
          </p>
          <Link
            href="/employer/billing"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent-dark hover:underline"
          >
            View plans
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
