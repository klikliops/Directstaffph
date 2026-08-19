"use client";

import { useState } from "react";
import { Check, Flag, X } from "lucide-react";
import { submitReport } from "@/lib/reports-store";
import { REPORT_REASONS, type ReportReason } from "@/lib/types";

export function ReportEmployerModal({
  reporterEmail,
  reporterName,
  employerEmail,
  companyName,
  jobId,
  jobTitle,
  onClose,
}: {
  reporterEmail: string;
  reporterName: string;
  employerEmail?: string;
  companyName: string;
  jobId?: string;
  jobTitle?: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!reason) return;
    submitReport({
      reporterEmail,
      reporterName,
      employerEmail,
      companyName,
      jobId,
      jobTitle,
      reason,
      details: details.trim(),
    });
    setSubmitted(true);
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
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Flag className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-navy">
                Report {companyName}
              </p>
              {jobTitle && (
                <p className="text-xs text-slate-500">Re: {jobTitle}</p>
              )}
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

        {submitted ? (
          <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-600">
            <Check className="h-4 w-4 shrink-0" />
            Report submitted. Our team will review it.
          </p>
        ) : (
          <>
            <p className="mt-4 text-xs font-medium text-slate-600">
              What happened?
            </p>
            <div className="mt-2 space-y-1.5">
              {REPORT_REASONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    reason === option.id
                      ? "border-brand-accent bg-cyan-50 text-brand-navy"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={option.id}
                    checked={reason === option.id}
                    onChange={() => setReason(option.id)}
                    className="accent-brand-accent-dark"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <label className="mt-4 block text-xs font-medium text-slate-600">
              Additional details (optional)
            </label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={3}
              placeholder="Anything else we should know?"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!reason}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Flag className="h-3.5 w-3.5" />
              Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
