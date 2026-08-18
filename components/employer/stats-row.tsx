import { Briefcase, Eye, Unlock } from "lucide-react";

const STATS = [
  { icon: Eye, label: "Candidates Viewed", value: 0 },
  { icon: Unlock, label: "Profiles Unlocked", value: 0 },
  { icon: Briefcase, label: "Active Job Posts", value: 0 },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map(({ icon: Icon, label, value }) => (
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
