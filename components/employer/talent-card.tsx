"use client";

import { Briefcase, Crown, FileText, Lock, MessageSquare, ShieldCheck } from "lucide-react";
import { getDisplayName, type MockUser } from "@/lib/local-auth";

function getInitials(user: MockUser): string {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
  return initials ? initials.toUpperCase() : user.email.slice(0, 2).toUpperCase();
}

export function TalentCard({
  jobseeker,
  rank,
  points,
  contactUnlocked,
  onView,
}: {
  jobseeker: MockUser;
  rank: number;
  points: number;
  contactUnlocked: boolean;
  onView: () => void;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
            jobseeker.profilePictureSet
              ? `bg-gradient-to-br ${jobseeker.avatarColorFrom} ${jobseeker.avatarColorTo}`
              : "bg-slate-300"
          }`}
        >
          {getInitials(jobseeker)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-brand-navy">
              {getDisplayName(jobseeker)}
            </h3>
            {jobseeker.isVip && (
              <Crown className="h-4 w-4 shrink-0 text-amber-500" aria-label="VIP member" />
            )}
          </div>
          <p className="truncate text-sm text-slate-500">
            {jobseeker.jobInterest ?? "No role selected"}
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-[11px] font-medium text-brand-accent-dark">
          <ShieldCheck className="h-3.5 w-3.5" />
          #{rank}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {jobseeker.resumeSubmitted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
            <FileText className="h-3 w-3" />
            Resume
          </span>
        )}
        {jobseeker.recruitedJobId && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
            <Briefcase className="h-3 w-3" />
            Employed
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between rounded-lg bg-slate-50 px-3 py-2.5">
        <div>
          <span className="text-sm font-semibold text-brand-navy">{points}</span>
          <span className="text-xs text-slate-500"> pts score</span>
        </div>
      </div>

      <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
        {contactUnlocked ? (
          <div className="text-sm text-slate-600">
            <p className="font-medium text-brand-navy">Contact unlocked</p>
            <p className="text-xs text-slate-500">{jobseeker.email}</p>
          </div>
        ) : (
          <div className="relative select-none">
            <div aria-hidden className="pointer-events-none space-y-1.5 blur-[3px]">
              <p className="text-sm font-medium text-brand-navy">
                {jobseeker.email.replace(/^(.{2}).*(@.*)$/, "$1••••$2")}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-lg bg-white/60 text-xs font-semibold text-brand-navy backdrop-blur-[1px]">
              <Lock className="h-3.5 w-3.5" />
              Contact locked
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onView}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          View Profile &amp; Message
        </button>
      </div>
    </article>
  );
}
