import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { MockUser } from "@/lib/local-auth";
import { JOBSEEKER_MAX_POINTS, JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";

export function PointsBanner({ session }: { session: MockUser | null }) {
  const points = calculatePoints(session, JOBSEEKER_POINT_TASKS);

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-accent-dark">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-brand-navy">
            {points} / {JOBSEEKER_MAX_POINTS} pts
          </p>
          <p className="text-sm text-slate-600">
            Complete tasks, get points, and be noticed by companies.
          </p>
        </div>
      </div>

      <Link
        href="/jobseeker/profile"
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
      >
        Complete your profile
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
