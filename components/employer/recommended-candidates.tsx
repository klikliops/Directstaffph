"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, type MockUser } from "@/lib/local-auth";
import { rankJobseekers } from "@/lib/points";
import { TalentCard } from "@/components/employer/talent-card";
import { JobseekerProfileModal } from "@/components/employer/jobseeker-profile-modal";

export function RecommendedCandidates({
  employer,
  contactUnlocked = false,
}: {
  employer: MockUser | null;
  contactUnlocked?: boolean;
}) {
  const [selected, setSelected] = useState<{ user: MockUser; rank: number } | null>(
    null
  );
  const [topJobseekers, setTopJobseekers] = useState<
    { user: MockUser; points: number; rank: number }[]
  >([]);

  useEffect(() => {
    // getAllUsers() reads localStorage, which isn't available during SSR --
    // computing this eagerly would return different data on the server
    // (empty) vs. the client's first paint, causing a hydration mismatch.
    setTopJobseekers(
      rankJobseekers(getAllUsers())
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 3)
    );
  }, []);

  if (topJobseekers.length === 0) return null;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Recommended for you
        </h2>
        <Link href="/employer/talent" className="text-sm font-medium text-brand-accent-dark hover:underline">
          Browse all talent
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topJobseekers.map(({ user, points, rank }) => (
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

      {selected && employer && (
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
