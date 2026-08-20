"use client";

import { useEffect, useState } from "react";
import { Check, LifeBuoy } from "lucide-react";
import {
  getAllSupportTickets,
  markTicketResolved,
  SUPPORT_TICKETS_CHANGE_EVENT,
  type SupportTicket,
} from "@/lib/support-store";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SupportTicketsTable() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    function refresh() {
      setTickets(getAllSupportTickets());
    }
    refresh();
    window.addEventListener(SUPPORT_TICKETS_CHANGE_EVENT, refresh);
    return () =>
      window.removeEventListener(SUPPORT_TICKETS_CHANGE_EVENT, refresh);
  }, []);

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-4 w-4 text-brand-accent-dark" />
        <h2 className="text-base font-semibold text-brand-navy">
          Support Tickets
        </h2>
        {openCount > 0 && (
          <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-brand-accent-dark">
            {openCount} open
          </span>
        )}
      </div>

      {tickets.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-500">
          No support tickets yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className={`rounded-xl border p-4 ${
                ticket.status === "open"
                  ? "border-cyan-100 bg-cyan-50/40"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ticket.name} ({ticket.email}) &middot;{" "}
                    <span className="capitalize">{ticket.role}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDateTime(ticket.createdAt)}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">{ticket.message}</p>

              <div className="mt-3">
                {ticket.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => markTicketResolved(ticket.id)}
                    className="flex items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark Resolved
                  </button>
                ) : (
                  <span className="flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-500">
                    <Check className="h-3.5 w-3.5" />
                    Resolved
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
