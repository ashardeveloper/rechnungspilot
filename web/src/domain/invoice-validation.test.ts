import { describe, expect, it } from "vitest";

import { sampleInvoices } from "./invoice-fixtures";
import { validateInvoice } from "./invoice-validation";

describe("invoice validation", () => {
  it("accepts a complete fixture invoice", () => {
    expect(validateInvoice(sampleInvoices[0])).toEqual([]);
  });

  it("requires buyer name and at least one line item", () => {
    const invoice = {
      ...sampleInvoices[0],
      buyer: {
        ...sampleInvoices[0].buyer,
        name: "",
      },
      lineItems: [],
    };

    expect(validateInvoice(invoice)).toEqual(
      expect.arrayContaining([
        {
          field: "buyer.name",
          message: "Kundenname fehlt.",
        },
        {
          field: "lineItems",
          message: "Mindestens eine Rechnungsposition ist erforderlich.",
        },
      ]),
    );
  });

  it("rejects invalid line quantities", () => {
    const invoice = {
      ...sampleInvoices[0],
      lineItems: [
        {
          ...sampleInvoices[0].lineItems[0],
          quantity: 0,
        },
      ],
    };

    expect(validateInvoice(invoice)).toContainEqual({
      field: "lineItems.0.quantity",
      message: "Menge für Position 1 muss größer als 0 sein.",
    });
  });
});
