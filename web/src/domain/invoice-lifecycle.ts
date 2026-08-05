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
          : undefined,
    },
    {
      targetStatus: "review_ready",
      label: transitionLabels.review_ready,
      blockedReason:
        invoice.status === "review_ready"
          ? "Rechnung ist bereits prüfbereit."
          : hasValidationIssues
            ? "Pflichtfelder müssen vor der technischen Prüfung vollständig sein."
            : undefined,
    },
    {
      targetStatus: "paid",
      label: transitionLabels.paid,
      blockedReason:
        invoice.status === "paid" ? "Rechnung ist bereits bezahlt." : undefined,
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
