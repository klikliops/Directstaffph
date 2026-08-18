import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/jobseeker/coming-soon";

export default function JobApplicationsPage() {
  return (
    <ComingSoon
      icon={FileText}
      title="Job Applications"
      description="Track the roles you've applied to and their status here once applications go live."
    />
  );
}
