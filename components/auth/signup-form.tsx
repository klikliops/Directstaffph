"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, UserRound } from "lucide-react";
import { registerUser, type UserRole } from "@/lib/local-auth";

export function SignupForm({
  initialRole,
  showRoleToggle = true,
  onSuccess,
}: {
  initialRole: UserRole;
  showRoleToggle?: boolean;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (role === "jobseeker" && mobileNumber.trim().length < 7) {
      setError("Enter a valid mobile number.");
      return;
    }

    setIsSubmitting(true);
    const result = registerUser({
      username: username.trim(),
      password,
      role,
      mobileNumber: role === "jobseeker" ? mobileNumber.trim() : undefined,
    });

    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.error);
      return;
    }

    onSuccess?.();
    router.push(
      role === "jobseeker" ? "/jobseeker/profile" : "/employer/dashboard"
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {showRoleToggle && (
        <div
          role="tablist"
          aria-label="Sign up as..."
          className="flex rounded-full border border-white/10 bg-brand-navy p-1"
        >
          <RoleTab
            icon={Briefcase}
            label="Employer"
            isActive={role === "employer"}
            onClick={() => setRole("employer")}
          />
          <RoleTab
            icon={UserRound}
            label="Jobseeker"
            isActive={role === "jobseeker"}
            onClick={() => setRole("jobseeker")}
          />
        </div>
      )}

      <Field label="Username">
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="e.g. maria.santos"
          className={inputClasses}
        />
      </Field>

      <Field label="Create Password">
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className={inputClasses}
        />
      </Field>

      <Field label="Confirm Password">
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          className={inputClasses}
        />
      </Field>

      {role === "jobseeker" && (
        <Field label="Mobile Number">
          <input
            type="tel"
            autoComplete="tel"
            value={mobileNumber}
            onChange={(event) => setMobileNumber(event.target.value)}
            placeholder="+63 9XX XXX XXXX"
            className={inputClasses}
          />
        </Field>
      )}

      {error && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300 disabled:opacity-60"
      >
        {isSubmitting
          ? "Creating account..."
          : role === "jobseeker"
            ? "Create Your Free Profile"
            : "Create Employer Account"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-brand-navy px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-accent focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function RoleTab({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: typeof Briefcase;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-brand-accent text-brand-navy"
          : "text-slate-300 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
