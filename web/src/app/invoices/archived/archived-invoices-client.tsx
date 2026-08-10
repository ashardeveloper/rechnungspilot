"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";

import { restoreInvoiceAction } from "@/app/actions/invoice-actions";
import type { CanonicalInvoice } from "@/domain/invoice";
import { formatCurrency, formatDate } from "@/components/invoices/formatting";
import { invoiceStatusLabels } from "@/components/invoices/invoice-status";

type ArchivedInvoicesClientProps = {
  initialInvoices: CanonicalInvoice[];
};

export function ArchivedInvoicesClient({
  initialInvoices,
}: ArchivedInvoicesClientProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isPending, startTransition] = useTransition();

  function restoreInvoice(invoiceId: string) {
    startTransition(async () => {
      setInvoices(await restoreInvoiceAction(invoiceId));
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Archivierte Rechnungen</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ausgeblendete Rechnungen können hier wiederhergestellt werden.
          </p>
        </div>

        <Link
          href="/invoices"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Zur Rechnungsübersicht
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {invoices.length === 0 ? (
          <div className="px-5 py-10 text-sm text-slate-600">
            Keine archivierten Rechnungen vorhanden.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1fr_140px_140px_120px_auto]"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {invoice.number}
                  </p>
                  <p className="mt-1 text-slate-600">{invoice.buyer.name}</p>
                </div>

                <span className="text-slate-600">
                  {formatDate(invoice.dueDate)}
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.totals.grossAmountCents)}
                </span>

                <span className="text-slate-600">
                  {invoiceStatusLabels[invoice.status]}
                </span>

                <button
                  type="button"
                  onClick={() => restoreInvoice(invoice.id)}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  <RotateCcw size={16} />
                  Wiederherstellen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
