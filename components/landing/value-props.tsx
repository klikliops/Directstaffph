import { BadgeCheck, MessageSquareOff, PhilippinePeso, Wallet } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: PhilippinePeso,
    title: "0% placement commission",
    description:
      "Traditional agencies take 20-50% markups on salary, forever. We charge a flat monthly fee to employers — talent keeps 100% of their pay.",
  },
  {
    icon: Wallet,
    title: "Direct Wise payments",
    description:
      "Pay your hire directly through Wise. No agency payroll, no processing cuts, no delayed payouts sitting in someone else's account.",
  },
  {
    icon: BadgeCheck,
    title: "Verified ID & trust scores",
    description:
      "Every profile passes ID verification and a composite trust score built from work history, references, and platform activity.",
  },
  {
    icon: MessageSquareOff,
    title: "No clunky legacy UI",
    description:
      "Search, filter, and message in a fast, modern interface built for how you actually hire — not a 2008-era job board.",
  },
];

export function ValueProps() {
  return (
    <section id="value" className="relative overflow-hidden bg-white py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-0 h-[24rem] w-[24rem] rounded-full bg-brand-accent/[0.05] blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-brand-blue/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Why founders switch from agencies
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            DirectStaffPH removes the markup, the middlemen, and the wait.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy to-brand-blue text-brand-accent shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-brand-navy">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
