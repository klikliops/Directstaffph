export function SkillBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-brand-navy">
      {label}
    </span>
  );
}
