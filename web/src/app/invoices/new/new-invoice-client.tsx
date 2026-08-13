"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Plus, Search, Trash2 } from "lucide-react";

import { createInvoiceFromFormAction } from "@/app/actions/invoice-actions";
import { formatCurrency } from "@/components/invoices/formatting";
import type { Customer } from "@/domain/customer";
import type { InvoiceParty } from "@/domain/invoice";

type DraftLineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: "hour" | "day" | "piece";
  unitPrice: string;
  vatRate: 0 | 7 | 19;
};

type NewInvoiceClientProps = {
  customers: Customer[];
  seller: InvoiceParty;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  initialCustomerId?: string;
};

function centsFromPrice(value: string) {
  return Math.round(Number(value.replace(",", ".") || 0) * 100);
}

export function NewInvoiceClient({
  customers,
  seller,
  invoiceNumber,
  issueDate,
  dueDate,
  initialCustomerId,
}: NewInvoiceClientProps) {
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomerId &&
      customers.some((customer) => customer.id === initialCustomerId)
      ? initialCustomerId
      : "",
  );
  const [isCustomerPickerOpen, setIsCustomerPickerOpen] = useState(false);
  const [lineItems, setLineItems] = useState<DraftLineItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "hour",
      unitPrice: "",
      vatRate: 19,
    },
  ]);

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  const filteredCustomers = customers
    .filter((customer) => {
      const query = customerQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return [customer.name, customer.city, customer.street, customer.email]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    })
    .slice(0, 8);

  const totals = useMemo(() => {
    const netAmountCents = lineItems.reduce(
      (sum, item) => sum + item.quantity * centsFromPrice(item.unitPrice),
      0,
    );
    const vatAmountCents = lineItems.reduce(
      (sum, item) =>
        sum +
        Math.round(
          item.quantity * centsFromPrice(item.unitPrice) * (item.vatRate / 100),
        ),
      0,
    );

    return {
      netAmountCents,
      vatAmountCents,
      grossAmountCents: netAmountCents + vatAmountCents,
    };
  }, [lineItems]);

  const hasValidLineItem = lineItems.some(
    (item) =>
      item.description.trim() &&
      item.quantity > 0 &&
      centsFromPrice(item.unitPrice) > 0,
  );

  const canSubmit = Boolean(selectedCustomer && hasValidLineItem);

  function updateLineItem(id: string, patch: Partial<DraftLineItem>) {
    setLineItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }

  function addLineItem() {
    setLineItems((currentItems) => [
      ...currentItems,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit: "hour",
        unitPrice: "",
        vatRate: 19,
      },
    ]);
  }

  function removeLineItem(id: string) {
    setLineItems((currentItems) =>
      currentItems.length > 1
        ? currentItems.filter((item) => item.id !== id)
        : currentItems,
    );
  }

  return (
    <form action={createInvoiceFromFormAction}>
      <input type="hidden" name="customerId" value={selectedCustomerId} />

      <section className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft size={16} />
            Zurück zur Rechnungsübersicht
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/invoices"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              name="intent"
              value="draft"
              disabled={!canSubmit}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Als Entwurf speichern
            </button>
            <button
              type="submit"
              name="intent"
              value="review_ready"
              disabled={!canSubmit}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Als prüfbereit speichern
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold">Kunde</h2>
              </div>

              <div className="space-y-3 px-5 py-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={customerQuery}
                      onFocus={() => setIsCustomerPickerOpen(true)}
                      onChange={(event) => {
                        setCustomerQuery(event.target.value);
                        setIsCustomerPickerOpen(true);
                      }}
                      placeholder="Kunde suchen oder auswählen..."
                      className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm"
                    />

                    {isCustomerPickerOpen ? (
                      <div className="absolute z-20 mt-2 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(customer.id);
                              setCustomerQuery("");
                              setIsCustomerPickerOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
                          >
                            <span className="block font-medium">
                              {customer.name}
                            </span>
                            <span className="text-slate-600">
                              {customer.postalCode} {customer.city} ·{" "}
                              {customer.street}
                            </span>
                          </button>
                        ))}

                        {filteredCustomers.length === 0 ? (
                          <div className="px-3 py-3 text-sm text-slate-600">
                            Kein Kunde gefunden.
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <Link
                    href="/customers"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    <Plus size={16} />
                    Neuer Kunde
                  </Link>
                </div>

                {selectedCustomer ? (
                  <div className="rounded-lg border border-slate-200 px-4 py-3 text-sm">
                    <p className="font-semibold">{selectedCustomer.name}</p>
                    <div className="mt-2 grid gap-1 text-slate-600 sm:grid-cols-2">
                      <p>
                        {selectedCustomer.street}
                        <br />
                        {selectedCustomer.postalCode} {selectedCustomer.city}
                        <br />
                        Deutschland
                      </p>
                      <p>
                        {selectedCustomer.vatId
                          ? `USt-IdNr.: ${selectedCustomer.vatId}`
                          : "Keine USt-IdNr. hinterlegt"}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold">Rechnungsdaten</h2>
              </div>

              <div className="grid gap-4 px-5 py-4 md:grid-cols-4">
                <label className="block">
                  <span className="text-sm text-slate-600">
                    Rechnungsnummer
                  </span>
                  <input
                    name="numberPreview"
                    value={invoiceNumber}
                    readOnly
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">Rechnungsdatum</span>
                  <input
                    name="issueDate"
                    type="date"
                    defaultValue={issueDate}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">Fällig am</span>
                  <input
                    name="dueDate"
                    type="date"
                    defaultValue={dueDate}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                  />
                </label>

                <div>
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="mt-2 inline-flex rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    Entwurf
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold">Von</h2>
              </div>
              <div className="flex items-start justify-between gap-4 px-5 py-4 text-sm">
                <p className="leading-6">
                  <span className="font-semibold">{seller.name}</span>
                  <br />
                  {seller.street}
                  <br />
                  {seller.postalCode} {seller.city}
                  <br />
                  Deutschland
                  <br />
                  {seller.taxNumber ? `Steuernr.: ${seller.taxNumber}` : null}
                </p>
                <p className="text-right text-sm italic text-slate-500">
                  Unternehmensdaten aus den Einstellungen
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold">Positionen</h2>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Plus size={16} />
                  Position hinzufügen
                </button>
              </div>

              <div className="space-y-3 px-5 py-4">
                {lineItems.map((item) => {
                  const netCents =
                    item.quantity * centsFromPrice(item.unitPrice);

                  return (
                    <div
                      key={item.id}
                      className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1.5fr_90px_120px_120px_100px_90px_40px]"
                    >
                      <label>
                        <span className="text-xs font-medium text-slate-600">
                          Beschreibung
                        </span>
                        <input
                          name="description"
                          value={item.description}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              description: event.target.value,
                            })
                          }
                          className="mt-1 h-9 w-full rounded-md border border-slate-300 px-3 text-sm"
                        />
                      </label>

                      <label>
                        <span className="text-xs font-medium text-slate-600">
                          Menge
                        </span>
                        <input
                          name="quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              quantity: Number(event.target.value),
                            })
                          }
                          className="mt-1 h-9 w-full rounded-md border border-slate-300 px-3 text-sm"
                        />
                      </label>

                      <label>
                        <span className="text-xs font-medium text-slate-600">
                          Einheit
                        </span>
                        <select
                          name="unit"
                          value={item.unit}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              unit: event.target.value as DraftLineItem["unit"],
                            })
                          }
                          className="mt-1 h-9 w-full rounded-md border border-slate-300 px-3 text-sm"
                        >
                          <option value="hour">Std.</option>
                          <option value="day">Tag</option>
                          <option value="piece">Stück</option>
                        </select>
                      </label>

                      <label>
                        <span className="text-xs font-medium text-slate-600">
                          Einzelpreis EUR
                        </span>
                        <input
                          name="unitPrice"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              unitPrice: event.target.value,
                            })
                          }
                          className="mt-1 h-9 w-full rounded-md border border-slate-300 px-3 text-sm"
                        />
                      </label>

                      <label>
                        <span className="text-xs font-medium text-slate-600">
                          MwSt.
                        </span>
                        <select
                          name="vatRate"
                          value={item.vatRate}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              vatRate: Number(
                                event.target.value,
                              ) as DraftLineItem["vatRate"],
                            })
                          }
                          className="mt-1 h-9 w-full rounded-md border border-slate-300 px-3 text-sm"
                        >
                          <option value={19}>19 %</option>
                          <option value={7}>7 %</option>
                          <option value={0}>0 %</option>
                        </select>
                      </label>

                      <div>
                        <span className="text-xs font-medium text-slate-600">
                          Netto
                        </span>
                        <p className="mt-2 text-sm font-medium">
                          {formatCurrency(netCents)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}

                <div className="flex justify-end border-t border-slate-200 pt-3 text-sm">
                  <span className="mr-6 text-slate-600">Positionen netto</span>
                  <span className="font-semibold">
                    {formatCurrency(totals.netAmountCents)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold">Rechnungstext / Hinweise</h2>
              </div>
              <div className="px-5 py-4">
                <textarea
                  name="notes"
                  placeholder="Optionale Hinweise für diese Rechnung..."
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Zusammenfassung</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Netto</span>
                  <span>{formatCurrency(totals.netAmountCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Umsatzsteuer</span>
                  <span>{formatCurrency(totals.vatAmountCents)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Gesamtbetrag</span>
                    <span className="text-2xl font-semibold">
                      {formatCurrency(totals.grossAmountCents)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Technische Prüfhilfen</h2>
              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-center gap-2 font-medium text-emerald-700">
                  <CheckCircle2 size={18} />
                  Keine technischen Pflichtfeld-Hinweise.
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Kunde ausgewählt
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Mindestens eine Position vorhanden
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Rechnungsdatum gesetzt
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Fälligkeitsdatum gesetzt
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Statusvorschau</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Speicherstatus:</span>
                  <span>Noch nicht gespeichert</span>
                </div>
                <div className="flex justify-between">
                  <span>Zielstatus:</span>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700">
                    Entwurf
                  </span>
                </div>
                <p className="border-t border-slate-200 pt-4 text-slate-600">
                  Prüfbereit verfügbar, sobald alle Pflichtfelder vollständig
                  sind.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/invoices"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            name="intent"
            value="draft"
            disabled={!canSubmit}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Als Entwurf speichern
          </button>
          <button
            type="submit"
            name="intent"
            value="review_ready"
            disabled={!canSubmit}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Als prüfbereit speichern
          </button>
        </div>
      </section>
    </form>
  );
}
