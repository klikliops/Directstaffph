"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/local-auth";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setIsSubmitting(true);
    const result = loginUser(username.trim(), password);

    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.error);
      return;
    }

    router.push(
      result.user.role === "jobseeker" ? "/jobseeker/dashboard" : "/#talent"
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-300">
          Username
        </span>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="e.g. maria.santos"
          className={inputClasses}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-300">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
          className={inputClasses}
        />
      </label>

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
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand-accent hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-brand-navy px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-accent focus:outline-none";
