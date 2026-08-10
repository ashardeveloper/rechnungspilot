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

export async function getInvoiceForUser(userId: string, invoiceId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId,
    },
  });

  return invoice ? toCanonicalInvoice(invoice) : null;
}
export async function createInvoiceForUser(
  userId: string,
  invoice: CanonicalInvoice,
) {
  const savedInvoice = await prisma.invoice.create({
    data: toPrismaInvoiceCreateInput(userId, invoice),
  });

  return toCanonicalInvoice(savedInvoice);
}

export async function updateInvoiceForUser(
  userId: string,
  invoice: CanonicalInvoice,
) {
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id: invoice.id,
      userId,
    },
  });

  if (!existingInvoice) {
    throw new Error("Invoice not found.");
  }

  const savedInvoice = await prisma.invoice.update({
    where: {
      id: existingInvoice.id,
    },
    data: toPrismaInvoiceUpdateInput(invoice),
  });

  return toCanonicalInvoice(savedInvoice);
}

export async function upsertInvoiceForUser(
  userId: string,
  invoice: CanonicalInvoice,
) {
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id: invoice.id,
      userId,
    },
  });

  if (existingInvoice) {
    return updateInvoiceForUser(userId, invoice);
  }

  return createInvoiceForUser(userId, invoice);
}

export async function deleteInvoicesForUser(userId: string) {
  await prisma.invoice.deleteMany({
    where: { userId },
  });
}
