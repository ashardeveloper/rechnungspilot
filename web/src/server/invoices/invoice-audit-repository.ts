import type { InvoiceAuditEvent } from "@/domain/invoice-audit";
import { prisma } from "@/server/db/prisma";

function toInvoiceAuditEvent(event: {
  id: string;
  invoiceId: string;
  type: string;
  message: string;
  createdAt: Date;
}): InvoiceAuditEvent {
  return {
    id: event.id,
    invoiceId: event.invoiceId,
    type: event.type as InvoiceAuditEvent["type"],
    message: event.message,
    createdAt: event.createdAt.toISOString(),
  };
}

export async function createInvoiceAuditEvent({
  invoiceId,
  userId,
  type,
  message,
}: {
  invoiceId: string;
  userId: string;
  type: InvoiceAuditEvent["type"];
  message: string;
}) {
  const event = await prisma.invoiceAuditEvent.create({
    data: {
      id: `audit_${crypto.randomUUID()}`,
      invoiceId,
      userId,
      type,
      message,
    },
  });

  return toInvoiceAuditEvent(event);
}

export async function listInvoiceAuditEventsForUser(
  userId: string,
  invoiceId: string,
) {
  const events = await prisma.invoiceAuditEvent.findMany({
    where: {
      userId,
      invoiceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return events.map(toInvoiceAuditEvent);
}
