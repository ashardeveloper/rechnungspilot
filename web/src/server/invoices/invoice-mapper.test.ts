import { describe, expect, it } from "vitest";

import { sampleInvoices } from "@/domain/invoice-fixtures";

import {
  toCanonicalInvoice,
  toPrismaInvoiceCreateInput,
} from "./invoice-mapper";

describe("invoice mapper", () => {
  it("round-trips a canonical invoice through JSON-backed database fields", () => {
    const invoice = sampleInvoices[0];
    const createInput = toPrismaInvoiceCreateInput("user_123", invoice);

    const roundTripped = toCanonicalInvoice({
      ...createInput,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(roundTripped).toEqual(invoice);
  });
});
