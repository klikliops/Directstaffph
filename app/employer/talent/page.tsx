"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  getAllUsers,
  getDisplayName,
  getSession,
  SESSION_CHANGE_EVENT,
  type MockUser,
} from "@/lib/local-auth";
import { rankJobseekers } from "@/lib/points";
import { CANDIDATE_CATEGORIES } from "@/lib/types";
import { TalentCard } from "@/components/employer/talent-card";
import { JobseekerProfileModal } from "@/components/employer/jobseeker-profile-modal";

export default function EmployerTalentPage() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selected, setSelected] = useState<{ user: MockUser; rank: number } | null>(
    null
  );

  const [ranked, setRanked] = useState<
    { user: MockUser; points: number; rank: number }[]
  >([]);

  useEffect(() => {
    setSession(getSession());
    // getAllUsers() reads localStorage, which doesn't exist during SSR --
    // computing this in useMemo would return different data on the server
    // (empty) vs. the client's first paint, causing a hydration mismatch.
    // Deferring to an effect keeps the first client render in sync with SSR.
    setRanked(
      rankJobseekers(getAllUsers()).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))
    );
    function handleSessionChange() {
      setSession(getSession());
    }
    window.addEventListener(SESSION_CHANGE_EVENT, handleSessionChange);
    return () =>
      window.removeEventListener(SESSION_CHANGE_EVENT, handleSessionChange);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter(({ user }) => {
      const matchesCategory =
        categoryFilter === "All" || user.jobInterest === categoryFilter;
      const matchesQuery =
        !q ||
        getDisplayName(user).toLowerCase().includes(q) ||
        (user.jobInterest ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [ranked, query, categoryFilter]);

  const contactUnlocked = Boolean(session?.planId && session.planId !== "free");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Browse Talent
      </h1>
      <p className="mt-1 text-slate-600">
        Real jobseekers on DirectStaffPH, ranked by profile score.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or role"
            className="w-full bg-transparent text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-brand-navy focus:border-brand-accent focus:outline-none sm:py-2.5"
        >
          <option value="All">All roles</option>
          {CANDIDATE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          No jobseekers match your filters yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ user, points, rank }) => (
            <TalentCard
              key={user.email}
              jobseeker={user}
              rank={rank}
              points={points}
              contactUnlocked={contactUnlocked}
              onView={() => setSelected({ user, rank })}
            />
          ))}
        </div>
      )}

      {selected && session && (
        <JobseekerProfileModal
          jobseeker={selected.user}
          rank={selected.rank}
          contactUnlocked={contactUnlocked}
          employer={session}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
