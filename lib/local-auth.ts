// DEMO-ONLY mock auth. Stores accounts in the browser's localStorage,
// including passwords in plain text, so the signup/login flow has
// something real to talk to before Supabase Auth is wired up.
//
// Do NOT ship this to production. Replace with Supabase Auth
// (supabase.auth.signUp / signInWithPassword), which handles password
// hashing and session tokens server-side.

export type UserRole = "employer" | "jobseeker";

export interface MockUser {
  username: string;
  password: string;
  role: UserRole;
  mobileNumber?: string;
  fullName?: string;
  jobInterest?: string;
  resumeSubmitted?: boolean;
  resumeFileName?: string;
  profilePictureSet?: boolean;
  avatarColorFrom?: string;
  avatarColorTo?: string;
}

const USERS_KEY = "directstaffph_mock_users";
const SESSION_KEY = "directstaffph_mock_session";

function readUsers(): MockUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MockUser[];
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
    (u) => u.username.toLowerCase() === user.username.toLowerCase()
  );
  if (exists) {
    return { ok: false, error: "That username is already taken." };
  }
  writeUsers([...users, user]);
  saveSession(user);
  return { ok: true };
}

export function loginUser(
  username: string,
  password: string
): { ok: true; user: MockUser } | { ok: false; error: string } {
  const users = readUsers();
  const match = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (!match) {
    return { ok: false, error: "No account found with that username." };
  }
  if (match.password !== password) {
    return { ok: false, error: "Incorrect password." };
  }
  saveSession(match);
  return { ok: true, user: match };
}

export function updateProfile(
  username: string,
  updates: Partial<Omit<MockUser, "username" | "password" | "role">>
): MockUser | null {
  const users = readUsers();
  const index = users.findIndex(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (index === -1) return null;

  const updated = { ...users[index], ...updates };
  const nextUsers = [...users];
  nextUsers[index] = updated;
  writeUsers(nextUsers);

  const session = getSession();
  if (session && session.username.toLowerCase() === username.toLowerCase()) {
    saveSession(updated);
  }

  return updated;
}

export const SESSION_CHANGE_EVENT = "directstaffph:session-change";

export function saveSession(user: MockUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function getSession(): MockUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}
