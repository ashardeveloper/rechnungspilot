import type { CanonicalInvoice } from "@/domain/invoice";

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(date));
}

export function formatUnit(
  unit: CanonicalInvoice["lineItems"][number]["unit"],
) {
  const unitLabels = {
    hour: "Std.",
    day: "Tag",
    piece: "Stück",
  };

  return unitLabels[unit];
}
