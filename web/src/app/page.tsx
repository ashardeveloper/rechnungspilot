import { listDemoInvoicesAction } from "@/app/actions/invoice-actions";

import { InvoiceWorkspaceClient } from "./invoice-workspace-client";

export default async function Home() {
  const invoices = await listDemoInvoicesAction();

  return <InvoiceWorkspaceClient initialInvoices={invoices} />;
}
