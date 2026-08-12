import { describe, expect, it } from "vitest";

import { sampleInvoices } from "@/domain/invoice-fixtures";

import { renderXRechnungXml } from "./xrechnung-xml";

describe("xrechnung xml renderer", () => {
  it("renders a technical XML draft from a canonical invoice", () => {
    const invoice = sampleInvoices[0];
    const xml = renderXRechnungXml(invoice);

    expect(xml).toContain("technical XML draft");
    expect(xml).toContain("not legal certification");
    expect(xml).toContain("<ram:ID>RP-2026-001</ram:ID>");
    expect(xml).toContain(invoice.seller.name);
    expect(xml).toContain(invoice.buyer.name);
    expect(xml).toContain(invoice.lineItems[0].description);
    expect(xml).toContain(
      "<ram:GrandTotalAmount>1428.00</ram:GrandTotalAmount>",
    );
    expect(xml).toContain(
      '<ram:TaxTotalAmount currencyID="EUR">228.00</ram:TaxTotalAmount>',
    );
  });
});
