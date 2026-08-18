import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { CandidateCard } from "@/components/landing/candidate-card";
import { SearchFilterBar } from "@/components/landing/search-filter-bar";

export default function EmployerTalentPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Browse Talent
      </h1>
      <p className="mt-1 text-slate-600">
        Every profile is ID-verified and scored before it goes live.
      </p>

      <div className="mt-6 max-w-4xl">
        <SearchFilterBar />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CANDIDATES.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
