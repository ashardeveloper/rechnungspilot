export type InvoiceStatus = "draft" | "review_ready" | "issued" | "paid";

export type GermanVatCategory = "standard" | "reduced" | "exempt";

export type InvoiceParty = {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: "DE";
  vatId?: string;
  taxNumber?: string;
};

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unit: "hour" | "day" | "piece";
  unitPriceCents: number;
  vatCategory: GermanVatCategory;
  vatRatePercent: 0 | 7 | 19;
};

export type InvoiceTotals = {
  netAmountCents: number;
  vatAmountCents: number;
  grossAmountCents: number;
};

export type CanonicalInvoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  seller: InvoiceParty;
  buyer: InvoiceParty;
  lineItems: InvoiceLineItem[];
  totals: InvoiceTotals;
  currency: "EUR";
  paymentReference?: string;
  notes?: string;
};
