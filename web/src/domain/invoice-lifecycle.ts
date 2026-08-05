import type { CanonicalInvoice, InvoiceStatus } from "./invoice";
import { validateInvoice } from "./invoice-validation";

export type InvoiceStatusTransition = {
  targetStatus: InvoiceStatus;
  label: string;
  blockedReason?: string;
};

const transitionLabels: Record<InvoiceStatus, string> = {
  draft: "Als Entwurf markieren",
  review_ready: "Als prüfbereit markieren",
  paid: "Als bezahlt markieren",
  issued: "Rechnung ausstellen",
};

export function getInvoiceStatusTransitions(
  invoice: CanonicalInvoice,
): InvoiceStatusTransition[] {
  const validationIssues = validateInvoice(invoice);
  const hasValidationIssues = validationIssues.length > 0;

  return [
    {
      targetStatus: "draft",
      label: transitionLabels.draft,
      blockedReason:
        invoice.status === "draft"
          ? "Rechnung ist bereits ein Entwurf."
          : invoice.status === "issued" || invoice.status === "paid"
            ? "Ausgestellte oder bezahlte Rechnungen können nicht zurück in den Entwurf."
            : undefined,
    },
    {
      targetStatus: "review_ready",
      label: transitionLabels.review_ready,
      blockedReason:
        invoice.status === "review_ready"
          ? "Rechnung ist bereits prüfbereit."
          : invoice.status === "issued" || invoice.status === "paid"
            ? "Ausgestellte oder bezahlte Rechnungen können nicht erneut geprüft werden."
            : hasValidationIssues
              ? "Pflichtfelder müssen vor der technischen Prüfung vollständig sein."
              : undefined,
    },
    {
      targetStatus: "issued",
      label: transitionLabels.issued,
      blockedReason:
        invoice.status === "issued"
          ? "Rechnung ist bereits ausgestellt."
          : invoice.status === "paid"
            ? "Bezahlte Rechnungen sind bereits abgeschlossen."
            : invoice.status !== "review_ready"
              ? "Nur prüfbereite Rechnungen können ausgestellt werden."
              : undefined,
    },
    {
      targetStatus: "paid",
      label: transitionLabels.paid,
      blockedReason:
        invoice.status === "paid"
          ? "Rechnung ist bereits bezahlt."
          : invoice.status !== "issued"
            ? "Nur ausgestellte Rechnungen können als bezahlt markiert werden."
            : undefined,
    },
  ];
}

export function canTransitionInvoiceToStatus(
  invoice: CanonicalInvoice,
  targetStatus: InvoiceStatus,
) {
  const transition = getInvoiceStatusTransitions(invoice).find(
    (item) => item.targetStatus === targetStatus,
  );

  return Boolean(transition && !transition.blockedReason);
}

export function transitionInvoiceStatus(
  invoice: CanonicalInvoice,
  targetStatus: InvoiceStatus,
): CanonicalInvoice {
  if (!canTransitionInvoiceToStatus(invoice, targetStatus)) {
    return invoice;
  }

  return {
    ...invoice,
    status: targetStatus,
  };
}
