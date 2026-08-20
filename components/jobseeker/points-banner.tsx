import { Sparkles } from "lucide-react";
import type { MockUser } from "@/lib/local-auth";
import { calculateTotalScore } from "@/lib/points";

export function PointsBanner({ session }: { session: MockUser | null }) {
  const points = calculateTotalScore(session);

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white py-3 pl-3 pr-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-accent-dark shadow-sm">
        <Sparkles className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
          Your Score
        </p>
        <p className="text-2xl font-extrabold leading-tight text-brand-navy">
          {points} <span className="text-xs font-medium text-slate-400">pts</span>
        </p>
      </div>
    </div>
  );
}
