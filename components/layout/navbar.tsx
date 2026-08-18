import Link from "next/link";
import { LogoMark } from "@/components/shared/logo-mark";

const NAV_LINKS = [
  { label: "Browse Talent", href: "#talent" },
  { label: "How It Works", href: "#value" },
  { label: "Pricing", href: "#pricing" },
  { label: "Get Started", href: "/get-started" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/95 backdrop-blur supports-[backdrop-filter]:bg-brand-navy/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-white">
            DirectStaff<span className="text-brand-accent">PH</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:block"
          >
            Sign In
          </Link>
          <a
            href="#pricing"
            className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
          >
            Post a Job
          </a>
        </div>
      </div>
    </header>
  );
}
