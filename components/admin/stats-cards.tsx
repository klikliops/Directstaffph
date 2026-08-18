import { Briefcase, Crown, UserRound, Users } from "lucide-react";
import type { MockUser } from "@/lib/local-auth";

export function StatsCards({ users }: { users: MockUser[] }) {
  const jobseekers = users.filter((u) => u.role === "jobseeker").length;
  const employers = users.filter((u) => u.role === "employer").length;
  const vipCount = users.filter((u) => u.isVip).length;

  const stats = [
    { icon: Users, label: "Total Accounts", value: users.length },
    { icon: UserRound, label: "Jobseekers", value: jobseekers },
    { icon: Briefcase, label: "Employers", value: employers },
    { icon: Crown, label: "VIP Members", value: vipCount },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-brand-accent-dark">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold text-brand-navy">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
