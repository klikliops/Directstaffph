// DEMO-ONLY message log, backed by localStorage. Employer -> jobseeker
// messages (from the applicants page) are recorded here so employers
// have their own sent-messages history, in addition to firing an
// in-app notification for the recipient via notifications-store.ts.

import { addNotification } from "./notifications-store";

export interface MessageEntry {
  id: string;
  fromEmail: string;
  toEmail: string;
  toName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  body: string;
  createdAt: string;
}

const MESSAGES_KEY = "directstaffph_messages";

function readAll(): MessageEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(MESSAGES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MessageEntry[];
  } catch {
    return [];
  }
}

function writeAll(messages: MessageEntry[]) {
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function getMessagesSentBy(employerEmail: string): MessageEntry[] {
  return readAll()
    .filter((m) => m.fromEmail.toLowerCase() === employerEmail.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function sendEmployerMessage(entry: {
  fromEmail: string;
  toEmail: string;
  toName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  body: string;
}): MessageEntry {
  const message: MessageEntry = {
    ...entry,
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), message]);
  addNotification(entry.toEmail, `New message from ${entry.companyName}`, entry.body);
  return message;
}
