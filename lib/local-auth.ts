// DEMO-ONLY mock auth. Accounts (the "database") live in localStorage,
// including passwords in plain text, so the signup/login flow has
// something real to talk to before Supabase Auth is wired up.
//
// The *active session* -- who's currently logged in -- lives in
// sessionStorage instead, scoped per browser tab. Using localStorage for
// the session meant logging into a second tab as a different account
// silently swapped the session out from under every other open tab of
// the same origin, since they all share one localStorage.
//
// Do NOT ship this to production. Replace with Supabase Auth
// (supabase.auth.signUp / signInWithPassword), which handles password
// hashing and session tokens server-side.

import { addNotification } from "./notifications-store";
import { getJobById } from "./jobs-store";
import type { PricingPlanId } from "./types";

export type UserRole = "employer" | "jobseeker";
export type RecruitmentType = "Full-time" | "Part-time";
export type PlanId = PricingPlanId;

export interface MockUser {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  jobInterest?: string;
  resumeSubmitted?: boolean;
  resumeFileName?: string;
  profilePictureSet?: boolean;
  avatarColorFrom?: string;
  avatarColorTo?: string;
  appliedJobIds?: string[];
  bookmarkedJobIds?: string[];
  // Jobseeker-only: paid perk purchased via the PH-local (GCash/Maya) demo
  // checkout at /jobseeker/upgrade, or granted by an admin.
  isVip?: boolean;
  // Employer-only: paid subscription tier purchased via the international
  // (Stripe-style) demo checkout at /employer/billing/checkout, or set by
  // an admin. Defaults to "free" when absent.
  planId?: PlanId;
  createdAt?: string;
  recruitedJobId?: string;
  recruitedJobTitle?: string;
  recruitedEmploymentType?: RecruitmentType;
  recruitedByEmail?: string;
  recruitedCompanyName?: string;
  recruitedAt?: string;
}

const USERS_KEY = "directstaffph_mock_users";
const SESSION_KEY = "directstaffph_mock_session";

function readUsers(): MockUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MockUser[];
    // Drop any records from before the email/firstName/lastName schema
    // change -- they won't have `.email` and would crash every lookup.
    return parsed.filter((u) => typeof u.email === "string");
  } catch {
    return [];
  }
}

function writeUsers(users: MockUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(
  user: MockUser
): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (exists) {
    return { ok: false, error: "That email is already registered." };
  }
  const withTimestamp = { ...user, createdAt: new Date().toISOString() };
  writeUsers([...users, withTimestamp]);
  saveSession(withTimestamp);
  return { ok: true };
}

export function loginUser(
  email: string,
  password: string
): { ok: true; user: MockUser } | { ok: false; error: string } {
  const users = readUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!match) {
    return { ok: false, error: "No account found with that email." };
  }
  if (match.password !== password) {
    return { ok: false, error: "Incorrect password." };
  }
  saveSession(match);
  return { ok: true, user: match };
}

export function updateProfile(
  email: string,
  updates: Partial<Omit<MockUser, "email" | "password" | "role">>
): MockUser | null {
  const users = readUsers();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (index === -1) return null;

  const updated = { ...users[index], ...updates };
  const nextUsers = [...users];
  nextUsers[index] = updated;
  writeUsers(nextUsers);

  const session = getSession();
  if (session && session.email.toLowerCase() === email.toLowerCase()) {
    saveSession(updated);
  }

  return updated;
}

export function isLockedFromApplying(user: MockUser | null): boolean {
  return Boolean(user?.recruitedJobId) && user?.recruitedEmploymentType === "Full-time";
}

export function applyToJob(email: string, jobId: string): MockUser | null {
  const users = readUsers();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (index === -1) return null;

  const current = users[index];
  if (isLockedFromApplying(current)) return current;
  if (current.appliedJobIds?.includes(jobId)) return current;

  const updated = updateProfile(email, {
    appliedJobIds: [...(current.appliedJobIds ?? []), jobId],
  });

  // Recruited part-time elsewhere? Let that employer know they're still
  // job-hunting instead of silently letting it happen.
  if (updated?.recruitedByEmail && updated.recruitedEmploymentType === "Part-time") {
    const newJob = getJobById(jobId);
    if (newJob) {
      addNotification(
        updated.recruitedByEmail,
        "Your part-time hire applied elsewhere",
        `${getDisplayName(updated)} (recruited part-time for ${updated.recruitedJobTitle}) just applied to ${newJob.title} at ${newJob.companyName}.`
      );
    }
  }

  return updated;
}

export function recruitApplicant(
  jobseekerEmail: string,
  employerEmail: string,
  job: { id: string; title: string; companyName: string; employmentType: RecruitmentType }
): MockUser | null {
  const updated = updateProfile(jobseekerEmail, {
    recruitedJobId: job.id,
    recruitedJobTitle: job.title,
    recruitedEmploymentType: job.employmentType,
    recruitedByEmail: employerEmail,
    recruitedCompanyName: job.companyName,
    recruitedAt: new Date().toISOString(),
  });

  if (updated) {
    addNotification(
      jobseekerEmail,
      "You've been recruited!",
      job.employmentType === "Full-time"
        ? `${job.companyName} recruited you for ${job.title} (Full-time). You're now marked as hired and can't apply to other jobs.`
        : `${job.companyName} recruited you for ${job.title} (Part-time). You can still apply to other jobs.`
    );
  }

  return updated;
}

export function toggleBookmark(email: string, jobId: string): MockUser | null {
  const users = readUsers();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (index === -1) return null;

  const current = users[index];
  const bookmarked = current.bookmarkedJobIds ?? [];
  const nextBookmarked = bookmarked.includes(jobId)
    ? bookmarked.filter((id) => id !== jobId)
    : [...bookmarked, jobId];

  return updateProfile(email, { bookmarkedJobIds: nextBookmarked });
}

// -- Admin-only helpers --

export function getAllUsers(): MockUser[] {
  return readUsers();
}

export function setVipStatus(email: string, isVip: boolean): MockUser | null {
  return updateProfile(email, { isVip });
}

// Admin override -- no notification wording implying a real charge.
export function setEmployerPlan(email: string, planId: PlanId): MockUser | null {
  const updated = updateProfile(email, { planId });
  if (updated) {
    addNotification(
      email,
      "Your plan was updated",
      `DirectStaffPH admin set your plan to ${PLAN_LABELS[planId]}.`
    );
  }
  return updated;
}

// -- Payment gateway (demo) --
//
// Both of these simulate a successful checkout: no real card or e-wallet
// processing happens anywhere in this codebase. Employers (international)
// go through the Stripe-styled flow at /employer/billing/checkout; PH-based
// jobseekers go through the GCash/Maya-styled flow at /jobseeker/upgrade.
// Wiring up real payments needs a backend that can hold Stripe/PayMongo
// secret keys -- this app is 100% client-side/localStorage today.

const PLAN_LABELS: Record<PlanId, string> = {
  free: "Free",
  business: "Business Pass",
  agency: "Agency Plan",
};

export function upgradeEmployerPlan(email: string, planId: PlanId): MockUser | null {
  const updated = updateProfile(email, { planId });
  if (updated) {
    addNotification(
      email,
      "Payment successful",
      `You're now on the ${PLAN_LABELS[planId]}. Contact info, video intros, and direct messaging are unlocked.`
    );
  }
  return updated;
}

export function upgradeJobseekerVip(email: string): MockUser | null {
  const updated = updateProfile(email, { isVip: true });
  if (updated) {
    addNotification(
      email,
      "Payment successful",
      "You're now a VIP member! Your crown badge is live and you'll stand out on the employer leaderboard."
    );
  }
  return updated;
}

export function deleteUserAccount(email: string): boolean {
  const users = readUsers();
  const nextUsers = users.filter(
    (u) => u.email.toLowerCase() !== email.toLowerCase()
  );
  if (nextUsers.length === users.length) return false;
  writeUsers(nextUsers);

  const session = getSession();
  if (session && session.email.toLowerCase() === email.toLowerCase()) {
    clearSession();
  }
  return true;
}

export const SESSION_CHANGE_EVENT = "directstaffph:session-change";

export function saveSession(user: MockUser) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function getSession(): MockUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MockUser;
    // A session saved before the email/firstName/lastName schema change
    // won't have `.email` -- treat it as logged out rather than crash.
    return typeof parsed.email === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function getDisplayName(user: MockUser | null): string {
  if (!user) return "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.email;
}
