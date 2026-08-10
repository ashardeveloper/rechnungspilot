import { redirect } from "next/navigation";

import {
  listDemoInvoicesAction,
  searchInvoicesAction,
} from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { InvoiceListClient } from "./invoice-list-client";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await listDemoInvoicesAction();

  const params = await searchParams;
  const result = await searchInvoicesAction({
    query: params.q,
    status: params.status,
  });

  return (
    <AppShell
      title="Rechnungen"
      description="Rechnungen suchen, prüfen und öffnen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <InvoiceListClient
        initialInvoices={result.invoices}
        initialNextCursor={result.nextCursor}
        initialQuery={params.q ?? ""}
        initialStatus={params.status ?? "all"}
      />
    </AppShell>
  );
}
