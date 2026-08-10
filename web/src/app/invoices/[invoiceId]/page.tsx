import { notFound, redirect } from "next/navigation";

import { listCustomersAction } from "@/app/actions/customer-actions";
import { getInvoiceAction } from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { InvoiceDetailClient } from "./invoice-detail-client";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { invoiceId } = await params;

  const [invoice, customers] = await Promise.all([
    getInvoiceAction(invoiceId),
    listCustomersAction(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <AppShell
      title="Rechnungsdetails"
      description="Rechnung bearbeiten, Status steuern und PDF herunterladen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <InvoiceDetailClient invoice={invoice} customers={customers} />
    </AppShell>
  );
}
