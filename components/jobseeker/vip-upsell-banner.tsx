import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { VIP_PRICE_PHP } from "@/lib/mock-data";
import type { MockUser } from "@/lib/local-auth";

export function VipUpsellBanner({ session }: { session: MockUser | null }) {
  if (session?.isVip) return null;

  return (
    <Link
      href="/jobseeker/upgrade"
      className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition-colors hover:bg-amber-100"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-500">
          <Crown className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-brand-navy">Go VIP</p>
          <p className="text-xs text-slate-600">
            Stand out to employers browsing the leaderboard &mdash; from ₱
            {VIP_PRICE_PHP}/mo.
          </p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-amber-600" />
    </Link>
  );
}
