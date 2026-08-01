"use client";

import { useEffect, useMemo, useState } from "react";

import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { sampleInvoices } from "@/domain/invoice-fixtures";
import type { CanonicalInvoice } from "@/domain/invoice";
import {
  clearStoredInvoices,
  loadInvoicesFromStorage,
  saveInvoicesToStorage,
} from "@/storage/invoice-storage";

const checks = [
  "Pflichtangaben nach Rechnungstyp erfassen",
  "PDF aus kanonischem Rechnungsmodell erzeugen",
  "XRechnung XML später technisch validieren",
  "Keine Steuer-, DATEV-, ELSTER- oder Zahlungsintegration",
];

const initialInvoices = () => loadInvoicesFromStorage(sampleInvoices);

export default function Home() {
  const [invoices, setInvoices] = useState<CanonicalInvoice[]>(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    () => initialInvoices()[0]?.id ?? sampleInvoices[0].id,
  );

  useEffect(() => {
    saveInvoicesToStorage(invoices);
  }, [invoices]);

  const selectedInvoice = useMemo(
    () =>
      invoices.find((invoice) => invoice.id === selectedInvoiceId) ??
      invoices[0],
    [invoices, selectedInvoiceId],
  );

  function resetDemoData() {
    clearStoredInvoices();
    setInvoices(sampleInvoices);
    setSelectedInvoiceId(sampleInvoices[0].id);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              RechnungsPilot DE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Lokaler Rechnungsarbeitsplatz
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetDemoData}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Demo zurücksetzen
            </button>
            <button
              type="button"
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            >
              Neue Rechnung
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.4fr_0.8fr]">
        <InvoiceList
          invoices={invoices}
          selectedInvoiceId={selectedInvoice?.id ?? ""}
          onSelectInvoice={setSelectedInvoiceId}
        />

        <aside className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">MVP-Leitplanken</h2>
            <p className="mt-1 text-sm text-slate-600">
              Technisch sauber, lokal lauffähig, ohne
              Zertifizierungsversprechen.
            </p>
          </div>

          <ul className="space-y-3 px-5 py-4">
            {checks.map((check) => (
              <li key={check} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-600" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {selectedInvoice ? <InvoicePreview invoice={selectedInvoice} /> : null}
    </main>
  );
}
