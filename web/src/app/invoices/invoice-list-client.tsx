"use client";

import { useMemo, useState, useTransition } from "react";

import {
  createDraftInvoiceAction,
  resetDemoInvoicesAction,
} from "@/app/actions/invoice-actions";
import { InvoiceList } from "@/components/invoices/invoice-list";
import type { CanonicalInvoice, InvoiceStatus } from "@/domain/invoice";
import { getInvoiceDueStatus } from "@/domain/invoice-due-status";

type InvoiceListClientProps = {
  initialInvoices: CanonicalInvoice[];
};

export function InvoiceListClient({ initialInvoices }: InvoiceListClientProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isPending, startTransition] = useTransition();
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all",
  );
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
    const query = invoiceSearch.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesQuery =
        !query ||
        [invoice.number, invoice.buyer.name, invoice.buyer.city]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;

      const dueStatus = getInvoiceDueStatus(invoice);
      const matchesDue = dueFilter === "all" || dueStatus === dueFilter;

      return matchesQuery && matchesStatus && matchesDue;
    });
  }, [invoices, invoiceSearch, statusFilter, dueFilter]);

  function createDraftInvoice() {
    startTransition(async () => {
      const updatedInvoices = await createDraftInvoiceAction();
      setInvoices(updatedInvoices);
    });
  }

  function resetDemoData() {
    startTransition(async () => {
      const updatedInvoices = await resetDemoInvoicesAction();
      setInvoices(updatedInvoices);
    });
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">Rechnungsübersicht</h2>
            <p className="mt-1 text-sm text-slate-600">
              Suchen, filtern und neue Rechnungen anlegen.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetDemoData}
              disabled={isPending}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              {isPending ? "Wird gespeichert..." : "Beispieldaten zurücksetzen"}
            </button>
            <button
              type="button"
              onClick={createDraftInvoice}
              disabled={isPending}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isPending ? "Wird erstellt..." : "Neue Rechnung"}
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 sm:grid-cols-7">
          <Metric label="Gesamt" value={invoiceStats.total} />
          <Metric label="Entwürfe" value={invoiceStats.drafts} />
          <Metric label="Prüfbereit" value={invoiceStats.reviewReady} />
          <Metric label="Ausgestellt" value={invoiceStats.issued} />
          <Metric label="Bezahlt" value={invoiceStats.paid} />
          <Metric label="Bald fällig" value={invoiceStats.dueSoon} />
          <Metric label="Überfällig" value={invoiceStats.overdue} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 print:hidden">
        <div className="mb-4 rounded-lg border border-slate-200 bg-white px-5 py-4">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <input
              value={invoiceSearch}
              onChange={(event) => setInvoiceSearch(event.target.value)}
              placeholder="Rechnung oder Kunde suchen..."
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as InvoiceStatus | "all")
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
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
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">Alle Fälligkeiten</option>
              <option value="draft">Entwurf</option>
              <option value="open">Offen</option>
              <option value="due_soon">Bald fällig</option>
              <option value="overdue">Überfällig</option>
              <option value="paid">Bezahlt</option>
            </select>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {filteredInvoices.length} von {invoices.length} Rechnungen
            angezeigt.
          </p>
        </div>

        <InvoiceList invoices={filteredInvoices} />
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
