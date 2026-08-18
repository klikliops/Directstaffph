"use client";

import { useMemo, useState } from "react";
import { Crown, Trophy } from "lucide-react";
import { getAllUsers, getDisplayName, type MockUser } from "@/lib/local-auth";
import { CANDIDATE_CATEGORIES } from "@/lib/types";
import { JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";

function getInitials(user: MockUser): string {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
  return initials ? initials.toUpperCase() : user.email.slice(0, 2).toUpperCase();
}

export function LeaderboardTable({ currentEmail }: { currentEmail: string }) {
  const [roleFilter, setRoleFilter] = useState("All");

  const ranked = useMemo(() => {
    return getAllUsers()
      .filter((u) => u.role === "jobseeker")
      .filter((u) => roleFilter === "All" || u.jobInterest === roleFilter)
      .map((u) => ({ user: u, points: calculatePoints(u, JOBSEEKER_POINT_TASKS) }))
      .sort((a, b) => b.points - a.points);
  }, [roleFilter]);

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
          {ranked.map(({ user, points }, index) => {
            const isCurrentUser =
              user.email.toLowerCase() === currentEmail.toLowerCase();
            return (
              <li
                key={user.email}
                className={`flex items-center gap-3 py-3 ${isCurrentUser ? "rounded-xl bg-cyan-50 px-3" : ""}`}
              >
                <span className="w-6 shrink-0 text-center text-sm font-bold text-slate-400">
                  {index + 1}
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
                    {isCurrentUser && (
                      <span className="text-xs font-normal text-brand-accent-dark">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.jobInterest ?? "No role selected"}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-brand-navy">
                  {points} pts
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
