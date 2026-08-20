"use client";

import { useEffect, useState } from "react";
import { Building2, Check, Flag } from "lucide-react";
import {
  getAllReports,
  markReportReviewed,
  markReportResolved,
  REPORTS_CHANGE_EVENT,
  type EmployerReport,
} from "@/lib/reports-store";
import { REPORT_REASONS } from "@/lib/types";
import { AdminEmployerModal } from "./admin-employer-modal";

function reasonLabel(reason: EmployerReport["reason"]): string {
  return REPORT_REASONS.find((r) => r.id === reason)?.label ?? reason;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<EmployerReport["status"], string> = {
  open: "border-red-100 bg-red-50/40",
  reviewed: "border-amber-100 bg-amber-50/40",
  resolved: "border-slate-100 bg-slate-50",
};

export function ReportsTable() {
  const [reports, setReports] = useState<EmployerReport[]>([]);
  const [viewingEmployer, setViewingEmployer] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setReports(getAllReports());
    }
    refresh();
    window.addEventListener(REPORTS_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(REPORTS_CHANGE_EVENT, refresh);
  }, []);

  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Flag className="h-4 w-4 text-red-500" />
        <h2 className="text-base font-semibold text-brand-navy">
          Employer Reports
        </h2>
        {openCount > 0 && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
            {openCount} open
          </span>
        )}
      </div>

      {reports.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-500">
          No reports filed yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {reports.map((report) => (
            <li
              key={report.id}
              className={`rounded-xl border p-4 ${STATUS_STYLES[report.status]}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    {report.companyName}
                    {report.employerEmail && (
                      <span className="ml-1.5 font-normal text-slate-400">
                        ({report.employerEmail})
                      </span>
                    )}
                  </p>
                  {report.jobTitle && (
                    <p className="text-xs text-slate-500">
                      Re: {report.jobTitle}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {formatDateTime(report.createdAt)}
                </span>
              </div>

              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-inset ring-red-200">
                {reasonLabel(report.reason)}
              </p>

              {report.details && (
                <p className="mt-2 text-sm text-slate-600">{report.details}</p>
              )}

              <p className="mt-2 text-xs text-slate-400">
                Reported by {report.reporterName} ({report.reporterEmail})
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {report.employerEmail && (
                  <button
                    type="button"
                    onClick={() => setViewingEmployer(report.employerEmail!)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-slate-50"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    View Employer
                  </button>
                )}

                {report.status === "open" && (
                  <button
                    type="button"
                    onClick={() => markReportReviewed(report.id)}
                    className="flex items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark Reviewed
                  </button>
                )}

                {report.status === "reviewed" && (
                  <button
                    type="button"
                    onClick={() => markReportResolved(report.id)}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark Resolved
                  </button>
                )}

                {report.status === "reviewed" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-600">
                    Reviewed
                  </span>
                )}

                {report.status === "resolved" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-500">
                    <Check className="h-3.5 w-3.5" />
                    Resolved
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewingEmployer && (
        <AdminEmployerModal
          employerEmail={viewingEmployer}
          onClose={() => setViewingEmployer(null)}
        />
      )}
    </div>
  );
}
