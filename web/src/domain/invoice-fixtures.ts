import { calculateInvoiceTotals } from "./invoice-calculations";
import type { CanonicalInvoice, InvoiceLineItem } from "./invoice";

const seller = {
  name: "RechnungsPilot Demo",
  street: "Musterstraße 12",
  postalCode: "10115",
  city: "Berlin",
  countryCode: "DE",
  taxNumber: "12/345/67890",
} satisfies CanonicalInvoice["seller"];

const rp2026001LineItems: InvoiceLineItem[] = [
  {
    description: "Beratung und Umsetzung",
    quantity: 6,
    unit: "hour",
    unitPriceCents: 20000,
    vatCategory: "standard",
    vatRatePercent: 19,
  },
];

const rp2026002LineItems: InvoiceLineItem[] = [
  {
    description: "Workshop zur Prozessaufnahme",
    quantity: 1,
    unit: "day",
    unitPriceCents: 72000,
    vatCategory: "standard",
    vatRatePercent: 19,
  },
  {
    description: "Dokumentation der Rechnungspflichtangaben",
    quantity: 2,
    unit: "hour",
    unitPriceCents: 9000,
    vatCategory: "standard",
    vatRatePercent: 19,
  },
];

const rp2026003LineItems: InvoiceLineItem[] = [
  {
    description: "Wartung bestehender Vorlagen",
    quantity: 3,
    unit: "hour",
    unitPriceCents: 8500,
    vatCategory: "standard",
    vatRatePercent: 19,
  },
  {
    description: "Layoutanpassung PDF-Ansicht",
    quantity: 1,
    unit: "piece",
    unitPriceCents: 32000,
    vatCategory: "standard",
    vatRatePercent: 19,
  },
];

export const sampleInvoices: CanonicalInvoice[] = [
  {
    id: "inv_001",
    number: "RP-2026-001",
    status: "draft",
    issueDate: "2026-07-31",
    dueDate: "2026-08-14",
    currency: "EUR",
    seller,
    buyer: {
      name: "Musteragentur Berlin",
      street: "Invalidenstraße 45",
      postalCode: "10115",
      city: "Berlin",
      countryCode: "DE",
    },
    lineItems: rp2026001LineItems,
    totals: calculateInvoiceTotals(rp2026001LineItems),
  },
  {
    id: "inv_002",
    number: "RP-2026-002",
    status: "review_ready",
    issueDate: "2026-08-01",
    dueDate: "2026-08-21",
    currency: "EUR",
    seller,
    buyer: {
      name: "Schneider IT Beratung",
      street: "Hansaallee 8",
      postalCode: "60322",
      city: "Frankfurt am Main",
      countryCode: "DE",
      vatId: "DE123456789",
    },
    lineItems: rp2026002LineItems,
    totals: calculateInvoiceTotals(rp2026002LineItems),
  },
  {
    id: "inv_003",
    number: "RP-2026-003",
    status: "paid",
    issueDate: "2026-07-10",
    dueDate: "2026-07-28",
    currency: "EUR",
    seller,
    buyer: {
      name: "Atelier Nord GmbH",
      street: "Kanalstraße 19",
      postalCode: "20359",
      city: "Hamburg",
      countryCode: "DE",
    },
    lineItems: rp2026003LineItems,
    totals: calculateInvoiceTotals(rp2026003LineItems),
  },
];
