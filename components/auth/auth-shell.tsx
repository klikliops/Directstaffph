import Link from "next/link";
import { Logo } from "@/components/shared/logo-mark";
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
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-accent/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Logo gradientId="auth-logo" className="h-8 w-auto" />
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
