"use client";

import { Search, ShieldCheck, UserRound, Wallet, Zap } from "lucide-react";
import { PickerCard } from "@/components/shared/picker-card";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "ID-verified specialists" },
  { icon: Wallet, label: "Direct Wise payments" },
  { icon: Zap, label: "0% agency markup" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy pb-24 pt-16 sm:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="absolute -right-24 top-1/4 h-[30rem] w-[30rem] rounded-full bg-brand-accent/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[20rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            The direct remote work platform
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Where global teams and top</span>
            <span className="block bg-gradient-to-r from-brand-blue via-cyan-300 to-brand-accent bg-clip-text text-transparent">
              Filipino talent connect directly.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-slate-300">
            Employers get verified specialists with zero markup. Remote
            professionals get direct-hire jobs and keep 100% of their
            earnings.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
              >
                <Icon className="h-4 w-4 text-brand-accent" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <PickerCard
            href="/signup?role=employer"
            icon={Search}
            title="Find Talent"
            subtitle="Browse & hire specialists"
          />
          <PickerCard
            href="/signup?role=jobseeker"
            icon={UserRound}
            title="Find a Job"
            subtitle="Create your free profile"
          />
        </div>
      </div>
    </section>
  );
}
