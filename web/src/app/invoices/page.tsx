import { redirect } from "next/navigation";

import {
  listDemoInvoicesAction,
  searchInvoicesAction,
  countArchivedInvoicesAction,
} from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { InvoiceListClient } from "./invoice-list-client";
import type { InvoiceStatus } from "@/domain/invoice";

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
  const status =
    params.status === "draft" ||
    params.status === "review_ready" ||
    params.status === "issued" ||
    params.status === "paid"
      ? params.status
      : "all";
  const [result, archivedCount] = await Promise.all([
    searchInvoicesAction({
      query: params.q,
      status,
    }),
    countArchivedInvoicesAction(),
  ]);

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
        initialStatus={status}
        archivedCount={archivedCount}
      />
    </AppShell>
  );
}
