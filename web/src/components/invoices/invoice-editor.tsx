import { calculateInvoiceTotals } from "@/domain/invoice-calculations";
import type { CanonicalInvoice, InvoiceLineItem } from "@/domain/invoice";
import { validateInvoice } from "@/domain/invoice-validation";

type InvoiceEditorProps = {
  invoice: CanonicalInvoice;
  onUpdateInvoice: (invoice: CanonicalInvoice) => void;
};

function centsToEuroInput(cents: number) {
  return (cents / 100).toFixed(2);
}

function euroInputToCents(value: string) {
  return Math.round(Number.parseFloat(value || "0") * 100);
}

export function InvoiceEditor({
  invoice,
  onUpdateInvoice,
}: InvoiceEditorProps) {
  const firstLineItem = invoice.lineItems[0];
  const validationIssues = validateInvoice(invoice);

  function updateBuyer(field: keyof CanonicalInvoice["buyer"], value: string) {
    onUpdateInvoice({
      ...invoice,
      buyer: {
        ...invoice.buyer,
        [field]: value,
      },
    });
  }

  function updateFirstLineItem(updatedLineItem: InvoiceLineItem) {
    const lineItems = [updatedLineItem, ...invoice.lineItems.slice(1)];

    onUpdateInvoice({
      ...invoice,
      lineItems,
      totals: calculateInvoiceTotals(lineItems),
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-8">
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold">Rechnung bearbeiten</h2>
          <p className="mt-1 text-sm text-slate-600">
            Lokale Bearbeitung der wichtigsten MVP-Felder. Beträge werden aus
            Positionen neu berechnet.
          </p>
        </div>

        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Technische Prüfhinweise
          </h3>
          {validationIssues.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {validationIssues.map((issue) => (
                <li key={issue.field} className="text-sm text-amber-700">
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-emerald-700">
              Keine technischen Pflichtfeld-Hinweise für diese Demo-Prüfung.
            </p>
          )}
        </div>

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Kunde</h3>

            <label className="block">
              <span className="text-sm text-slate-600">Name</span>
              <input
                value={invoice.buyer.name}
                onChange={(event) => updateBuyer("name", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Straße</span>
              <input
                value={invoice.buyer.street}
                onChange={(event) => updateBuyer("street", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
              <label className="block">
                <span className="text-sm text-slate-600">PLZ</span>
                <input
                  value={invoice.buyer.postalCode}
                  onChange={(event) =>
                    updateBuyer("postalCode", event.target.value)
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Ort</span>
                <input
                  value={invoice.buyer.city}
                  onChange={(event) => updateBuyer("city", event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>

          {firstLineItem ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Erste Position
              </h3>

              <label className="block">
                <span className="text-sm text-slate-600">Beschreibung</span>
                <input
                  value={firstLineItem.description}
                  onChange={(event) =>
                    updateFirstLineItem({
                      ...firstLineItem,
                      description: event.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-600">Menge</span>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={firstLineItem.quantity}
                    onChange={(event) =>
                      updateFirstLineItem({
                        ...firstLineItem,
                        quantity: Number.parseFloat(event.target.value || "0"),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">
                    Einzelpreis EUR
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={centsToEuroInput(firstLineItem.unitPriceCents)}
                    onChange={(event) =>
                      updateFirstLineItem({
                        ...firstLineItem,
                        unitPriceCents: euroInputToCents(event.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
