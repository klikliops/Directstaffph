import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { CandidateCard } from "./candidate-card";
import { SearchFilterBar } from "./search-filter-bar";

export function TalentGrid() {
  return (
    <section id="talent" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Featured, verified talent
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every profile is ID-verified and scored before it goes live.
            Contact details, video intros, and messaging unlock with a
            Business Pass or Enterprise Plan.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <SearchFilterBar />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_CANDIDATES.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            View All 500+ Specialists
          </a>
        </div>
      </div>
    </section>
  );
}
