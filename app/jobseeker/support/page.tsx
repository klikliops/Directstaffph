"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type MockUser } from "@/lib/local-auth";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ContactSupportForm } from "@/components/shared/contact-support-form";

const FAQ_ITEMS = [
  {
    question: "How do I get discovered by employers?",
    answer:
      "Complete your profile: add your full name, pick a job interest, upload a profile picture, and submit your resume. Each of these boosts your score, and higher scores rank you higher on the employer leaderboard.",
  },
  {
    question: "What does the leaderboard score mean?",
    answer:
      "Your score reflects how complete your profile is. Business Pass and Enterprise employers can browse the leaderboard to find top-scoring jobseekers and message them directly.",
  },
  {
    question: "How do I apply to a job?",
    answer:
      "Browse open roles from Job Boards in the sidebar, click a listing to read the full description, and hit Apply. You can also bookmark jobs to apply later.",
  },
  {
    question: "Can I apply to other jobs after being recruited?",
    answer:
      "If you're recruited full-time, you're marked as hired and can't apply elsewhere until you remove your employment status from your dashboard. Part-time recruitment doesn't lock you out.",
  },
  {
    question: "What is VIP and how do I get it?",
    answer:
      "VIP gives you a crown badge and featured placement on the employer leaderboard. Upgrade anytime from the Go VIP link in the sidebar.",
  },
  {
    question: "How do I report an employer?",
    answer:
      "Open any job listing and tap the flag icon to file a report with a specific reason. Our team reviews every report.",
  },
];

export default function SupportPage() {
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
            <Link href="/signup?role=jobseeker" className="font-semibold underline">
              Create a free profile
            </Link>{" "}
            to message our support team.
          </div>
        )}
      </div>
    </div>
  );
}
