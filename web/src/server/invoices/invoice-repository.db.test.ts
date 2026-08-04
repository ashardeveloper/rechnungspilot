import { describe, expect, it } from "vitest";

import { createDraftInvoice } from "@/domain/invoice-factory";
import { sampleInvoices } from "@/domain/invoice-fixtures";
import { prisma } from "@/server/db/prisma";
import { ensureDemoUser, demoUserId } from "@/server/demo/demo-user";

import {
  createInvoiceForUser,
  deleteInvoicesForUser,
  listInvoicesForUser,
  updateInvoiceForUser,
} from "./invoice-repository";

describe("invoice repository authorization", () => {
  it("only updates invoices owned by the current user", async () => {
    await ensureDemoUser();
    await deleteInvoicesForUser(demoUserId);

    const invoice = createDraftInvoice(sampleInvoices);
    await createInvoiceForUser(demoUserId, invoice);

    const otherUser = await prisma.user.upsert({
      where: { id: "other_user" },
      create: {
        id: "other_user",
        email: "other@rechnungspilot.local",
        name: "Other User",
      },
      update: {},
    });

    await expect(
      updateInvoiceForUser(otherUser.id, {
        ...invoice,
        buyer: {
          ...invoice.buyer,
          name: "Should Not Update",
        },
      }),
    ).rejects.toThrow("Invoice not found.");

    const invoices = await listInvoicesForUser(demoUserId);

    expect(invoices[0].buyer.name).not.toBe("Should Not Update");

    await deleteInvoicesForUser(demoUserId);
    await prisma.user.delete({
      where: { id: otherUser.id },
    });
  });
});
