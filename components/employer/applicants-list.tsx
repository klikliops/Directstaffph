"use client";

import { useState } from "react";
import { Check, FileText, Send, UserCheck } from "lucide-react";
import { sendEmployerMessage } from "@/lib/messages-store";
import {
  getDisplayName,
  recruitApplicant,
  type MockUser,
} from "@/lib/local-auth";
import type { JobPosting } from "@/lib/types";

export function ApplicantsList({
  job,
  applicants,
  employerEmail,
}: {
  job: JobPosting;
  applicants: MockUser[];
  employerEmail: string;
}) {
  const [recruitedEmails, setRecruitedEmails] = useState<Set<string>>(
    () => new Set(applicants.filter((a) => a.recruitedJobId === job.id).map((a) => a.email))
  );
  const [messagingEmail, setMessagingEmail] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sentToEmails, setSentToEmails] = useState<Set<string>>(new Set());

  function handleRecruit(applicant: MockUser) {
    recruitApplicant(applicant.email, employerEmail, {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      employmentType: job.employmentType === "Part-time" ? "Part-time" : "Full-time",
    });
    setRecruitedEmails((prev) => new Set(prev).add(applicant.email));
  }

  function handleSendMessage(applicant: MockUser) {
    if (!messageText.trim()) return;
    sendEmployerMessage({
      fromEmail: employerEmail,
      toEmail: applicant.email,
      toName: getDisplayName(applicant),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      body: messageText.trim(),
    });
    setSentToEmails((prev) => new Set(prev).add(applicant.email));
    setMessagingEmail(null);
    setMessageText("");
  }

  if (applicants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No applicants yet. Check back once jobseekers start applying.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => {
        const isRecruitedForThisJob = recruitedEmails.has(applicant.email);
        const isRecruitedElsewhere =
          Boolean(applicant.recruitedJobId) &&
          applicant.recruitedJobId !== job.id &&
          !isRecruitedForThisJob;
        const alreadyMessaged = sentToEmails.has(applicant.email);

        return (
          <div
            key={applicant.email}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  {getDisplayName(applicant)}
                </p>
                <p className="text-xs text-slate-500">{applicant.email}</p>
                {applicant.jobInterest && (
                  <p className="mt-1 text-xs text-slate-500">
                    Interested in: {applicant.jobInterest}
                  </p>
                )}
                {applicant.resumeFileName && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-brand-accent-dark">
                    <FileText className="h-3 w-3" />
                    {applicant.resumeFileName}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMessagingEmail(applicant.email)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-slate-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Message
                  </button>

                  {isRecruitedForThisJob ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                      Recruited
                    </span>
                  ) : isRecruitedElsewhere ? (
                    <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-500">
                      Recruited elsewhere
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRecruit(applicant)}
                      className="flex items-center gap-1.5 rounded-full bg-brand-accent px-3.5 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Recruit
                    </button>
                  )}
                </div>
                {alreadyMessaged && (
                  <span className="text-xs text-slate-400">Message sent</span>
                )}
              </div>
            </div>

            {messagingEmail === applicant.email && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <textarea
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  rows={3}
                  placeholder={`Write a message to ${getDisplayName(applicant)}...`}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendMessage(applicant)}
                    className="rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessagingEmail(null);
                      setMessageText("");
                    }}
                    className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-brand-navy"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
