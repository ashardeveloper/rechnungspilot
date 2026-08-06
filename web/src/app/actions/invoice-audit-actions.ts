"use server";

import { getCurrentUserId } from "@/server/auth/current-user";
import { listInvoiceAuditEventsForUser } from "@/server/invoices/invoice-audit-repository";

export async function listInvoiceAuditEventsAction(invoiceId: string) {
  const userId = await getCurrentUserId();

  return listInvoiceAuditEventsForUser(userId, invoiceId);
}
