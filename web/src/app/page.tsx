import { redirect } from "next/navigation";

import { listDemoInvoicesAction } from "@/app/actions/invoice-actions";
import { auth } from "@/server/auth/auth";

import { InvoiceWorkspaceClient } from "./invoice-workspace-client";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await listDemoInvoicesAction();

  return <InvoiceWorkspaceClient initialInvoices={invoices} />;
}
