import { redirect } from "next/navigation";

import { listDemoInvoicesAction } from "@/app/actions/invoice-actions";
import { auth } from "@/server/auth/auth";

import { InvoiceWorkspaceClient } from "./invoice-workspace-client";
import { listCustomersAction } from "@/app/actions/customer-actions";
import { AppShell } from "@/components/layout/app-shell";

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [invoices, customers] = await Promise.all([
    listDemoInvoicesAction(),
    listCustomersAction(),
  ]);

  return (
    <AppShell
      title="Rechnungen"
      description="Rechnungen erstellen, prüfen, ausstellen und als PDF herunterladen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <InvoiceWorkspaceClient
        initialInvoices={invoices}
        customers={customers}
        userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      />
    </AppShell>
  );
}
