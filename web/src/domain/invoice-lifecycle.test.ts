import { describe, expect, it } from "vitest";

import { sampleInvoices } from "./invoice-fixtures";
import {
  canTransitionInvoiceToStatus,
  getInvoiceStatusTransitions,
  transitionInvoiceStatus,
} from "./invoice-lifecycle";

describe("invoice lifecycle", () => {
  it("allows a valid draft invoice to become review-ready", () => {
    const invoice = sampleInvoices[0];

    expect(canTransitionInvoiceToStatus(invoice, "review_ready")).toBe(true);
    expect(transitionInvoiceStatus(invoice, "review_ready").status).toBe(
      "review_ready",
    );
  });

  it("blocks review-ready transition when required fields are missing", () => {
    const invoice = {
      ...sampleInvoices[0],
      buyer: {
        ...sampleInvoices[0].buyer,
        name: "",
      },
    };

    expect(canTransitionInvoiceToStatus(invoice, "review_ready")).toBe(false);
    expect(transitionInvoiceStatus(invoice, "review_ready").status).toBe(
      "draft",
    );
  });

  it("exposes blocked reasons for disabled UI actions", () => {
    const invoice = sampleInvoices[0];
    const transitions = getInvoiceStatusTransitions(invoice);

    expect(transitions).toContainEqual({
      targetStatus: "draft",
      label: "Als Entwurf markieren",
      blockedReason: "Rechnung ist bereits ein Entwurf.",
    });
  });
});
