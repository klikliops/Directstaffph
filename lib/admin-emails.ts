// DEMO-ONLY email broadcast. There is no email service wired up (no
// SMTP/Resend/SendGrid), so "sending" just logs an entry to
// localStorage. Nothing is actually delivered. Replace with a real
// transactional email provider called from a server action before
// this goes anywhere real.

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
  recipientCount: number
): EmailLogEntry {
  const entry: EmailLogEntry = {
    id: `email_${Date.now()}`,
    audience,
    subject,
    message,
    recipientCount,
    sentAt: new Date().toISOString(),
  };
  const log = readLog();
  window.localStorage.setItem(
    EMAIL_LOG_KEY,
    JSON.stringify([...log, entry])
  );
  return entry;
}
