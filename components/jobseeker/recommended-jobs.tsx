import { Briefcase, MapPin } from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-data";
import { SkillBadge } from "@/components/landing/skill-badge";

export function RecommendedJobs() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-brand-navy">
        Popular roles right now
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        A few open roles from employers actively hiring on DirectStaffPH.
      </p>

      <div className="mt-5 space-y-4">
        {MOCK_JOBS.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-brand-navy">
                  {job.title}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <Briefcase className="h-3 w-3" />
                  {job.companyName}
                  <span aria-hidden>&middot;</span>
                  <MapPin className="h-3 w-3" />
                  {job.isRemote ? "Remote" : "On-site"}
                </p>
              </div>
              <span className="text-sm font-semibold text-brand-navy">
                ${job.monthlySalaryMinUsd.toLocaleString()}&ndash;$
                {job.monthlySalaryMaxUsd.toLocaleString()}/mo
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill) => (
                <SkillBadge key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
