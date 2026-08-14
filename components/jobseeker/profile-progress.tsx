import { Check, Circle } from "lucide-react";

export function ProfileProgress({ hasMobileNumber }: { hasMobileNumber: boolean }) {
  const checklist = [
    { label: "Account created", done: true },
    { label: "Mobile number added", done: hasMobileNumber },
    { label: "Add your software skills", done: false },
    { label: "Add a video intro", done: false },
    { label: "Get ID verified", done: false },
  ];

  const completed = checklist.filter((item) => item.done).length;
  const percent = Math.round((completed / checklist.length) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Complete your profile to get discovered
        </h2>
        <span className="text-sm font-semibold text-brand-accent-dark">
          {percent}%
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-5 space-y-3">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm">
            {item.done ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-navy">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-slate-300" />
            )}
            <span className={item.done ? "text-slate-500 line-through" : "text-slate-700"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
