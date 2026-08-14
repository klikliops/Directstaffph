import { ArrowRight, ShieldCheck, Wallet, Zap } from "lucide-react";
import { SearchFilterBar } from "./search-filter-bar";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "ID-verified specialists" },
  { icon: Wallet, label: "Direct Wise payments" },
  { icon: Zap, label: "0% placement commission" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy pb-24 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.12),transparent_40%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300">
            Now onboarding EA, video editing & e-commerce ops talent
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hire top-tier Filipino talent,{" "}
            <span className="text-brand-accent">direct — no agency markup.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            DirectStaffPH connects US, UK, AU, and EU founders with verified
            Executive Assistants, Video Editors, E-commerce Ops, Bookkeepers,
            and Media Buyers &mdash; ready to work, vetted, and paid directly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#talent"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300 sm:w-auto"
            >
              Browse Talent
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#pricing"
              className="w-full rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Post a Job
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-slate-400"
              >
                <Icon className="h-4 w-4 text-brand-accent" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <SearchFilterBar />
        </div>
      </div>
    </section>
  );
}
