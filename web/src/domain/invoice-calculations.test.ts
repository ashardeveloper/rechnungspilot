import { describe, expect, it } from "vitest";

import {
  calculateInvoiceTotals,
  calculateLineNetAmountCents,
  calculateLineVatAmountCents,
} from "./invoice-calculations";
import type { InvoiceLineItem } from "./invoice";

const standardVatLineItem: InvoiceLineItem = {
  description: "Beratung",
  quantity: 6,
  unit: "hour",
  unitPriceCents: 20000,
  vatCategory: "standard",
  vatRatePercent: 19,
};

describe("invoice calculations", () => {
  it("calculates line net amount in cents", () => {
    expect(calculateLineNetAmountCents(standardVatLineItem)).toBe(120000);
  });

  it("calculates line VAT amount in cents", () => {
    expect(calculateLineVatAmountCents(standardVatLineItem)).toBe(22800);
  });

  it("calculates invoice totals from line items", () => {
    expect(calculateInvoiceTotals([standardVatLineItem])).toEqual({
      netAmountCents: 120000,
      vatAmountCents: 22800,
      grossAmountCents: 142800,
    });
  });
});
