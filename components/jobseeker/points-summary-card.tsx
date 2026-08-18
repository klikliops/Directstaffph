import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MockUser } from "@/lib/local-auth";
import { JOBSEEKER_MAX_POINTS, JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";

export function PointsSummaryCard({ session }: { session: MockUser | null }) {
  const points = calculatePoints(session, JOBSEEKER_POINT_TASKS);
  const percent = Math.round((points / JOBSEEKER_MAX_POINTS) * 100);
  const nextTask = JOBSEEKER_POINT_TASKS.find(
    (task) => !session || !task.done(session)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Profile strength
        </h2>
        <span className="text-sm font-semibold text-brand-accent-dark">
          {points} / {JOBSEEKER_MAX_POINTS} pts
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-600">
        {nextTask
          ? `Complete your profile to get discovered by more employers.`
          : `You've completed every step — nice work.`}
      </p>

      <Link
        href="/jobseeker/profile"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent-dark hover:underline"
      >
        {nextTask ? `Complete your profile` : `View your profile`}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
