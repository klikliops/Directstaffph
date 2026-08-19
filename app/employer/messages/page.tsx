"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getSession, type MockUser } from "@/lib/local-auth";
import { getMessagesSentBy, type MessageEntry } from "@/lib/messages-store";
import { ComingSoon } from "@/components/shared/coming-soon";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EmployerMessagesPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const current = getSession();
    setSession(current);
    if (current) setMessages(getMessagesSentBy(current.email));
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an employer account to view messages.{" "}
          <Link href="/signup?role=employer" className="font-semibold underline">
            Create a free employer account
          </Link>
          .
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <ComingSoon
        icon={MessageSquare}
        title="Messages"
        description="Message applicants from a job's applicants page and they'll show up here."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Messages
      </h1>
      <p className="mt-1 text-slate-600">
        {messages.length} message{messages.length === 1 ? "" : "s"} you&rsquo;ve sent to applicants.
      </p>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">
                To {message.toName}
              </p>
              <span className="text-xs text-slate-400">
                {formatDateTime(message.createdAt)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Re: {message.jobTitle}
            </p>
            <p className="mt-2 text-sm text-slate-600">{message.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
