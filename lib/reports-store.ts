// DEMO-ONLY employer report log, backed by localStorage. Jobseekers file
// these against a job posting/employer; admins review them from the
// Reports tab. No moderation action is taken automatically.

import type { ReportReason } from "./types";

export interface EmployerReport {
  id: string;
  reporterEmail: string;
  reporterName: string;
  employerEmail?: string;
  companyName: string;
  jobId?: string;
  jobTitle?: string;
  reason: ReportReason;
  details: string;
  createdAt: string;
  status: "open" | "reviewed";
}

const REPORTS_KEY = "directstaffph_employer_reports";
export const REPORTS_CHANGE_EVENT = "directstaffph:reports-change";

function readAll(): EmployerReport[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(REPORTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EmployerReport[];
  } catch {
    return [];
  }
}

function writeAll(reports: EmployerReport[]) {
  window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event(REPORTS_CHANGE_EVENT));
}

export function getAllReports(): EmployerReport[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function submitReport(entry: {
  reporterEmail: string;
  reporterName: string;
  employerEmail?: string;
  companyName: string;
  jobId?: string;
  jobTitle?: string;
  reason: ReportReason;
  details: string;
}): EmployerReport {
  const report: EmployerReport = {
    ...entry,
    id: `report_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  writeAll([...readAll(), report]);
  return report;
}

export function markReportReviewed(id: string): void {
  writeAll(
    readAll().map((r) => (r.id === id ? { ...r, status: "reviewed" } : r))
  );
}
