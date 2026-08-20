"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type MockUser } from "@/lib/local-auth";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ContactSupportForm } from "@/components/shared/contact-support-form";

const FAQ_ITEMS = [
  {
    question: "How do I unlock candidate contact info?",
    answer:
      "Contact details, video intros, and direct messaging unlock with a Business Pass or Enterprise Plan. Upgrade anytime from Plans & Billing.",
  },
  {
    question: "How do I post a job?",
    answer:
      "Use Post a Job in the sidebar. Posting and browsing the talent pool is always free -- you only pay when you're ready to unlock contact info.",
  },
  {
    question: "What's the difference between Business Pass and Enterprise Plan?",
    answer:
      "Business Pass unlocks contact info, video intros, and messaging for one hiring manager. Enterprise Plan adds up to 5 team seats, priority shortlisting, and a dedicated hiring concierge.",
  },
  {
    question: "How does the leaderboard work?",
    answer:
      "The leaderboard ranks real jobseekers by profile score, available to Business Pass and Enterprise employers. Click any jobseeker to view their profile and message them.",
  },
  {
    question: "How do I recruit an applicant?",
    answer:
      "Open a job posting's applicants list and hit Recruit. Full-time recruitment marks them as hired and locks them from applying elsewhere; part-time doesn't.",
  },
];

export default function EmployerSupportPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Support
      </h1>
      <p className="mt-1 text-slate-600">
        Answers to common questions, or reach out to our team directly.
      </p>

      <div className="mt-8">
        <FaqAccordion items={FAQ_ITEMS} />
      </div>

      <div className="mt-6">
        {session ? (
          <ContactSupportForm session={session} />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Link href="/signup?role=employer" className="font-semibold underline">
              Create a free employer account
            </Link>{" "}
            to message our support team.
          </div>
        )}
      </div>
    </div>
  );
}
