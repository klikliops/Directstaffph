"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { clearSession, deleteUserAccount } from "@/lib/local-auth";

export function DangerZone({ email }: { email: string }) {
  const router = useRouter();

  function handleDelete() {
    if (
      !window.confirm(
        "Delete your account? This removes your profile and can't be undone."
      )
    ) {
      return;
    }
    deleteUserAccount(email);
    clearSession();
    router.push("/");
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <h2 className="text-base font-semibold text-brand-navy">
          Danger Zone
        </h2>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Deleting your account permanently removes your profile and can&rsquo;t
        be undone.
      </p>
      <button
        type="button"
        onClick={handleDelete}
        className="mt-4 flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete Account
      </button>
    </div>
  );
}
