import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getCustomerAction,
  updateCustomerAction,
} from "@/app/actions/customer-actions";
import { searchInvoicesAction } from "@/app/actions/invoice-actions";
import { formatCurrency, formatDate } from "@/components/invoices/formatting";
import { invoiceStatusLabels } from "@/components/invoices/invoice-status";
import { AppShell } from "@/components/layout/app-shell";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/server/auth/auth";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { customerId } = await params;
  const customer = await getCustomerAction(customerId);

  if (!customer) {
    notFound();
  }

  const invoiceResult = await searchInvoicesAction({
    query: customer.name,
  });

  return (
    <AppShell
      title="Kundendetails"
      description="Stammdaten prüfen und zugehörige Rechnungen öffnen."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/customers"
    >
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-6 lg:grid-cols-[420px_1fr]">
        <form
          action={updateCustomerAction}
          className="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <Link
              href="/customers"
              className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
            >
              ← Zurück zur Kundenliste
            </Link>
            <h2 className="mt-3 text-xl font-semibold">{customer.name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              Wiederverwendbare Rechnungsempfänger-Stammdaten.
            </p>
          </div>

          <input type="hidden" name="id" value={customer.id} />

          <div className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="text-sm text-slate-600">Name</span>
              <input
                name="name"
                defaultValue={customer.name}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Straße</span>
              <input
                name="street"
                defaultValue={customer.street}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
              <label className="block">
                <span className="text-sm text-slate-600">PLZ</span>
                <input
                  name="postalCode"
                  defaultValue={customer.postalCode}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Ort</span>
                <input
                  name="city"
                  defaultValue={customer.city}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-slate-600">USt-IdNr.</span>
              <input
                name="vatId"
                defaultValue={customer.vatId}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Steuernummer</span>
              <input
                name="taxNumber"
                defaultValue={customer.taxNumber}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <SubmitButton>Änderungen speichern</SubmitButton>
          </div>
        </form>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-xl font-semibold">Rechnungen dieses Kunden</h2>
            <p className="mt-1 text-sm text-slate-600">
              Aktive Rechnungen mit Treffer auf diesen Kundennamen.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {invoiceResult.invoices.length > 0 ? (
              invoiceResult.invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoices/${invoice.id}`}
                  className="grid gap-3 px-5 py-4 text-sm hover:bg-slate-50 sm:grid-cols-[1fr_120px_120px_120px]"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {invoice.number}
                    </p>
                    <p className="mt-1 text-slate-600">{invoice.buyer.name}</p>
                  </div>
                  <span className="text-slate-600">
                    {formatDate(invoice.dueDate)}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(invoice.totals.grossAmountCents)}
                  </span>
                  <span className="text-slate-600">
                    {invoiceStatusLabels[invoice.status]}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-5 py-8 text-sm text-slate-600">
                Für diesen Kunden wurden noch keine aktiven Rechnungen gefunden.
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
