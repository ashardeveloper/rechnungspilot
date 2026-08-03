import type { CanonicalInvoice } from "./invoice";

export type InvoiceValidationIssue = {
  field: string;
  message: string;
};

function isBlank(value: string) {
  return value.trim().length === 0;
}

export function validateInvoice(invoice: CanonicalInvoice) {
  const issues: InvoiceValidationIssue[] = [];

  if (isBlank(invoice.number)) {
    issues.push({
      field: "number",
      message: "Rechnungsnummer fehlt.",
    });
  }

  if (isBlank(invoice.seller.name)) {
    issues.push({
      field: "seller.name",
      message: "Absendername fehlt.",
    });
  }

  if (isBlank(invoice.buyer.name)) {
    issues.push({
      field: "buyer.name",
      message: "Kundenname fehlt.",
    });
  }

  if (isBlank(invoice.buyer.street)) {
    issues.push({
      field: "buyer.street",
      message: "Kundenstraße fehlt.",
    });
  }

  if (isBlank(invoice.buyer.postalCode)) {
    issues.push({
      field: "buyer.postalCode",
      message: "Kunden-PLZ fehlt.",
    });
  }

  if (isBlank(invoice.buyer.city)) {
    issues.push({
      field: "buyer.city",
      message: "Kundenort fehlt.",
    });
  }

  if (invoice.lineItems.length === 0) {
    issues.push({
      field: "lineItems",
      message: "Mindestens eine Rechnungsposition ist erforderlich.",
    });
  }

  invoice.lineItems.forEach((lineItem, index) => {
    if (isBlank(lineItem.description)) {
      issues.push({
        field: `lineItems.${index}.description`,
        message: `Beschreibung für Position ${index + 1} fehlt.`,
      });
    }

    if (lineItem.quantity <= 0) {
      issues.push({
        field: `lineItems.${index}.quantity`,
        message: `Menge für Position ${index + 1} muss größer als 0 sein.`,
      });
    }

    if (lineItem.unitPriceCents < 0) {
      issues.push({
        field: `lineItems.${index}.unitPriceCents`,
        message: `Einzelpreis für Position ${index + 1} darf nicht negativ sein.`,
      });
    }
  });

  return issues;
}
