import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { searchCustomersAction } from "@/app/actions/customer-actions";
import { listDemoInvoicesAction } from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { CustomerManagementClient } from "./customer-management-client";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;

  const [result, invoices] = await Promise.all([
    searchCustomersAction({ query: params.q }),
    listDemoInvoicesAction(),
  ]);

  return (
    <AppShell
      title="Kunden"
      description="Kunden verwalten und für Rechnungen auswählen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/customers"
    >
      <section className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="flex justify-end">
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm"
          >
            <Plus size={16} />
            Neuer Kunde
          </Link>
        </div>

        <CustomerManagementClient
          initialCustomers={result.customers}
          initialNextCursor={result.nextCursor}
          initialQuery={params.q ?? ""}
          invoices={invoices}
        />
      </section>
    </AppShell>
  );
}
