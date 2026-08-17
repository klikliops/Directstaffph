import Link from "next/link";
import { Briefcase } from "lucide-react";
import { AuthCard } from "./auth-card";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-brand-navy px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.1),transparent_40%)]"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-brand-navy">
            <Briefcase className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            DirectStaff<span className="text-brand-accent">PH</span>
          </span>
        </Link>

        <AuthCard title={title} subtitle={subtitle}>
          {children}
        </AuthCard>
      </div>
    </div>
  );
}
