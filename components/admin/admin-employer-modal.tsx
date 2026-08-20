"use client";

import { useEffect, useState } from "react";
import { Briefcase, Building2, Check, Send, Trash2, X } from "lucide-react";
import { getAllUsers, getDisplayName, type MockUser } from "@/lib/local-auth";
import { deleteJob, getJobsByEmployer } from "@/lib/jobs-store";
import { sendMockEmail } from "@/lib/admin-emails";
import type { JobPosting } from "@/lib/types";

export function AdminEmployerModal({
  employerEmail,
  onClose,
}: {
  employerEmail: string;
  onClose: () => void;
}) {
  const [employer, setEmployer] = useState<MockUser | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const found = getAllUsers().find(
      (u) => u.email.toLowerCase() === employerEmail.toLowerCase()
    );
    setEmployer(found ?? null);
    setJobs(getJobsByEmployer(employerEmail));
  }, [employerEmail]);

  function handleDeleteJob(job: JobPosting) {
    if (!window.confirm(`Delete "${job.title}"? This can't be undone.`)) return;
    if (deleteJob(job.id, employerEmail)) {
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    }
  }

  function handleSend() {
    if (!subject.trim() || !message.trim()) return;
    sendMockEmail("employer", subject.trim(), message.trim(), [employerEmail]);
    setSent(true);
    setSubject("");
    setMessage("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-brand-accent-dark">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-navy">
                {employer?.companyName || (employer ? getDisplayName(employer) : employerEmail)}
              </p>
              <p className="text-xs text-slate-500">{employerEmail}</p>
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

        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Briefcase className="h-3.5 w-3.5" />
            Job postings ({jobs.length})
          </p>

          {jobs.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No jobs posted.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-navy">
                      {job.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {job.employmentType} &middot; {job.applicantCount} applicant
                      {job.applicantCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job)}
                    aria-label={`Delete ${job.title}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Message this employer
          </p>
          {sent ? (
            <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-600">
              <Check className="h-4 w-4 shrink-0" />
              Message sent to {employerEmail}.
            </p>
          ) : (
            <>
              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
              />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                placeholder="Write a message..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!subject.trim() || !message.trim()}
                className="mt-2 flex items-center gap-1.5 rounded-full bg-brand-navy px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
