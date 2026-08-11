"use server";

import {
  createDraftInvoice,
  copyInvoiceAsDraft,
} from "@/domain/invoice-factory";
import type { CanonicalInvoice } from "@/domain/invoice";
import { getCurrentUserId } from "@/server/auth/current-user";
import { seedDemoInvoices } from "@/server/demo/seed-demo-invoices";
import {
  archiveInvoiceForUser,
  createInvoiceForUser,
  deleteInvoicesForUser,
  listInvoicesForUser,
  searchInvoicesForUser,
  getInvoiceForUser,
  updateInvoiceForUser,
  listArchivedInvoicesForUser,
  restoreInvoiceForUser,
  countArchivedInvoicesForUser,
} from "@/server/invoices/invoice-repository";
import { reserveNextInvoiceNumber } from "@/server/settings/invoice-number-settings-repository";
import { createInvoiceAuditEvent } from "@/server/invoices/invoice-audit-repository";
import { getBusinessProfileForUser } from "@/server/settings/business-profile-repository";

export async function listDemoInvoicesAction() {
  const userId = await getCurrentUserId();

  const invoices = await listInvoicesForUser(userId);

  if (invoices.length > 0) {
    return invoices;
  }

  await seedDemoInvoices();

  return listInvoicesForUser(userId);
}

export async function searchInvoicesAction(input: {
  query?: string;
  status?: string;
  cursor?: string;
}) {
  const userId = await getCurrentUserId();

  return searchInvoicesForUser({
    userId,
    query: input.query,
    status: input.status,
    cursor: input.cursor,
  });
}

export async function getInvoiceAction(invoiceId: string) {
  const userId = await getCurrentUserId();

  return getInvoiceForUser(userId, invoiceId);
}

export async function createDraftInvoiceAction() {
  const userId = await getCurrentUserId();

  const invoices = await listInvoicesForUser(userId);
  const invoiceNumber = await reserveNextInvoiceNumber(userId);
  const seller = await getBusinessProfileForUser(userId);
  const draftInvoice = createDraftInvoice(invoices, invoiceNumber, seller);

  await createInvoiceForUser(userId, draftInvoice);

  await createInvoiceAuditEvent({
    invoiceId: draftInvoice.id,
    userId,
    type: "created",
    message: `Rechnung ${draftInvoice.number} wurde erstellt.`,
  });

  return listInvoicesForUser(userId);
}

export async function updateInvoiceAction(invoice: CanonicalInvoice) {
  const userId = await getCurrentUserId();

  const existingInvoices = await listInvoicesForUser(userId);
  const existingInvoice = existingInvoices.find(
    (item) => item.id === invoice.id,
  );

  await updateInvoiceForUser(userId, invoice);

  await createInvoiceAuditEvent({
    invoiceId: invoice.id,
    userId,
    type:
      existingInvoice && existingInvoice.status !== invoice.status
        ? "status_changed"
        : "updated",
    message:
      existingInvoice && existingInvoice.status !== invoice.status
        ? `Status geändert: ${existingInvoice.status} -> ${invoice.status}.`
        : `Rechnung ${invoice.number} wurde aktualisiert.`,
  });

  return listInvoicesForUser(userId);
}

export async function archiveInvoiceAction(invoiceId: string) {
  const userId = await getCurrentUserId();

  const archivedInvoice = await archiveInvoiceForUser(userId, invoiceId);

  if (!archivedInvoice) {
    throw new Error("Invoice not found.");
  }

  await createInvoiceAuditEvent({
    invoiceId,
    userId,
    type: "archived",
    message: `Rechnung ${archivedInvoice.number} wurde archiviert.`,
  });

  return listInvoicesForUser(userId);
}

export async function resetDemoInvoicesAction() {
  const userId = await getCurrentUserId();

  await deleteInvoicesForUser(userId);
  await seedDemoInvoices();

  return listInvoicesForUser(userId);
}

export async function listArchivedInvoicesAction() {
  const userId = await getCurrentUserId();

  return listArchivedInvoicesForUser(userId);
}

export async function restoreInvoiceAction(invoiceId: string) {
  const userId = await getCurrentUserId();

  const invoice = await restoreInvoiceForUser(userId, invoiceId);

  if (invoice) {
    await createInvoiceAuditEvent({
      invoiceId,
      userId,
      type: "updated",
      message: `Rechnung ${invoice.number} wurde wiederhergestellt.`,
    });
  }

  return listArchivedInvoicesForUser(userId);
}

export async function countArchivedInvoicesAction() {
  const userId = await getCurrentUserId();

  return countArchivedInvoicesForUser(userId);
}

export async function copyInvoiceAsDraftAction(invoiceId: string) {
  const userId = await getCurrentUserId();

  const sourceInvoice = await getInvoiceForUser(userId, invoiceId);

  if (!sourceInvoice) {
    throw new Error("Invoice not found.");
  }

  const invoiceNumber = await reserveNextInvoiceNumber(userId);
  const draftInvoice = copyInvoiceAsDraft(sourceInvoice, invoiceNumber);

  await createInvoiceForUser(userId, draftInvoice);

  await createInvoiceAuditEvent({
    invoiceId: draftInvoice.id,
    userId,
    type: "created",
    message: `Rechnung ${draftInvoice.number} wurde aus ${sourceInvoice.number} kopiert.`,
  });

  return draftInvoice;
}
