// DEMO-ONLY email broadcast. There is no real email service wired up
// (no SMTP/Resend/SendGrid) -- "sending" logs an entry here for the
// admin's own record AND fans out an in-app notification to each
// recipient via lib/notifications-store.ts, which is how users
// actually see it (there's nowhere else to deliver a fake email to).
// Replace with a real transactional email provider called from a
// server action before this goes anywhere real.

import { addNotification } from "./notifications-store";

export type EmailAudience = "jobseeker" | "employer" | "all";

export interface EmailLogEntry {
  id: string;
  audience: EmailAudience;
  subject: string;
  message: string;
  recipientCount: number;
  sentAt: string;
}

const EMAIL_LOG_KEY = "directstaffph_admin_email_log";

function readLog(): EmailLogEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(EMAIL_LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EmailLogEntry[];
  } catch {
    return [];
  }
}

export function getEmailLog(): EmailLogEntry[] {
  return readLog().sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}

export function sendMockEmail(
  audience: EmailAudience,
  subject: string,
  message: string,
  recipientEmails: string[]
): EmailLogEntry {
  const entry: EmailLogEntry = {
    id: `email_${Date.now()}`,
    audience,
    subject,
    message,
    recipientCount: recipientEmails.length,
    sentAt: new Date().toISOString(),
  };
  const log = readLog();
  window.localStorage.setItem(
    EMAIL_LOG_KEY,
    JSON.stringify([...log, entry])
  );

  for (const email of recipientEmails) {
    addNotification(email, subject, message);
  }

  return entry;
}
