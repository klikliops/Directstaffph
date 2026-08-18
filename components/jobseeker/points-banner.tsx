import { Sparkles } from "lucide-react";
import type { MockUser } from "@/lib/local-auth";
import { JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";

export function PointsBanner({ session }: { session: MockUser | null }) {
  const points = calculatePoints(session, JOBSEEKER_POINT_TASKS);

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white px-6 py-10 text-center">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
        <Sparkles className="h-4 w-4" />
        Your Score
      </span>
      <p className="text-6xl font-extrabold tracking-tight text-brand-navy sm:text-7xl">
        {points}
      </p>
      <p className="max-w-sm text-sm text-slate-600">
        Complete tasks, get points, and be noticed by companies.
      </p>
    </div>
  );
}
