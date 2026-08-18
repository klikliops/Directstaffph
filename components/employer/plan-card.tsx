import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const FREE_FEATURES = [
  "Unlimited talent search & filtering",
  "Post unlimited job listings",
];

export function PlanCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Your plan
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          Free
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {FREE_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent-dark" />
            {feature}
          </li>
        ))}
      </ul>

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
    </div>
  );
}
