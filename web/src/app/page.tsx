import { sampleInvoices } from "@/domain/invoice-fixtures";
import type { CanonicalInvoice, InvoiceStatus } from "@/domain/invoice";

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

function formatUnit(unit: CanonicalInvoice["lineItems"][number]["unit"]) {
  const unitLabels = {
    hour: "Std.",
    day: "Tag",
    piece: "Stück",
  };

  return unitLabels[unit];
}

function InvoicePreview({ invoice }: { invoice: CanonicalInvoice }) {
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
              {statusLabels[invoice.status]}
            </span>
            <span className="rounded-md bg-slate-950 px-3 py-1.5 text-sm font-medium text-white">
              {formatCurrency(invoice.totals.grossAmountCents)}
            </span>
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
                    {formatCurrency(item.quantity * item.unitPriceCents)}
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

      <InvoicePreview invoice={selectedInvoice} />
    </main>
  );
}
