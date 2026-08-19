import { RecommendedJobs } from "@/components/jobseeker/recommended-jobs";

export default function JobBoardsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Job Boards
      </h1>
      <p className="mt-1 text-slate-600">
        Search every open role on DirectStaffPH and apply directly.
      </p>

      <div className="mt-6">
        <RecommendedJobs />
      </div>
    </div>
  );
}
