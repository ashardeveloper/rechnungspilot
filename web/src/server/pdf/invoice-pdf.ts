import PDFDocument from "pdfkit";

import type { CanonicalInvoice } from "@/domain/invoice";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(date));
}

export async function renderInvoicePdf(invoice: CanonicalInvoice) {
  const document = new PDFDocument({
    size: "A4",
    margin: 56,
    info: {
      Title: `Rechnung ${invoice.number}`,
      Author: "RechnungsPilot DE",
    },
  });

  const chunks: Buffer[] = [];

  document.on("data", (chunk: Buffer) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
  });

  document.fontSize(10).fillColor("#0891b2").text("RechnungsPilot DE");
  document.moveDown(0.4);
  document.fontSize(22).fillColor("#0f172a").text(`Rechnung ${invoice.number}`);
  document.moveDown(0.5);
  document
    .fontSize(10)
    .fillColor("#475569")
    .text(`Ausgestellt am ${formatDate(invoice.issueDate)}`)
    .text(`Fällig am ${formatDate(invoice.dueDate)}`);

  document.moveDown(2);

  const partyTop = document.y;

  document.fontSize(11).fillColor("#0f172a").text("Von", 56, partyTop);
  document
    .fontSize(10)
    .fillColor("#475569")
    .text(invoice.seller.name)
    .text(invoice.seller.street)
    .text(`${invoice.seller.postalCode} ${invoice.seller.city}`)
    .text("Deutschland");

  document.fontSize(11).fillColor("#0f172a").text("An", 320, partyTop);
  document
    .fontSize(10)
    .fillColor("#475569")
    .text(invoice.buyer.name, 320)
    .text(invoice.buyer.street)
    .text(`${invoice.buyer.postalCode} ${invoice.buyer.city}`)
    .text("Deutschland");

  document.moveDown(4);

  const tableTop = Math.max(document.y, 230);
  document.fontSize(10).fillColor("#0f172a");
  document.text("Leistung", 56, tableTop);
  document.text("Menge", 300, tableTop, { width: 60, align: "right" });
  document.text("Einzelpreis", 370, tableTop, { width: 80, align: "right" });
  document.text("Netto", 470, tableTop, { width: 70, align: "right" });

  document
    .moveTo(56, tableTop + 18)
    .lineTo(540, tableTop + 18)
    .strokeColor("#cbd5e1")
    .stroke();

  let y = tableTop + 32;

  invoice.lineItems.forEach((item) => {
    const netAmount = item.quantity * item.unitPriceCents;

    document.fillColor("#0f172a").text(item.description, 56, y, { width: 220 });
    document.fillColor("#475569").text(String(item.quantity), 300, y, {
      width: 60,
      align: "right",
    });
    document.text(formatCurrency(item.unitPriceCents), 370, y, {
      width: 80,
      align: "right",
    });
    document.fillColor("#0f172a").text(formatCurrency(netAmount), 470, y, {
      width: 70,
      align: "right",
    });

    y += 30;
  });

  y += 20;
  document.moveTo(350, y).lineTo(540, y).strokeColor("#cbd5e1").stroke();
  y += 12;

  document.fillColor("#475569").text("Netto", 370, y);
  document.text(formatCurrency(invoice.totals.netAmountCents), 470, y, {
    width: 70,
    align: "right",
  });

  y += 20;
  document.text("Umsatzsteuer", 370, y);
  document.text(formatCurrency(invoice.totals.vatAmountCents), 470, y, {
    width: 70,
    align: "right",
  });

  y += 24;
  document.fontSize(12).fillColor("#0f172a").text("Gesamtbetrag", 370, y);
  document.text(formatCurrency(invoice.totals.grossAmountCents), 470, y, {
    width: 70,
    align: "right",
  });

  document.end();

  return done;
}
