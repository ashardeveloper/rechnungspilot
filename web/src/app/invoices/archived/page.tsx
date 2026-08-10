import { redirect } from "next/navigation";

import { listArchivedInvoicesAction } from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { ArchivedInvoicesClient } from "./archived-invoices-client";

export default async function ArchivedInvoicesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await listArchivedInvoicesAction();

  return (
    <AppShell
      title="Archiv"
      description="Archivierte Rechnungen prüfen und wiederherstellen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <ArchivedInvoicesClient initialInvoices={invoices} />
    </AppShell>
  );
}
