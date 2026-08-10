"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Clock3,
  FileText,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import {
  createDraftInvoiceAction,
  resetDemoInvoicesAction,
  searchInvoicesAction,
} from "@/app/actions/invoice-actions";
import { InvoiceList } from "@/components/invoices/invoice-list";
import type { CanonicalInvoice, InvoiceStatus } from "@/domain/invoice";
import { getInvoiceDueStatus } from "@/domain/invoice-due-status";
import Link from "next/link";

type InvoiceListClientProps = {
  initialInvoices: CanonicalInvoice[];
  initialNextCursor?: string;
  initialQuery: string;
  initialStatus: InvoiceStatus | "all";
  archivedCount: number;
};

export function InvoiceListClient({
  initialInvoices,
  initialNextCursor,
  initialQuery,
  initialStatus,
  archivedCount,
}: InvoiceListClientProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const [invoiceSearch] = useState(initialQuery);
  const [statusFilter] = useState<InvoiceStatus | "all">(initialStatus);
  const [dueFilter, setDueFilter] = useState<
    "all" | "draft" | "open" | "due_soon" | "overdue" | "paid"
  >("all");

  const invoiceStats = useMemo(
    () => ({
      total: invoices.length,
      drafts: invoices.filter((invoice) => invoice.status === "draft").length,
      reviewReady: invoices.filter(
        (invoice) => invoice.status === "review_ready",
      ).length,
      issued: invoices.filter((invoice) => invoice.status === "issued").length,
      paid: invoices.filter((invoice) => invoice.status === "paid").length,
      dueSoon: invoices.filter(
        (invoice) => getInvoiceDueStatus(invoice) === "due_soon",
      ).length,
      overdue: invoices.filter(
        (invoice) => getInvoiceDueStatus(invoice) === "overdue",
      ).length,
    }),
    [invoices],
  );

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const dueStatus = getInvoiceDueStatus(invoice);

      return dueFilter === "all" || dueStatus === dueFilter;
    });
  }, [invoices, dueFilter]);

  function createDraftInvoice() {
    startTransition(async () => {
      setInvoices(await createDraftInvoiceAction());
    });
  }

  function resetDemoData() {
    startTransition(async () => {
      setInvoices(await resetDemoInvoicesAction());
    });
  }

  function loadMoreInvoices() {
    if (!nextCursor) {
      return;
    }

    startTransition(async () => {
      const result = await searchInvoicesAction({
        query: invoiceSearch,
        status: statusFilter,
        cursor: nextCursor,
      });

      setInvoices((currentInvoices) => [
        ...currentInvoices,
        ...result.invoices,
      ]);
      setNextCursor(result.nextCursor);
    });
  }

  return (
    <section className="mx-auto max-w-6xl space-y-4 px-6 py-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Rechnungsübersicht</h2>
            <p className="mt-1 text-sm text-slate-600">
              Suchen, filtern und neue Rechnungen anlegen.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetDemoData}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Beispieldaten zurücksetzen
            </button>
            <Link
              href="/invoices/archived"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Archiv{archivedCount > 0 ? ` (${archivedCount})` : ""}
            </Link>
            <button
              type="button"
              onClick={createDraftInvoice}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
            >
              <Plus size={16} />
              Neue Rechnung
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <Metric
            icon={<FileText size={24} />}
            label="Gesamt"
            value={invoiceStats.total}
            tone="blue"
          />
          <Metric
            icon={<PencilLine size={24} />}
            label="Entwürfe"
            value={invoiceStats.drafts}
            tone="blue"
          />
          <Metric
            icon={<CheckSquare size={24} />}
            label="Prüfbereit"
            value={invoiceStats.reviewReady}
            tone="blue"
          />
          <Metric
            icon={<Send size={24} />}
            label="Ausgestellt"
            value={invoiceStats.issued}
            tone="blue"
          />
          <Metric
            icon={<CheckCircle2 size={24} />}
            label="Bezahlt"
            value={invoiceStats.paid}
            tone="green"
          />
          <Metric
            icon={<Clock3 size={24} />}
            label="Bald fällig"
            value={invoiceStats.dueSoon}
            tone="amber"
          />
          <Metric
            icon={<AlertCircle size={24} />}
            label="Überfällig"
            value={invoiceStats.overdue}
            tone="red"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form className="grid gap-4 lg:grid-cols-[1fr_240px_220px_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={initialQuery}
              placeholder="Rechnung oder Kunde suchen..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-slate-500"
            />
          </label>

          <select
            name="status"
            defaultValue={initialStatus}
            className="h-10 rounded-lg border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
          >
            <option value="all">Alle Status</option>
            <option value="draft">Entwurf</option>
            <option value="review_ready">Prüfbereit</option>
            <option value="issued">Ausgestellt</option>
            <option value="paid">Bezahlt</option>
          </select>

          <select
            value={dueFilter}
            onChange={(event) =>
              setDueFilter(event.target.value as typeof dueFilter)
            }
            className="h-10 rounded-lg border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
          >
            <option value="all">Alle Fälligkeiten</option>
            <option value="draft">Entwurf</option>
            <option value="open">Offen</option>
            <option value="due_soon">Bald fällig</option>
            <option value="overdue">Überfällig</option>
            <option value="paid">Bezahlt</option>
          </select>
          <button
            type="submit"
            className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
          >
            Suchen
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          {filteredInvoices.length} von {invoices.length} Rechnungen angezeigt.
        </p>
      </div>

      {filteredInvoices.length > 0 ? (
        <InvoiceList invoices={filteredInvoices} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold">
            Keine aktiven Rechnungen gefunden
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Passe die Suche an, lege eine neue Rechnung an oder prüfe das
            Archiv.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={createDraftInvoice}
              disabled={isPending}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              Neue Rechnung
            </button>
            <Link
              href="/invoices/archived"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Archiv öffnen
            </Link>
          </div>
        </div>
      )}

      {nextCursor ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={loadMoreInvoices}
            disabled={isPending}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
          >
            {isPending ? "Wird geladen..." : "Mehr laden"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "blue" | "green" | "amber" | "red";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm leading-5 text-slate-600">{label}</p>
        <p className="text-2xl font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}
