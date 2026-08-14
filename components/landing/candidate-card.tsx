"use client";

import { useState } from "react";
import { Lock, MapPin, PlayCircle, ShieldCheck } from "lucide-react";
import type { CandidateProfile } from "@/lib/types";
import { SkillBadge } from "./skill-badge";

export function CandidateCard({ candidate }: { candidate: CandidateProfile }) {
  const [showUpsell, setShowUpsell] = useState(false);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${candidate.avatarColorFrom} ${candidate.avatarColorTo} text-sm font-semibold text-white`}
        >
          {candidate.avatarInitials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-brand-navy">
              {candidate.fullName}
            </h3>
            {candidate.idVerified && (
              <ShieldCheck
                className="h-4 w-4 shrink-0 text-brand-accent-dark"
                aria-label="ID verified"
              />
            )}
          </div>
          <p className="truncate text-sm text-slate-500">{candidate.title}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {candidate.location}
          </div>
        </div>

        {candidate.hasVideoIntro && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-[11px] font-medium text-brand-accent-dark">
            <PlayCircle className="h-3.5 w-3.5" />
            Video
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {candidate.bio}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {candidate.softwareSkills.map((skill) => (
          <SkillBadge key={skill} label={skill} />
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between rounded-lg bg-slate-50 px-3 py-2.5">
        <div>
          <span className="text-sm font-semibold text-brand-navy">
            ${candidate.monthlySalaryUsd.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500">/mo</span>
        </div>
        <div className="text-xs text-slate-500">
          ${candidate.hourlyRateUsd}/hr &middot; {candidate.yearsExperience}
          yrs exp
        </div>
      </div>

      <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
        {candidate.isContactUnlocked ? (
          <div className="text-sm text-slate-600">
            <p className="font-medium text-brand-navy">Contact unlocked</p>
            <p className="text-xs text-slate-500">
              hello@{candidate.slug.replace("-", "")}.ph
            </p>
          </div>
        ) : (
          <div className="relative select-none">
            <div
              aria-hidden
              className="pointer-events-none space-y-1.5 blur-[3px]"
            >
              <p className="text-sm font-medium text-brand-navy">
                +63 9•• ••• ••••
              </p>
              <p className="text-xs text-slate-500">
                {candidate.avatarInitials.toLowerCase()}••••@gmail.com
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUpsell((prev) => !prev)}
              className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-lg bg-white/60 text-xs font-semibold text-brand-navy backdrop-blur-[1px] transition-colors hover:bg-white/80"
            >
              <Lock className="h-3.5 w-3.5" />
              Unlock Profile
            </button>
          </div>
        )}

        {!candidate.isContactUnlocked && showUpsell && (
          <div className="mt-3 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs text-brand-navy">
            Unlock contact info, video intros &amp; messaging with a{" "}
            <a href="#pricing" className="font-semibold underline underline-offset-2">
              Business Pass
            </a>
            .
          </div>
        )}
      </div>
    </article>
  );
}
