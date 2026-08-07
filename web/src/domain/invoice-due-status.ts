import type { CanonicalInvoice } from "./invoice";

export type InvoiceDueStatus =
  | "draft"
  | "open"
  | "due_soon"
  | "overdue"
  | "paid";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from: Date, to: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) /
      millisecondsPerDay,
  );
}

export function getInvoiceDueStatus(
  invoice: CanonicalInvoice,
  today = new Date(),
): InvoiceDueStatus {
  if (invoice.status === "paid") {
    return "paid";
  }

  if (invoice.status === "draft") {
    return "draft";
  }

  const daysUntilDue = daysBetween(today, new Date(invoice.dueDate));

  if (daysUntilDue < 0) {
    return "overdue";
  }

  if (daysUntilDue <= 7) {
    return "due_soon";
  }

  return "open";
}

export function getInvoiceDueStatusLabel(status: InvoiceDueStatus) {
  const labels: Record<InvoiceDueStatus, string> = {
    draft: "Entwurf",
    open: "Offen",
    due_soon: "Bald fällig",
    overdue: "Überfällig",
    paid: "Bezahlt",
  };

  return labels[status];
}
