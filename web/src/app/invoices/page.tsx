import { redirect } from "next/navigation";

import { listDemoInvoicesAction } from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { InvoiceListClient } from "./invoice-list-client";

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await listDemoInvoicesAction();

  return (
    <AppShell
      title="Rechnungen"
      description="Rechnungen suchen, prüfen und öffnen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <InvoiceListClient initialInvoices={invoices} />
    </AppShell>
  );
}
