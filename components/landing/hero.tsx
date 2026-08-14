"use client";

import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  UserRound,
  Wallet,
  Zap,
} from "lucide-react";
import { SearchFilterBar } from "./search-filter-bar";

type Persona = "employer" | "talent";

const PERSONA_CONTENT: Record<
  Persona,
  {
    eyebrow: string;
    headlineLead: string;
    headlineHighlight: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    trustBadges: { icon: typeof ShieldCheck; label: string }[];
  }
> = {
  employer: {
    eyebrow: "Now onboarding EA, video editing & e-commerce ops talent",
    headlineLead: "Hire top-tier Filipino talent,",
    headlineHighlight: "direct — no agency markup.",
    body: "Verified Executive Assistants, Video Editors, E-commerce Ops, Bookkeepers, and Media Buyers — ready to work, paid directly.",
    primaryCta: { label: "Browse Talent", href: "#talent" },
    secondaryCta: { label: "Post a Job", href: "#pricing" },
    trustBadges: [
      { icon: ShieldCheck, label: "ID-verified specialists" },
      { icon: Wallet, label: "Direct Wise payments" },
      { icon: Zap, label: "0% placement commission" },
    ],
  },
  talent: {
    eyebrow: "500+ Filipino specialists hired directly",
    headlineLead: "Get hired directly by employers abroad,",
    headlineHighlight: "keep 100% of your pay.",
    body: "Build a free profile with your skills and a video intro, and get discovered by employers in the US, UK, AU, and EU.",
    primaryCta: { label: "Create Your Profile", href: "#" },
    secondaryCta: { label: "See How It Works", href: "#value" },
    trustBadges: [
      { icon: ShieldCheck, label: "Free, verified profile" },
      { icon: Wallet, label: "Paid directly via Wise" },
      { icon: Zap, label: "You keep 100% of your rate" },
    ],
  },
};

const TALENT_HIGHLIGHTS = [
  "List your software skills and get matched to relevant roles",
  "Add a short video intro so employers see the real you",
  "Get paid directly — no agency ever touches your rate",
];

export function Hero() {
  const [persona, setPersona] = useState<Persona>("employer");
  const content = PERSONA_CONTENT[persona];

  return (
    <section className="relative overflow-hidden bg-brand-navy pb-24 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.12),transparent_40%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div
            role="tablist"
            aria-label="I am a..."
            className="mx-auto inline-flex rounded-full border border-white/10 bg-white/5 p-1"
          >
            <PersonaTab
              icon={Briefcase}
              label="I'm Hiring"
              isActive={persona === "employer"}
              onClick={() => setPersona("employer")}
            />
            <PersonaTab
              icon={UserRound}
              label="I'm Looking for Work"
              isActive={persona === "talent"}
              onClick={() => setPersona("talent")}
            />
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {content.eyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">{content.headlineLead}</span>
            <span className="block text-brand-accent">
              {content.headlineHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-slate-300">
            {content.body}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={content.primaryCta.href}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300 sm:w-auto"
            >
              {content.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={content.secondaryCta.href}
              className="w-full rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              {content.secondaryCta.label}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {content.trustBadges.map(({ icon: Icon, label }) => (
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

        <div className="mx-auto mt-12 max-w-4xl">
          {persona === "employer" ? (
            <SearchFilterBar />
          ) : (
            <TalentCtaPanel />
          )}
        </div>
      </div>
    </section>
  );
}

function PersonaTab({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: typeof Briefcase;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-brand-accent text-brand-navy"
          : "text-slate-300 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function TalentCtaPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Ready to get discovered?
          </h2>
          <ul className="mt-4 space-y-2.5">
            {TALENT_HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          Create Your Free Profile
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
