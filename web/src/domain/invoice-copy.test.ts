import { describe, expect, it } from "vitest";

import { sampleInvoices } from "./invoice-fixtures";
import { copyInvoiceAsDraft } from "./invoice-factory";

describe("invoice copy", () => {
  it("copies an invoice as a new draft", () => {
    const copiedInvoice = copyInvoiceAsDraft(sampleInvoices[0], "RP-2026-999");

    expect(copiedInvoice.id).not.toBe(sampleInvoices[0].id);
    expect(copiedInvoice.number).toBe("RP-2026-999");
    expect(copiedInvoice.status).toBe("draft");
    expect(copiedInvoice.buyer).toEqual(sampleInvoices[0].buyer);
    expect(copiedInvoice.lineItems).toEqual(sampleInvoices[0].lineItems);
  });
});
