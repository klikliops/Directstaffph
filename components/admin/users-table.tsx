"use client";

import { useMemo, useState } from "react";
import { Crown, Eye, Search, Trash2 } from "lucide-react";
import {
  deleteUserAccount,
  getDisplayName,
  setEmployerPlan,
  setVipStatus,
  type MockUser,
  type PlanId,
  type UserRole,
} from "@/lib/local-auth";
import { AdminEmployerModal } from "./admin-employer-modal";

const PLAN_LABELS: Record<PlanId, string> = {
  free: "Free",
  business: "Business Pass",
  enterprise: "Enterprise Plan",
};

type RoleFilter = "all" | UserRole;

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UsersTable({
  users,
  onChange,
}: {
  users: MockUser[];
  onChange: (users: MockUser[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [viewingEmployer, setViewingEmployer] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesQuery =
        !q ||
        user.email.toLowerCase().includes(q) ||
        getDisplayName(user).toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, query, roleFilter]);

  function handleToggleVip(email: string, current: boolean) {
    setVipStatus(email, !current);
    onChange(
      users.map((u) => (u.email === email ? { ...u, isVip: !current } : u))
    );
  }

  function handlePlanChange(email: string, planId: PlanId) {
    setEmployerPlan(email, planId);
    onChange(users.map((u) => (u.email === email ? { ...u, planId } : u)));
  }

  function handleDelete(email: string) {
    if (!window.confirm(`Delete account "${email}"? This can't be undone.`)) {
      return;
    }
    deleteUserAccount(email);
    onChange(users.filter((u) => u.email !== email));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-brand-navy">Accounts</h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search email or name"
              className="w-48 bg-transparent text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(["all", "jobseeker", "employer"] as RoleFilter[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRoleFilter(option)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  roleFilter === option
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-500 hover:text-brand-navy"
                }`}
              >
                {option === "all" ? "All" : `${option}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Job Interest</th>
              <th className="py-2 pr-4 font-medium">Joined</th>
              <th className="py-2 pr-4 font-medium">VIP / Plan</th>
              <th className="py-2 pr-0 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                  No accounts match your filters.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => {
              const displayName = getDisplayName(user);
              const hasName = displayName !== user.email;
              return (
                <tr key={user.email} className="border-b border-slate-50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-brand-navy">{displayName}</p>
                    {hasName && (
                      <p className="text-xs text-slate-400">{user.email}</p>
                    )}
                  </td>
                  <td className="py-3 pr-4 capitalize text-slate-600">{user.role}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {user.jobInterest ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-3 pr-4">
                    {user.role === "jobseeker" ? (
                      user.isVip && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                          <Crown className="h-3 w-3" />
                          VIP
                        </span>
                      )
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          (user.planId ?? "free") !== "free"
                            ? "bg-cyan-50 text-brand-accent-dark"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {PLAN_LABELS[user.planId ?? "free"]}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-0 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role === "jobseeker" ? (
                        <button
                          type="button"
                          onClick={() => handleToggleVip(user.email, Boolean(user.isVip))}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            user.isVip
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          }`}
                        >
                          {user.isVip ? "Revoke VIP" : "Grant VIP"}
                        </button>
                      ) : (
                        <select
                          value={user.planId ?? "free"}
                          onChange={(event) =>
                            handlePlanChange(user.email, event.target.value as PlanId)
                          }
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-brand-navy focus:border-brand-accent focus:outline-none"
                        >
                          <option value="free">Free</option>
                          <option value="business">Business Pass</option>
                          <option value="enterprise">Enterprise Plan</option>
                        </select>
                      )}
                      {user.role === "employer" && (
                        <button
                          type="button"
                          onClick={() => setViewingEmployer(user.email)}
                          aria-label={`View ${user.email}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-navy"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(user.email)}
                        aria-label={`Delete ${user.email}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewingEmployer && (
        <AdminEmployerModal
          employerEmail={viewingEmployer}
          onClose={() => setViewingEmployer(null)}
        />
      )}
    </div>
  );
}
