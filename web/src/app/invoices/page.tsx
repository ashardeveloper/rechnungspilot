import { redirect } from "next/navigation";

import { listDemoInvoicesAction } from "@/app/actions/invoice-actions";
import { auth } from "@/server/auth/auth";

import { InvoiceWorkspaceClient } from "./invoice-workspace-client";
import { listCustomersAction } from "@/app/actions/customer-actions";

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
    <InvoiceWorkspaceClient
      initialInvoices={invoices}
      customers={customers}
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
    />
  );
}
