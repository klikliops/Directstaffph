import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { PickerSection } from "@/components/get-started/picker-section";

export const metadata: Metadata = {
  title: "Get Started — DirectStaffPH",
};

export default function GetStartedPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent shadow-lg shadow-cyan-500/30">
          <Briefcase className="h-8 w-8 text-brand-navy" strokeWidth={2.5} />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-navy">
          DirectStaff<span className="text-brand-accent-dark">PH</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Connect directly with verified Filipino talent. Pick how you&rsquo;re joining.
        </p>

        <PickerSection />
      </div>
    </div>
  );
}
