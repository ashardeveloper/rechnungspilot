import { calculateInvoiceTotals } from "./invoice-calculations";
import type { CanonicalInvoice, InvoiceLineItem } from "./invoice";

function padInvoiceSequence(sequence: number) {
  return String(sequence).padStart(3, "0");
}

function getNextInvoiceSequence(invoices: CanonicalInvoice[]) {
  const sequences = invoices
    .map((invoice) => invoice.number.match(/^RP-2026-(\d+)$/)?.[1])
    .filter((sequence): sequence is string => Boolean(sequence))
    .map(Number);

  return Math.max(0, ...sequences) + 1;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function createDraftInvoice(
  invoices: CanonicalInvoice[],
  invoiceNumber?: string,
): CanonicalInvoice {
  const today = new Date();
  const lineItems: InvoiceLineItem[] = [
    {
      description: "Neue Leistung",
      quantity: 1,
      unit: "hour",
      unitPriceCents: 10000,
      vatCategory: "standard",
      vatRatePercent: 19,
    },
  ];

  return {
    id: `inv_${crypto.randomUUID()}`,
    number:
      invoiceNumber ??
      `RP-2026-${padInvoiceSequence(getNextInvoiceSequence(invoices))}`,
    status: "draft",
    issueDate: formatIsoDate(today),
    dueDate: formatIsoDate(addDays(today, 14)),
    currency: "EUR",
    seller: {
      name: "RechnungsPilot Demo",
      street: "Musterstraße 12",
      postalCode: "10115",
      city: "Berlin",
      countryCode: "DE",
      taxNumber: "12/345/67890",
    },
    buyer: {
      name: "Neuer Kunde",
      street: "Adresse ergänzen",
      postalCode: "00000",
      city: "Ort ergänzen",
      countryCode: "DE",
    },
    lineItems,
    totals: calculateInvoiceTotals(lineItems),
  };
}
