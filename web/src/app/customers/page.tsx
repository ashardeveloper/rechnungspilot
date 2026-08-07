import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createCustomerAction,
  searchCustomersAction,
  updateCustomerAction,
} from "@/app/actions/customer-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/server/auth/auth";
import { CustomerManagementClient } from "./customer-management-client";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; selected?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const result = await searchCustomersAction({ query: params.q });
  const customers = result.customers;

  const selectedCustomer =
    customers.find((customer) => customer.id === params.selected) ??
    customers[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              RechnungsPilot DE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Kunden</h1>
            <p className="mt-1 text-sm text-slate-600">
              Stammdaten für wiederverwendbare Rechnungsempfänger.
            </p>
          </div>
          <Link
            href="/invoices"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Zu Rechnungen
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <CustomerManagementClient
          initialCustomers={customers}
          initialNextCursor={result.nextCursor}
          initialQuery={params.q ?? ""}
        />

        <aside className="space-y-6">
          <form
            action={createCustomerAction}
            className="rounded-lg border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Kunde anlegen</h2>
            </div>

            <CustomerFields />
            <div className="px-5 pb-5">
              <SubmitButton>Kunde speichern</SubmitButton>
            </div>
          </form>

          {selectedCustomer ? (
            <form
              action={updateCustomerAction}
              className="rounded-lg border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold">Kunde bearbeiten</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedCustomer.name}
                </p>
              </div>

              <input type="hidden" name="id" value={selectedCustomer.id} />
              <CustomerFields customer={selectedCustomer} />
              <div className="px-5 pb-5">
                <SubmitButton>Änderungen speichern</SubmitButton>
              </div>
            </form>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function CustomerFields({
  customer,
}: {
  customer?: {
    name?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    vatId?: string;
    taxNumber?: string;
  };
}) {
  return (
    <div className="space-y-4 px-5 py-5">
      <label className="block">
        <span className="text-sm text-slate-600">Name</span>
        <input
          name="name"
          defaultValue={customer?.name}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-600">Straße</span>
        <input
          name="street"
          defaultValue={customer?.street}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
        <label className="block">
          <span className="text-sm text-slate-600">PLZ</span>
          <input
            name="postalCode"
            defaultValue={customer?.postalCode}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Ort</span>
          <input
            name="city"
            defaultValue={customer?.city}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-600">USt-IdNr.</span>
        <input
          name="vatId"
          defaultValue={customer?.vatId}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-600">Steuernummer</span>
        <input
          name="taxNumber"
          defaultValue={customer?.taxNumber}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}
