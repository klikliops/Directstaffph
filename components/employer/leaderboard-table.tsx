"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Crown, Trophy } from "lucide-react";
import { getAllUsers, getDisplayName, type MockUser } from "@/lib/local-auth";
import { CANDIDATE_CATEGORIES } from "@/lib/types";
import { rankJobseekers } from "@/lib/points";
import { JobseekerProfileModal } from "./jobseeker-profile-modal";

function getInitials(user: MockUser): string {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
  return initials ? initials.toUpperCase() : user.email.slice(0, 2).toUpperCase();
}

export function LeaderboardTable({
  employer,
  contactUnlocked,
}: {
  employer: MockUser;
  contactUnlocked: boolean;
}) {
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState<{ user: MockUser; rank: number } | null>(
    null
  );
  const [allRanked, setAllRanked] = useState<
    { user: MockUser; points: number; rank: number }[]
  >([]);

  useEffect(() => {
    // getAllUsers() reads localStorage, which isn't available during SSR --
    // computing this eagerly would return different data on the server
    // (empty) vs. the client's first paint, causing a hydration mismatch.
    setAllRanked(
      rankJobseekers(getAllUsers()).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))
    );
  }, []);

  const ranked = useMemo(
    () =>
      allRanked.filter(
        ({ user }) => roleFilter === "All" || user.jobInterest === roleFilter
      ),
    [allRanked, roleFilter]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-semibold text-brand-navy">
            Top Jobseekers
          </h2>
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none"
        >
          <option value="All">All roles</option>
          {CANDIDATE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {ranked.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-500">
          No jobseekers match this filter yet.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100">
          {ranked.map(({ user, points, rank }) => (
            <li key={user.email}>
              <button
                type="button"
                onClick={() => setSelected({ user, rank })}
                className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <span className="w-6 shrink-0 text-center text-sm font-bold text-slate-400">
                  {rank}
                </span>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                    user.profilePictureSet
                      ? `bg-gradient-to-br ${user.avatarColorFrom} ${user.avatarColorTo}`
                      : "bg-slate-300"
                  }`}
                >
                  {getInitials(user)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-brand-navy">
                    {getDisplayName(user)}
                    {user.isVip && (
                      <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.jobInterest ?? "No role selected"}
                  </p>
                </div>
                {user.recruitedJobId ? (
                  <span className="hidden shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 sm:inline-flex">
                    <Briefcase className="h-3 w-3" />
                    {user.recruitedEmploymentType === "Full-time"
                      ? "Full Time Employed"
                      : "Part Time Employed"}
                  </span>
                ) : (
                  <span className="hidden shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 sm:inline-flex">
                    Available
                  </span>
                )}
                <span className="shrink-0 text-sm font-bold text-brand-navy">
                  {points} pts
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <JobseekerProfileModal
          jobseeker={selected.user}
          rank={selected.rank}
          contactUnlocked={contactUnlocked}
          employer={employer}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
