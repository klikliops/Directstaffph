export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-brand-navy-light p-8 shadow-2xl shadow-black/40">
      <h1 className="text-center text-2xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-center text-sm text-slate-400">{subtitle}</p>

      <div className="mt-8">{children}</div>
    </div>
  );
}
