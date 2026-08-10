import type { CanonicalInvoice } from "@/domain/invoice";

import { formatCurrency, formatDate } from "./formatting";
import { invoiceStatusLabels } from "./invoice-status";
import {
  getInvoiceDueStatus,
  getInvoiceDueStatusLabel,
} from "@/domain/invoice-due-status";
import Link from "next/link";

type InvoiceListProps = {
  invoices: CanonicalInvoice[];
};

export function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold">Rechnungen</h2>
        <p className="mt-1 text-sm text-slate-600">
          MVP-Daten für lokale Erstellung, PDF-Ausgabe und spätere
          XML-Validierung.
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {invoices.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-600">
            Keine Rechnungen für die aktuelle Suche gefunden.
          </div>
        ) : null}
        {invoices.map((invoice) => {
          const dueStatus = getInvoiceDueStatus(invoice);

          return (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-medium">{invoice.number}</p>
                <p className="text-sm text-slate-600">{invoice.buyer.name}</p>
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <span className="text-sm text-slate-600">
                  {formatDate(invoice.dueDate)}
                  <span className="ml-2 rounded-md bg-slate-100 px-2 py-1 text-xs">
                    {getInvoiceDueStatusLabel(dueStatus)}
                  </span>
                </span>
                <span className="w-32 text-right font-medium">
                  {formatCurrency(invoice.totals.grossAmountCents)}
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium">
                  {invoiceStatusLabels[invoice.status]}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
