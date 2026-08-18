// DEMO-ONLY admin gate. The passcode lives in localStorage (falling back
// to a hardcoded default), with the "session" just a sessionStorage
// flag -- anyone who reads this file, the network tab, or localStorage
// has the passcode. This is fine for a local demo but must NOT ship to
// production.
//
// Replace with real authenticated, server-verified admin access before
// launch -- e.g. a Supabase user with an `is_admin` flag checked in a
// server component / row-level security policy, not a client-side string
// compare.

const DEFAULT_PASSCODE = "directstaff-admin";
const PASSCODE_KEY = "directstaffph_admin_passcode";
const ADMIN_SESSION_KEY = "directstaffph_admin_session";

export function getAdminPasscode(): string {
  if (typeof window === "undefined") return DEFAULT_PASSCODE;
  return window.localStorage.getItem(PASSCODE_KEY) ?? DEFAULT_PASSCODE;
}

export function setAdminPasscode(passcode: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PASSCODE_KEY, passcode);
}

export function verifyAdminPasscode(passcode: string): boolean {
  return passcode === getAdminPasscode();
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
