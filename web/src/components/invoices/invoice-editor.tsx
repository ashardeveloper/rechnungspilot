"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, PencilLine, Plus } from "lucide-react";

import { customerToInvoiceParty, type Customer } from "@/domain/customer";
import { calculateInvoiceTotals } from "@/domain/invoice-calculations";
import type { CanonicalInvoice, InvoiceLineItem } from "@/domain/invoice";
import { validateInvoice } from "@/domain/invoice-validation";

type InvoiceEditorProps = {
  invoice: CanonicalInvoice;
  customers: Customer[];
  onSaveInvoice: (invoice: CanonicalInvoice) => void;
  onCancelEdit: () => void;
};

function centsToEuroInput(cents: number) {
  return (cents / 100).toFixed(2);
}

function euroInputToCents(value: string) {
  return Math.round(Number.parseFloat(value.replace(",", ".") || "0") * 100);
}

export function InvoiceEditor({
  invoice,
  customers,
  onSaveInvoice,
  onCancelEdit,
}: InvoiceEditorProps) {
  const [draftInvoice, setDraftInvoice] = useState(invoice);
  const [customerQuery, setCustomerQuery] = useState("");
  const [isCustomerPickerOpen, setIsCustomerPickerOpen] = useState(false);

  const validationIssues = validateInvoice(draftInvoice);

  const selectedCustomer = customers.find(
    (customer) => customer.name === draftInvoice.buyer.name,
  );

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();

    if (!query) {
      return customers.slice(0, 5);
    }

    return customers
      .filter((customer) =>
        [customer.name, customer.city, customer.street, customer.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 8);
  }, [customers, customerQuery]);

  function updateDraft(nextLineItems: InvoiceLineItem[]) {
    setDraftInvoice({
      ...draftInvoice,
      lineItems: nextLineItems,
      totals: calculateInvoiceTotals(nextLineItems),
    });
  }

  function selectCustomer(customerId: string) {
    const customer = customers.find((item) => item.id === customerId);

    if (!customer) {
      return;
    }

    setCustomerQuery("");
    setIsCustomerPickerOpen(false);

    setDraftInvoice({
      ...draftInvoice,
      buyer: customerToInvoiceParty(customer),
    });
  }

  function updateBuyer(field: keyof CanonicalInvoice["buyer"], value: string) {
    setDraftInvoice({
      ...draftInvoice,
      buyer: {
        ...draftInvoice.buyer,
        [field]: value,
      },
    });
  }

  function addLineItem() {
    updateDraft([
      ...draftInvoice.lineItems,
      {
        description: "",
        quantity: 1,
        unit: "hour",
        unitPriceCents: 0,
        vatCategory: "standard",
        vatRatePercent: 19,
      },
    ]);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 print:hidden">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 px-5 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <PencilLine size={20} />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Rechnung bearbeiten
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Lokale Bearbeitung der wichtigsten MVP-Felder. Beträge werden aus
              Positionen neu berechnet.
            </p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div
            className={
              validationIssues.length > 0
                ? "rounded-lg border border-amber-200 bg-amber-50 px-4 py-4"
                : "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4"
            }
          >
            <div className="flex gap-4">
              <span
                className={
                  validationIssues.length > 0
                    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                }
              >
                <CheckCircle2 size={24} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  Technische Prüfhinweise
                </h3>

                {validationIssues.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {validationIssues.map((issue) => (
                      <li key={issue.field} className="text-sm text-amber-800">
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-emerald-700">
                    Keine technischen Pflichtfeld-Hinweise für diese
                    Demo-Prüfung.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-slate-200 px-5 py-5 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-950">Kunde</h3>

            <div className="relative">
              <label className="block">
                <span className="text-sm text-slate-600">
                  Kunde suchen oder auswählen
                </span>
                <input
                  value={customerQuery}
                  onFocus={() => setIsCustomerPickerOpen(true)}
                  onChange={(event) => {
                    setCustomerQuery(event.target.value);
                    setIsCustomerPickerOpen(true);
                  }}
                  placeholder="Kunde suchen oder auswählen..."
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>

              {isCustomerPickerOpen ? (
                <div className="absolute z-20 mt-2 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-200 px-3 py-2 text-xs font-medium text-slate-500">
                    Zuletzt verwendet / Kunden
                  </div>

                  {filteredCustomers.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto py-1">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => selectCustomer(customer.id)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-cyan-50"
                        >
                          <span className="block font-medium text-slate-950">
                            {customer.name}
                          </span>
                          <span className="block text-slate-600">
                            {customer.postalCode} {customer.city} ·{" "}
                            {customer.street}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-3 text-sm text-slate-600">
                      Kein Kunde gefunden.
                    </div>
                  )}
                </div>
              ) : null}

              {selectedCustomer ? (
                <p className="mt-2 text-sm font-medium text-emerald-700">
                  Ausgewählt: {selectedCustomer.name}
                </p>
              ) : null}
            </div>

            <label className="block">
              <span className="text-sm text-slate-600">Name</span>
              <input
                value={draftInvoice.buyer.name}
                onChange={(event) => updateBuyer("name", event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Straße</span>
              <input
                value={draftInvoice.buyer.street}
                onChange={(event) => updateBuyer("street", event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
              <label className="block">
                <span className="text-sm text-slate-600">PLZ</span>
                <input
                  value={draftInvoice.buyer.postalCode}
                  onChange={(event) =>
                    updateBuyer("postalCode", event.target.value)
                  }
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Ort</span>
                <input
                  value={draftInvoice.buyer.city}
                  onChange={(event) => updateBuyer("city", event.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-950">
                Positionen
              </h3>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus size={16} />
                Position hinzufügen
              </button>
            </div>

            <div className="space-y-4">
              {draftInvoice.lineItems.map((lineItem, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">
                      Position {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const lineItems = draftInvoice.lineItems.filter(
                          (_, itemIndex) => itemIndex !== index,
                        );

                        updateDraft(lineItems);
                      }}
                      disabled={draftInvoice.lineItems.length === 1}
                      className="text-sm font-medium text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Entfernen
                    </button>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm text-slate-600">Beschreibung</span>
                    <input
                      value={lineItem.description}
                      onChange={(event) => {
                        const lineItems = draftInvoice.lineItems.map(
                          (item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, description: event.target.value }
                              : item,
                        );

                        updateDraft(lineItems);
                      }}
                      className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                    />
                  </label>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-sm text-slate-600">Menge</span>
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={lineItem.quantity}
                        onChange={(event) => {
                          const lineItems = draftInvoice.lineItems.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    quantity: Number.parseFloat(
                                      event.target.value || "0",
                                    ),
                                  }
                                : item,
                          );

                          updateDraft(lineItems);
                        }}
                        className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm text-slate-600">Einheit</span>
                      <select
                        value={lineItem.unit}
                        onChange={(event) => {
                          const lineItems = draftInvoice.lineItems.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    unit: event.target
                                      .value as typeof item.unit,
                                  }
                                : item,
                          );

                          updateDraft(lineItems);
                        }}
                        className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                      >
                        <option value="hour">Std.</option>
                        <option value="day">Tag</option>
                        <option value="piece">Stück</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm text-slate-600">
                        Einzelpreis EUR
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={centsToEuroInput(lineItem.unitPriceCents)}
                        onChange={(event) => {
                          const lineItems = draftInvoice.lineItems.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    unitPriceCents: euroInputToCents(
                                      event.target.value,
                                    ),
                                  }
                                : item,
                          );

                          updateDraft(lineItems);
                        }}
                        className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={() => onSaveInvoice(draftInvoice)}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Änderungen speichern
          </button>

          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </section>
  );
}
