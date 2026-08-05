"use server";

import { createDraftInvoice } from "@/domain/invoice-factory";
import type { CanonicalInvoice } from "@/domain/invoice";
import { getCurrentUserId } from "@/server/auth/current-user";
import { seedDemoInvoices } from "@/server/demo/seed-demo-invoices";
import {
  createInvoiceForUser,
  deleteInvoicesForUser,
  listInvoicesForUser,
  updateInvoiceForUser,
} from "@/server/invoices/invoice-repository";
import { reserveNextInvoiceNumber } from "@/server/settings/invoice-number-settings-repository";

export async function listDemoInvoicesAction() {
  const userId = await getCurrentUserId();

  const invoices = await listInvoicesForUser(userId);

  if (invoices.length > 0) {
    return invoices;
  }

  await seedDemoInvoices();

  return listInvoicesForUser(userId);
}

export async function createDraftInvoiceAction() {
  const userId = await getCurrentUserId();

  const invoices = await listInvoicesForUser(userId);
  const invoiceNumber = await reserveNextInvoiceNumber(userId);
  const draftInvoice = createDraftInvoice(invoices, invoiceNumber);

  await createInvoiceForUser(userId, draftInvoice);

  return listInvoicesForUser(userId);
}

export async function updateInvoiceAction(invoice: CanonicalInvoice) {
  const userId = await getCurrentUserId();

  await updateInvoiceForUser(userId, invoice);

  return listInvoicesForUser(userId);
}

export async function resetDemoInvoicesAction() {
  const userId = await getCurrentUserId();

  await deleteInvoicesForUser(userId);
  await seedDemoInvoices();

  return listInvoicesForUser(userId);
}
