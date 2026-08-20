"use client";

import { useState, type FormEvent } from "react";
import { Check, LifeBuoy } from "lucide-react";
import { getDisplayName, type MockUser } from "@/lib/local-auth";
import { submitSupportTicket } from "@/lib/support-store";

export function ContactSupportForm({ session }: { session: MockUser }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    submitSupportTicket({
      email: session.email,
      name: getDisplayName(session),
      role: session.role,
      subject: subject.trim(),
      message: message.trim(),
    });
    setSent(true);
    setSubject("");
    setMessage("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-4 w-4 text-brand-accent-dark" />
        <h2 className="text-base font-semibold text-brand-navy">
          Still need help?
        </h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Send us a message and the DirectStaffPH team will get back to you.
      </p>

      {sent ? (
        <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-600">
          <Check className="h-4 w-4 shrink-0" />
          Message sent. We&rsquo;ll follow up at {session.email}.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">
              Subject
            </span>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="What's this about?"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">
              Message
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Tell us what's going on..."
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-accent focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
