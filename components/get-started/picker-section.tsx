"use client";

import { Search, UserRound } from "lucide-react";
import { PickerCard } from "@/components/shared/picker-card";

export function PickerSection() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <PickerCard
        href="/signup?role=employer"
        icon={Search}
        title="Find Talent"
        subtitle="Browse & hire specialists"
        size="large"
      />
      <PickerCard
        href="/signup?role=jobseeker"
        icon={UserRound}
        title="Find a Job"
        subtitle="Create your free profile"
        size="large"
      />
    </div>
  );
}
