"use client";

import { useState } from "react";
import { Search, ShieldCheck, UserRound, Wallet, Zap } from "lucide-react";
import { PickerCard } from "@/components/shared/picker-card";
import { Modal } from "@/components/ui/modal";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "ID-verified specialists" },
  { icon: Wallet, label: "Direct Wise payments" },
  { icon: Zap, label: "0% agency markup" },
];

export function Hero() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <section className="relative overflow-hidden bg-brand-navy pb-24 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.12),transparent_40%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            The direct-hire marketplace for Filipino remote talent
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Hire top-tier talent,</span>
            <span className="block text-brand-accent">direct — no markup.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-slate-300">
            Verified specialists ready to work, paid directly — or get hired
            directly and keep 100% of your pay. Pick how you&rsquo;re joining.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <PickerCard
            href="#talent"
            icon={Search}
            title="Find Talent"
            subtitle="Browse & hire specialists"
          />
          <PickerCard
            onClick={() => setShowSignup(true)}
            icon={UserRound}
            title="Find a Job"
            subtitle="Create your free profile"
          />
        </div>
      </div>

      <Modal open={showSignup} onClose={() => setShowSignup(false)}>
        <AuthCard
          title="Create your free profile"
          subtitle="Free to join. No commitment, no credit card."
        >
          <SignupForm initialRole="jobseeker" showRoleToggle={false} />
        </AuthCard>
      </Modal>
    </section>
  );
}
