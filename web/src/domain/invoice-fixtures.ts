import { calculateInvoiceTotals } from "./invoice-calculations";
import type { CanonicalInvoice, InvoiceLineItem } from "./invoice";

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

export const sampleInvoices: CanonicalInvoice[] = [
  {
    id: "inv_001",
    number: "RP-2026-001",
    status: "draft",
    issueDate: "2026-07-31",
    dueDate: "2026-08-14",
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
      name: "Musteragentur Berlin",
      street: "Invalidenstraße 45",
      postalCode: "10115",
      city: "Berlin",
      countryCode: "DE",
    },
    lineItems: rp2026001LineItems,
    totals: calculateInvoiceTotals(rp2026001LineItems),
  },
];
