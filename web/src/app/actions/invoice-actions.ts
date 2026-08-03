"use server";

import { createDraftInvoice } from "@/domain/invoice-factory";
import type { CanonicalInvoice } from "@/domain/invoice";
import { demoUserId, ensureDemoUser } from "@/server/demo/demo-user";
import { seedDemoInvoices } from "@/server/demo/seed-demo-invoices";
import {
  deleteInvoicesForUser,
  listInvoicesForUser,
  upsertInvoiceForUser,
} from "@/server/invoices/invoice-repository";

export async function listDemoInvoicesAction() {
  await ensureDemoUser();

  const invoices = await listInvoicesForUser(demoUserId);

  if (invoices.length > 0) {
    return invoices;
  }

  await seedDemoInvoices();

  return listInvoicesForUser(demoUserId);
}

export async function createDraftInvoiceAction() {
  await ensureDemoUser();

  const invoices = await listInvoicesForUser(demoUserId);
  const draftInvoice = createDraftInvoice(invoices);

  await upsertInvoiceForUser(demoUserId, draftInvoice);

  return listInvoicesForUser(demoUserId);
}

export async function updateInvoiceAction(invoice: CanonicalInvoice) {
  await ensureDemoUser();
  await upsertInvoiceForUser(demoUserId, invoice);

  return listInvoicesForUser(demoUserId);
}

export async function resetDemoInvoicesAction() {
  await ensureDemoUser();
  await deleteInvoicesForUser(demoUserId);
  await seedDemoInvoices();

  return listInvoicesForUser(demoUserId);
}
