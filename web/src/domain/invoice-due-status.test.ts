import { describe, expect, it } from "vitest";

import { sampleInvoices } from "./invoice-fixtures";
import { getInvoiceDueStatus } from "./invoice-due-status";

describe("invoice due status", () => {
  it("keeps drafts out of due tracking", () => {
    expect(getInvoiceDueStatus(sampleInvoices[0], new Date("2026-08-20"))).toBe(
      "draft",
    );
  });

  it("marks issued invoices as overdue after due date", () => {
    expect(
      getInvoiceDueStatus(
        {
          ...sampleInvoices[1],
          status: "issued",
          dueDate: "2026-08-01",
        },
        new Date("2026-08-07"),
      ),
    ).toBe("overdue");
  });

  it("marks issued invoices as due soon within seven days", () => {
    expect(
      getInvoiceDueStatus(
        {
          ...sampleInvoices[1],
          status: "issued",
          dueDate: "2026-08-10",
        },
        new Date("2026-08-07"),
      ),
    ).toBe("due_soon");
  });

  it("marks paid invoices as paid regardless of due date", () => {
    expect(getInvoiceDueStatus(sampleInvoices[2], new Date("2026-08-20"))).toBe(
      "paid",
    );
  });
});
