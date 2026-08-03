import type { CanonicalInvoice } from "@/domain/invoice";
import { prisma } from "@/server/db/prisma";

import {
  toCanonicalInvoice,
  toPrismaInvoiceCreateInput,
  toPrismaInvoiceUpdateInput,
} from "./invoice-mapper";

export async function listInvoicesForUser(userId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map(toCanonicalInvoice);
}

export async function upsertInvoiceForUser(
  userId: string,
  invoice: CanonicalInvoice,
) {
  const savedInvoice = await prisma.invoice.upsert({
    where: {
      id: invoice.id,
    },
    create: toPrismaInvoiceCreateInput(userId, invoice),
    update: toPrismaInvoiceUpdateInput(invoice),
  });

  return toCanonicalInvoice(savedInvoice);
}

export async function deleteInvoicesForUser(userId: string) {
  await prisma.invoice.deleteMany({
    where: { userId },
  });
}
