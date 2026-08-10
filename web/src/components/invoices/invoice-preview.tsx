"use client";

import { calculateLineNetAmountCents } from "@/domain/invoice-calculations";
import type { CanonicalInvoice } from "@/domain/invoice";

import { formatCurrency, formatDate, formatUnit } from "./formatting";
import { invoiceStatusLabels } from "./invoice-status";

type InvoicePreviewProps = {
  invoice: CanonicalInvoice;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
};

export function InvoicePreview({
  invoice,
  actions,
  eyebrow,
}: InvoicePreviewProps) {
  const canDownloadPdf =
    invoice.status === "issued" || invoice.status === "paid";

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="mb-4">{eyebrow}</div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xl font-semibold text-slate-600">
                RP
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {invoice.number}
                  </h2>
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    {invoiceStatusLabels[invoice.status]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-600">
                  <div>
                    <p className="text-xs text-slate-500">Ausgestellt am</p>
                    <p className="font-medium text-slate-800">
                      {formatDate(invoice.issueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fällig am</p>
                    <p className="font-medium text-slate-800">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-950 px-6 py-4 text-right text-2xl font-semibold text-white shadow-sm">
              {formatCurrency(invoice.totals.grossAmountCents)}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 print:hidden">
            {actions}

            {canDownloadPdf ? (
              <a
                href={`/invoices/${invoice.id}/pdf`}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                PDF herunterladen
              </a>
            ) : (
              <span
                title="PDF-Download ist erst nach dem Ausstellen verfügbar."
                className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400"
              >
                PDF erst nach Ausstellung
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-6 border-b border-slate-200 px-6 py-5 md:grid-cols-2">
          <PartyBlock title="Von" party={invoice.seller} />
          <PartyBlock title="An" party={invoice.buyer} />
        </div>

        <div className="px-6 py-5">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Leistung</th>
                  <th className="px-4 py-3 text-right font-medium">Menge</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Einzelpreis
                  </th>
                  <th className="px-4 py-3 text-right font-medium">USt.</th>
                  <th className="px-4 py-3 text-right font-medium">Netto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.lineItems.map((item) => (
                  <tr key={item.description}>
                    <td className="px-4 py-3 font-medium">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {item.quantity} {formatUnit(item.unit)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(item.unitPriceCents)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {item.vatRatePercent} %
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(calculateLineNetAmountCents(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto mt-5 w-full max-w-sm space-y-2 text-sm">
            <TotalRow label="Netto" value={invoice.totals.netAmountCents} />
            <TotalRow
              label="Umsatzsteuer"
              value={invoice.totals.vatAmountCents}
            />
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold">
              <span>Gesamtbetrag</span>
              <span>{formatCurrency(invoice.totals.grossAmountCents)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartyBlock({
  title,
  party,
}: {
  title: string;
  party: CanonicalInvoice["seller"];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <address className="mt-3 not-italic text-sm leading-6 text-slate-600">
        <span className="block font-medium text-slate-950">{party.name}</span>
        <span className="block">{party.street}</span>
        <span className="block">
          {party.postalCode} {party.city}
        </span>
        <span className="block">Deutschland</span>
        {party.taxNumber ? (
          <span className="block">Steuernr. {party.taxNumber}</span>
        ) : null}
      </address>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-slate-600">
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
