import type { InvoiceStatus } from "@/domain/invoice";

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: "Entwurf",
  review_ready: "Prüfbereit",
  issued: "Ausgestellt",
  paid: "Bezahlt",
};
