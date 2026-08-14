import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import type { UserRole } from "@/lib/local-auth";

export const metadata: Metadata = {
  title: "Create Your Account — DirectStaffPH",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialRole: UserRole = params.role === "employer" ? "employer" : "jobseeker";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to join. No commitment, no credit card."
    >
      <SignupForm initialRole={initialRole} />
    </AuthShell>
  );
}
