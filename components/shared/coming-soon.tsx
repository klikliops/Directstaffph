import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">{title}</h1>

      <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-brand-accent-dark">
          <Icon className="h-6 w-6" />
        </span>
        <p className="mt-4 text-base font-semibold text-brand-navy">
          Coming soon
        </p>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
