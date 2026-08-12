import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/server/auth/current-user";
import { createInvoiceAuditEvent } from "@/server/invoices/invoice-audit-repository";
import { listInvoicesForUser } from "@/server/invoices/invoice-repository";
import { renderXRechnungXml } from "@/server/xrechnung/xrechnung-xml";

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
      { error: "Only issued invoices can be downloaded as XML." },
      { status: 409 },
    );
  }

  const xml = renderXRechnungXml(invoice);

  await createInvoiceAuditEvent({
    invoiceId: invoice.id,
    userId,
    type: "xrechnung_downloaded",
    message: `Technischer XRechnung-XML-Entwurf für Rechnung ${invoice.number} wurde heruntergeladen.`,
  });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${invoice.number}-xrechnung-draft.xml"`,
    },
  });
}
