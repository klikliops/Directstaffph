import type { Metadata } from "next";
import { LogoMark } from "@/components/shared/logo-mark";
import { PickerSection } from "@/components/get-started/picker-section";

export const metadata: Metadata = {
  title: "Get Started — DirectStaffPH",
};

export default function GetStartedPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto w-fit shadow-lg shadow-cyan-500/30 rounded-2xl">
          <LogoMark tileClassName="h-16 w-16 rounded-2xl" iconClassName="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-navy">
          DirectStaff<span className="text-brand-accent-dark">PH</span>
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-400">
          Direct-Hire Remote Talent Marketplace
        </p>
        <p className="mt-3 text-lg text-slate-500">
          Connect directly with verified Filipino talent. Pick how you&rsquo;re joining.
        </p>

        <PickerSection />
      </div>
    </div>
  );
}
