import { sampleInvoices } from "@/domain/invoice-fixtures";
import type { InvoiceStatus } from "@/domain/invoice";

const statusLabels: Record<InvoiceStatus, string> = {
  draft: "Entwurf",
  review_ready: "Prüfbereit",
  paid: "Bezahlt",
};

const checks = [
  "Pflichtangaben nach Rechnungstyp erfassen",
  "PDF aus kanonischem Rechnungsmodell erzeugen",
  "XRechnung XML später technisch validieren",
  "Keine Steuer-, DATEV-, ELSTER- oder Zahlungsintegration",
];

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(date));
}

export default function Home() {
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
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Rechnungen</h2>
            <p className="mt-1 text-sm text-slate-600">
              MVP-Daten für lokale Erstellung, PDF-Ausgabe und spätere
              XML-Validierung.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {sampleInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-sm text-slate-600">{invoice.buyer.name}</p>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  <span className="text-sm text-slate-600">
                    {formatDate(invoice.dueDate)}
                  </span>
                  <span className="w-32 text-right font-medium">
                    {formatCurrency(invoice.totals.grossAmountCents)}
                  </span>
                  <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium">
                    {statusLabels[invoice.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
    </main>
  );
}
