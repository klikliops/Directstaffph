import { Bookmark } from "lucide-react";
import { ComingSoon } from "@/components/jobseeker/coming-soon";

export default function BookmarkedJobsPage() {
  return (
    <ComingSoon
      icon={Bookmark}
      title="Bookmarked Jobs"
      description="Save roles you're interested in and come back to them here."
    />
  );
}
