"use client";

import { useState } from "react";
import { Check, Flame } from "lucide-react";
import { dailyCheckIn, type MockUser } from "@/lib/local-auth";

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DailyCheckIn({
  session,
  onUpdate,
}: {
  session: MockUser;
  onUpdate: (user: MockUser) => void;
}) {
  const [justEarned, setJustEarned] = useState<number | null>(null);
  const checkedInToday = session.lastCheckInDate === localDateKey(new Date());

  function handleCheckIn() {
    const result = dailyCheckIn(session.email);
    if (!result) return;
    onUpdate(result.user);
    if (!result.alreadyCheckedIn) setJustEarned(result.pointsEarned);
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
        <Flame className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-brand-navy">Daily check-in</p>
        <p className="text-xs text-slate-500">
          {session.checkInStreak
            ? `${session.checkInStreak}-day streak`
            : "Check in daily for bonus points"}
          {justEarned ? ` · +${justEarned} pts` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCheckIn}
        disabled={checkedInToday}
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
          checkedInToday
            ? "cursor-not-allowed bg-emerald-50 text-emerald-600"
            : "bg-brand-accent text-brand-navy hover:bg-cyan-300"
        }`}
      >
        {checkedInToday ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Checked in
          </>
        ) : (
          "Check In (+5 pts)"
        )}
      </button>
    </div>
  );
}
