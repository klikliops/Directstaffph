import Link from "next/link";
import { Logo } from "@/components/shared/logo-mark";

const FOOTER_COLUMNS = [
  {
    heading: "Employers",
    links: [
      { label: "Browse Talent", href: "#talent" },
      { label: "Post a Job", href: "#pricing" },
      { label: "Pricing", href: "#pricing" },
      { label: "How It Works", href: "#value" },
    ],
  },
  {
    heading: "Talent",
    links: [
      { label: "Create a Profile", href: "/signup?role=jobseeker" },
      { label: "Browse Jobs", href: "#" },
      { label: "Get Verified", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Trust & Safety", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy">
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-1">
              <Logo gradientId="footer-logo" className="h-8 w-auto" />
              <span className="text-lg font-semibold tracking-tight text-white">
                DirectStaff<span className="text-brand-accent">PH</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              The direct-hire marketplace for specialized, verified Filipino
              remote talent. No agencies. No markups. No middlemen.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} DirectStaffPH. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300">
              Terms
            </a>
            <a href="#" className="hover:text-slate-300">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
