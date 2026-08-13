import { NextResponse } from "next/server";

import { renderInvoicePdf } from "@/server/pdf/invoice-pdf";
import { getCurrentUserId } from "@/server/auth/current-user";
import { listInvoicesForUser } from "@/server/invoices/invoice-repository";
import { createInvoiceAuditEvent } from "@/server/invoices/invoice-audit-repository";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const userId = await getCurrentUserId();
  const { invoiceId } = await params;
  const invoices = await listInvoicesForUser(userId);
  const invoice = invoices.find((item) => item.id === invoiceId);

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  if (invoice.status !== "issued" && invoice.status !== "paid") {
    return NextResponse.json(
      { error: "Only issued invoices can be downloaded as PDF." },
      { status: 409 },
    );
  }

  const pdf = await renderInvoicePdf(invoice);

  await createInvoiceAuditEvent({
    invoiceId: invoice.id,
    userId,
    type: "pdf_downloaded",
    message: `PDF für Rechnung ${invoice.number} wurde heruntergeladen.`,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
    },
  });
}
