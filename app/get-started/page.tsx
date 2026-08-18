import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo-mark";
import { PickerSection } from "@/components/get-started/picker-section";

export const metadata: Metadata = {
  title: "Get Started — DirectStaffPH",
};

export default function GetStartedPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-4xl text-center">
        <Logo gradientId="get-started-logo" className="mx-auto h-16 w-auto" />

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
