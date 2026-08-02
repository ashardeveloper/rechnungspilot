import { describe, expect, it } from "vitest";

import { sampleInvoices } from "./invoice-fixtures";
import { createDraftInvoice } from "./invoice-factory";

describe("invoice factory", () => {
  it("creates the next draft invoice number", () => {
    const draftInvoice = createDraftInvoice(sampleInvoices);

    expect(draftInvoice.number).toBe("RP-2026-004");
    expect(draftInvoice.status).toBe("draft");
  });

  it("selects sane defaults for a German draft invoice", () => {
    const draftInvoice = createDraftInvoice(sampleInvoices);

    expect(draftInvoice.currency).toBe("EUR");
    expect(draftInvoice.seller.countryCode).toBe("DE");
    expect(draftInvoice.buyer.countryCode).toBe("DE");
    expect(draftInvoice.lineItems).toHaveLength(1);
    expect(draftInvoice.totals.grossAmountCents).toBe(11900);
  });
});
