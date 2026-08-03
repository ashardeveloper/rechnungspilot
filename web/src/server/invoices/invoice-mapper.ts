import type { Invoice as PrismaInvoice } from "@/generated/prisma/client";

import type {
  CanonicalInvoice,
  InvoiceLineItem,
  InvoiceParty,
} from "@/domain/invoice";

function parseJsonField<T>(value: string, fieldName: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`Invalid invoice JSON field: ${fieldName}`);
  }
}

export function toCanonicalInvoice(invoice: PrismaInvoice): CanonicalInvoice {
  return {
    id: invoice.id,
    number: invoice.number,
    status: invoice.status as CanonicalInvoice["status"],
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    currency: invoice.currency as CanonicalInvoice["currency"],
    seller: parseJsonField<InvoiceParty>(invoice.sellerJson, "sellerJson"),
    buyer: parseJsonField<InvoiceParty>(invoice.buyerJson, "buyerJson"),
    lineItems: parseJsonField<InvoiceLineItem[]>(
      invoice.lineItemsJson,
      "lineItemsJson",
    ),
    totals: {
      netAmountCents: invoice.netAmountCents,
      vatAmountCents: invoice.vatAmountCents,
      grossAmountCents: invoice.grossAmountCents,
    },
  };
}

export function toPrismaInvoiceCreateInput(
  userId: string,
  invoice: CanonicalInvoice,
) {
  return {
    id: invoice.id,
    userId,
    number: invoice.number,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    sellerJson: JSON.stringify(invoice.seller),
    buyerJson: JSON.stringify(invoice.buyer),
    lineItemsJson: JSON.stringify(invoice.lineItems),
    netAmountCents: invoice.totals.netAmountCents,
    vatAmountCents: invoice.totals.vatAmountCents,
    grossAmountCents: invoice.totals.grossAmountCents,
  };
}

export function toPrismaInvoiceUpdateInput(invoice: CanonicalInvoice) {
  return {
    number: invoice.number,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    sellerJson: JSON.stringify(invoice.seller),
    buyerJson: JSON.stringify(invoice.buyer),
    lineItemsJson: JSON.stringify(invoice.lineItems),
    netAmountCents: invoice.totals.netAmountCents,
    vatAmountCents: invoice.totals.vatAmountCents,
    grossAmountCents: invoice.totals.grossAmountCents,
  };
}
