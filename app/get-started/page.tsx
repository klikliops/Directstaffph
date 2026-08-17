import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Search, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Started — DirectStaffPH",
};

export default function GetStartedPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent shadow-lg shadow-cyan-500/30">
          <Briefcase className="h-8 w-8 text-brand-navy" strokeWidth={2.5} />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-navy">
          DirectStaff<span className="text-brand-accent-dark">PH</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Connect directly with verified Filipino talent. Pick how you&rsquo;re joining.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <PickerCard
            href="/#talent"
            icon={Search}
            title="Find Talent"
            subtitle="Browse & hire specialists"
          />
          <PickerCard
            href="/signup?role=jobseeker"
            icon={UserRound}
            title="Find a Job"
            subtitle="Create your free profile"
          />
        </div>
      </div>
    </div>
  );
}

function PickerCard({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href: string;
  icon: typeof Search;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-accent hover:shadow-xl"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-cyan-50">
        <Icon className="h-10 w-10 text-brand-accent-dark" strokeWidth={2} />
      </span>
      <h2 className="mt-6 text-2xl font-bold text-brand-navy">{title}</h2>
      <p className="mt-2 text-base text-slate-500">{subtitle}</p>
    </Link>
  );
}
