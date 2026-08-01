import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { sampleInvoices } from "@/domain/invoice-fixtures";

const checks = [
  "Pflichtangaben nach Rechnungstyp erfassen",
  "PDF aus kanonischem Rechnungsmodell erzeugen",
  "XRechnung XML später technisch validieren",
  "Keine Steuer-, DATEV-, ELSTER- oder Zahlungsintegration",
];

export default function Home() {
  const selectedInvoice = sampleInvoices[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              RechnungsPilot DE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Lokaler Rechnungsarbeitsplatz
            </h1>
          </div>
          <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white">
            Neue Rechnung
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.4fr_0.8fr]">
        <InvoiceList invoices={sampleInvoices} />

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

      <InvoicePreview invoice={selectedInvoice} />
    </main>
  );
}
