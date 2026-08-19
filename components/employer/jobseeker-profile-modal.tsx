"use client";

import { useState } from "react";
import {
  Briefcase,
  Check,
  Crown,
  FileText,
  Lock,
  Mail,
  Send,
  Trophy,
  X,
} from "lucide-react";
import { getDisplayName, type MockUser } from "@/lib/local-auth";
import { sendEmployerMessage } from "@/lib/messages-store";
import { JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";

function getInitials(user: MockUser): string {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
  return initials ? initials.toUpperCase() : user.email.slice(0, 2).toUpperCase();
}

export function JobseekerProfileModal({
  jobseeker,
  rank,
  contactUnlocked,
  employer,
  onClose,
}: {
  jobseeker: MockUser;
  rank?: number;
  contactUnlocked: boolean;
  employer: MockUser;
  onClose: () => void;
}) {
  const [messageText, setMessageText] = useState("");
  const [sent, setSent] = useState(false);
  const points = calculatePoints(jobseeker, JOBSEEKER_POINT_TASKS);
  const employed = Boolean(jobseeker.recruitedJobId);

  function handleSend() {
    if (!messageText.trim()) return;
    sendEmployerMessage({
      fromEmail: employer.email,
      toEmail: jobseeker.email,
      toName: getDisplayName(jobseeker),
      jobId: "general",
      jobTitle: "your profile",
      companyName: getDisplayName(employer),
      body: messageText.trim(),
    });
    setSent(true);
    setMessageText("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                jobseeker.profilePictureSet
                  ? `bg-gradient-to-br ${jobseeker.avatarColorFrom} ${jobseeker.avatarColorTo}`
                  : "bg-slate-300"
              }`}
            >
              {getInitials(jobseeker)}
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
                {getDisplayName(jobseeker)}
                {jobseeker.isVip && (
                  <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
              </p>
              <p className="text-xs text-slate-500">
                {jobseeker.jobInterest ?? "No role selected"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-brand-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-brand-accent-dark">
            <Trophy className="h-3 w-3" />
            {points} pts{rank ? ` · #${rank} on leaderboard` : ""}
          </span>
          {employed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              <Briefcase className="h-3 w-3" />
              {jobseeker.recruitedEmploymentType === "Full-time"
                ? "Full Time Employed"
                : "Part Time Employed"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              Available
            </span>
          )}
          {jobseeker.resumeSubmitted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              <FileText className="h-3 w-3" />
              Resume on file
            </span>
          )}
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          {contactUnlocked ? (
            <p className="flex items-center gap-1.5 text-sm text-brand-navy">
              <Mail className="h-3.5 w-3.5 shrink-0 text-brand-accent-dark" />
              {jobseeker.email}
            </p>
          ) : (
            <div className="relative select-none">
              <p className="pointer-events-none text-sm text-brand-navy blur-[3px]">
                {jobseeker.email.replace(/^(.{2}).*(@.*)$/, "$1••••$2")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-navy">
                <Lock className="h-3.5 w-3.5" />
                Unlock contact info with a Business Pass
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-600">
            Send a message
          </label>
          {sent ? (
            <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-600">
              <Check className="h-4 w-4 shrink-0" />
              Message sent to {getDisplayName(jobseeker)}.
            </p>
          ) : (
            <>
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                rows={3}
                placeholder={`Write a message to ${getDisplayName(jobseeker)}...`}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="mt-2 flex items-center gap-1.5 rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
