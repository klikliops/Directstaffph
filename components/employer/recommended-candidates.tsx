import Link from "next/link";
import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { CandidateCard } from "@/components/landing/candidate-card";

export function RecommendedCandidates({
  contactUnlocked = false,
}: {
  contactUnlocked?: boolean;
}) {
  const candidates = MOCK_CANDIDATES.slice(0, 3);

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
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={{ ...candidate, isContactUnlocked: contactUnlocked }}
          />
        ))}
      </div>
    </div>
  );
}
