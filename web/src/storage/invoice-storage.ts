import type { CanonicalInvoice } from "@/domain/invoice";

const invoiceStorageKey = "rechnungspilot.invoices.v1";

export function loadInvoicesFromStorage(fallback: CanonicalInvoice[]) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(invoiceStorageKey);

  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue) as CanonicalInvoice[];
  } catch {
    return fallback;
  }
}

export function saveInvoicesToStorage(invoices: CanonicalInvoice[]) {
  window.localStorage.setItem(invoiceStorageKey, JSON.stringify(invoices));
}

export function clearStoredInvoices() {
  window.localStorage.removeItem(invoiceStorageKey);
}
