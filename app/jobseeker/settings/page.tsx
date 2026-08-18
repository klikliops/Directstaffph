import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/jobseeker/coming-soon";

export default function AccountSettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Account Settings"
      description="Manage your password, notifications, and account preferences here."
    />
  );
}
