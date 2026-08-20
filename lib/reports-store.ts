// DEMO-ONLY employer report log, backed by localStorage. Jobseekers file
// these against a job posting/employer; admins review them from the
// Reports tab. Marking a report reviewed or resolved notifies the
// reporter in-app so they know their report was seen.

import { addNotification } from "./notifications-store";
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
  status: "open" | "reviewed" | "resolved";
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

function setStatus(
  id: string,
  status: EmployerReport["status"],
  notificationTitle: string,
  notificationMessage: (companyName: string) => string
): void {
  const reports = readAll();
  const report = reports.find((r) => r.id === id);
  if (!report) return;

  writeAll(reports.map((r) => (r.id === id ? { ...r, status } : r)));
  addNotification(
    report.reporterEmail,
    notificationTitle,
    notificationMessage(report.companyName)
  );
}

export function markReportReviewed(id: string): void {
  setStatus(
    id,
    "reviewed",
    "Your report was reviewed",
    (companyName) =>
      `DirectStaffPH reviewed your report about ${companyName}. We're looking into it.`
  );
}

export function markReportResolved(id: string): void {
  setStatus(
    id,
    "resolved",
    "Your report was resolved",
    (companyName) =>
      `DirectStaffPH resolved your report about ${companyName}. Thanks for helping keep the platform safe.`
  );
}
