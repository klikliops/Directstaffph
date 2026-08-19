"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import type { MockUser } from "@/lib/local-auth";
import {
  getEmailLog,
  sendMockEmail,
  type EmailAudience,
  type EmailLogEntry,
} from "@/lib/admin-emails";

const AUDIENCE_OPTIONS: { value: EmailAudience; label: string }[] = [
  { value: "all", label: "All Users" },
  { value: "jobseeker", label: "Jobseekers" },
  { value: "employer", label: "Employers (Clients)" },
];

function getRecipients(users: MockUser[], audience: EmailAudience): MockUser[] {
  if (audience === "all") return users;
  return users.filter((u) => u.role === audience);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BroadcastEmailForm({ users }: { users: MockUser[] }) {
  const [audience, setAudience] = useState<EmailAudience>("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<EmailLogEntry[]>(() => getEmailLog());
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const recipients = getRecipients(users, audience);
  const recipientCount = recipients.length;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const entry = sendMockEmail(
      audience,
      subject.trim(),
      message.trim(),
      recipients.map((r) => r.email)
    );
    setLog(getEmailLog());
    setSubject("");
    setMessage("");
    setConfirmation(
      `Queued to ${entry.recipientCount} recipient${entry.recipientCount === 1 ? "" : "s"}.`
    );
    setTimeout(() => setConfirmation(null), 3000);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-brand-accent-dark" />
          <h2 className="text-base font-semibold text-brand-navy">
            Send Email
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Demo only &mdash; no email service is connected, so this logs the
          send below instead of actually delivering anything.
        </p>

        <div className="mt-4">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Audience
          </span>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAudience(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  audience === option.value
                    ? "bg-brand-accent text-brand-navy"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {recipientCount} recipient{recipientCount === 1 ? "" : "s"}
          </p>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="e.g. New features on DirectStaffPH"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Message
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder="Write your message..."
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
          />
        </label>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
          >
            <Send className="h-3.5 w-3.5" />
            Send
          </button>
          {confirmation && (
            <span className="text-sm font-medium text-brand-accent-dark">
              {confirmation}
            </span>
          )}
        </div>
      </form>

      {log.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-brand-navy">
            Send history
          </h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {log.map((entry) => (
              <li key={entry.id} className="py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-brand-navy">
                    {entry.subject}
                  </p>
                  <span className="text-xs text-slate-400">
                    {formatDateTime(entry.sentAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {entry.audience === "all"
                    ? "All Users"
                    : entry.audience === "jobseeker"
                      ? "Jobseekers"
                      : "Employers"}{" "}
                  &middot; {entry.recipientCount} recipient
                  {entry.recipientCount === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
