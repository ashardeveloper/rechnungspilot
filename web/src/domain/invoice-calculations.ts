import type { InvoiceLineItem, InvoiceTotals } from "./invoice";

function roundCents(value: number) {
  return Math.round(value);
}

export function calculateLineNetAmountCents(lineItem: InvoiceLineItem) {
  return roundCents(lineItem.quantity * lineItem.unitPriceCents);
}

export function calculateLineVatAmountCents(lineItem: InvoiceLineItem) {
  return roundCents(
    calculateLineNetAmountCents(lineItem) * (lineItem.vatRatePercent / 100),
  );
}

export function calculateInvoiceTotals(
  lineItems: InvoiceLineItem[],
): InvoiceTotals {
  const netAmountCents = lineItems.reduce(
    (sum, lineItem) => sum + calculateLineNetAmountCents(lineItem),
    0,
  );

  const vatAmountCents = lineItems.reduce(
    (sum, lineItem) => sum + calculateLineVatAmountCents(lineItem),
    0,
  );

  return {
    netAmountCents,
    vatAmountCents,
    grossAmountCents: netAmountCents + vatAmountCents,
  };
}
