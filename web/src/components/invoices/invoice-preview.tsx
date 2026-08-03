"use client";
import { calculateLineNetAmountCents } from "@/domain/invoice-calculations";
import type { CanonicalInvoice } from "@/domain/invoice";

import { formatCurrency, formatDate, formatUnit } from "./formatting";
import { invoiceStatusLabels } from "./invoice-status";

export function InvoicePreview({ invoice }: { invoice: CanonicalInvoice }) {
  function printInvoice() {
    window.print();
  }
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-6 border-b border-slate-200 px-5 py-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              Rechnungsvorschau
            </p>
            <h2 className="mt-1 text-xl font-semibold">{invoice.number}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ausgestellt am {formatDate(invoice.issueDate)} · fällig am{" "}
              {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div className="flex items-start gap-3 md:justify-end">
            <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium">
              {invoiceStatusLabels[invoice.status]}
            </span>
            <span className="rounded-md bg-slate-950 px-3 py-1.5 text-sm font-medium text-white">
              {formatCurrency(invoice.totals.grossAmountCents)}
            </span>
            <button
              type="button"
              onClick={printInvoice}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 print:hidden"
            >
              PDF drucken
            </button>
          </div>
        </div>

        <div className="grid gap-6 border-b border-slate-200 px-5 py-5 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Von</h3>
            <address className="mt-2 not-italic text-sm leading-6 text-slate-600">
              <span className="block font-medium text-slate-950">
                {invoice.seller.name}
              </span>
              <span className="block">{invoice.seller.street}</span>
              <span className="block">
                {invoice.seller.postalCode} {invoice.seller.city}
              </span>
              <span className="block">Deutschland</span>
              {invoice.seller.taxNumber ? (
                <span className="block">
                  Steuernr. {invoice.seller.taxNumber}
                </span>
              ) : null}
            </address>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">An</h3>
            <address className="mt-2 not-italic text-sm leading-6 text-slate-600">
              <span className="block font-medium text-slate-950">
                {invoice.buyer.name}
              </span>
              <span className="block">{invoice.buyer.street}</span>
              <span className="block">
                {invoice.buyer.postalCode} {invoice.buyer.city}
              </span>
              <span className="block">Deutschland</span>
            </address>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-medium">Leistung</th>
                <th className="px-5 py-3 text-right font-medium">Menge</th>
                <th className="px-5 py-3 text-right font-medium">
                  Einzelpreis
                </th>
                <th className="px-5 py-3 text-right font-medium">USt.</th>
                <th className="px-5 py-3 text-right font-medium">Netto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.lineItems.map((item) => (
                <tr key={item.description}>
                  <td className="px-5 py-4 font-medium">{item.description}</td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {item.quantity} {formatUnit(item.unit)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {formatCurrency(item.unitPriceCents)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {item.vatRatePercent} %
                  </td>
                  <td className="px-5 py-4 text-right font-medium">
                    {formatCurrency(calculateLineNetAmountCents(item))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto w-full max-w-sm space-y-2 px-5 py-5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Netto</span>
            <span>{formatCurrency(invoice.totals.netAmountCents)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Umsatzsteuer</span>
            <span>{formatCurrency(invoice.totals.vatAmountCents)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold">
            <span>Gesamtbetrag</span>
            <span>{formatCurrency(invoice.totals.grossAmountCents)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
