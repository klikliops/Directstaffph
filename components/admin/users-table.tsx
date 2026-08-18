"use client";

import { useMemo, useState } from "react";
import { Crown, Search, Trash2 } from "lucide-react";
import {
  deleteUserAccount,
  setVipStatus,
  type MockUser,
  type UserRole,
} from "@/lib/local-auth";

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

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesQuery =
        !q ||
        user.username.toLowerCase().includes(q) ||
        (user.fullName ?? "").toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, query, roleFilter]);

  function handleToggleVip(username: string, current: boolean) {
    setVipStatus(username, !current);
    onChange(
      users.map((u) => (u.username === username ? { ...u, isVip: !current } : u))
    );
  }

  function handleDelete(username: string) {
    if (!window.confirm(`Delete account "${username}"? This can't be undone.`)) {
      return;
    }
    deleteUserAccount(username);
    onChange(users.filter((u) => u.username !== username));
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
              placeholder="Search username or name"
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
              <th className="py-2 pr-4 font-medium">Username</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Job Interest</th>
              <th className="py-2 pr-4 font-medium">Joined</th>
              <th className="py-2 pr-4 font-medium">VIP</th>
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

            {filteredUsers.map((user) => (
              <tr key={user.username} className="border-b border-slate-50">
                <td className="py-3 pr-4">
                  <p className="font-medium text-brand-navy">
                    {user.fullName || user.username}
                  </p>
                  {user.fullName && (
                    <p className="text-xs text-slate-400">{user.username}</p>
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
                  {user.isVip && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                      <Crown className="h-3 w-3" />
                      VIP
                    </span>
                  )}
                </td>
                <td className="py-3 pr-0 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleVip(user.username, Boolean(user.isVip))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        user.isVip
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                      }`}
                    >
                      {user.isVip ? "Revoke VIP" : "Grant VIP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user.username)}
                      aria-label={`Delete ${user.username}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
