// DEMO-ONLY support ticket log, backed by localStorage. Jobseekers and
// employers submit these from their Support page; admins review them from
// the Support tab. No auto-reply or email delivery happens here.

import type { UserRole } from "./local-auth";

export interface SupportTicket {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subject: string;
  message: string;
  createdAt: string;
  status: "open" | "resolved";
}

const TICKETS_KEY = "directstaffph_support_tickets";
export const SUPPORT_TICKETS_CHANGE_EVENT = "directstaffph:support-tickets-change";

function readAll(): SupportTicket[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(TICKETS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SupportTicket[];
  } catch {
    return [];
  }
}

function writeAll(tickets: SupportTicket[]) {
  window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event(SUPPORT_TICKETS_CHANGE_EVENT));
}

export function getAllSupportTickets(): SupportTicket[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function submitSupportTicket(entry: {
  email: string;
  name: string;
  role: UserRole;
  subject: string;
  message: string;
}): SupportTicket {
  const ticket: SupportTicket = {
    ...entry,
    id: `ticket_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  writeAll([...readAll(), ticket]);
  return ticket;
}

export function markTicketResolved(id: string): void {
  writeAll(
    readAll().map((t) => (t.id === id ? { ...t, status: "resolved" } : t))
  );
}
