// DEMO-ONLY admin gate. A single hardcoded passcode checked client-side,
// with the "session" just a sessionStorage flag -- anyone who reads this
// file (or the network tab) has the passcode. This is fine for a local
// demo but must NOT ship to production.
//
// Replace with real authenticated, server-verified admin access before
// launch -- e.g. a Supabase user with an `is_admin` flag checked in a
// server component / row-level security policy, not a client-side string
// compare.

const ADMIN_PASSCODE = "directstaff-admin";
const ADMIN_SESSION_KEY = "directstaffph_admin_session";

export function verifyAdminPasscode(passcode: string): boolean {
  return passcode === ADMIN_PASSCODE;
}

export function setAdminSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function hasAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
