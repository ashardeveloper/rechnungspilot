import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createCustomerAction,
  listCustomersAction,
  updateCustomerAction,
} from "@/app/actions/customer-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/server/auth/auth";

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
  const query = params.q?.trim().toLowerCase() ?? "";
  const customers = await listCustomersAction();

  const filteredCustomers = customers
    .filter((customer) =>
      [customer.name, customer.city, customer.street]
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
    .slice(0, 25);

  const selectedCustomer =
    customers.find((customer) => customer.id === params.selected) ??
    filteredCustomers[0];

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
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Kundenliste</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {customers.length} Kundendatensätze im Workspace.
                </p>
              </div>

              <form className="w-full sm:w-80">
                <input
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Kunden suchen..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </form>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/customers?${new URLSearchParams({
                  ...(params.q ? { q: params.q } : {}),
                  selected: customer.id,
                })}`}
                className={`grid gap-2 px-5 py-4 text-sm hover:bg-cyan-50 sm:grid-cols-[1fr_1fr_auto] ${
                  selectedCustomer?.id === customer.id ? "bg-cyan-50" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-slate-950">{customer.name}</p>
                  <p className="text-slate-600">
                    {customer.postalCode} {customer.city}
                  </p>
                </div>
                <p className="text-slate-600">{customer.street}</p>
                <span className="text-right text-slate-500">Bearbeiten</span>
              </Link>
            ))}

            {filteredCustomers.length === 0 ? (
              <div className="px-5 py-8 text-sm text-slate-600">
                Kein Kunde gefunden.
              </div>
            ) : null}
          </div>

          {customers.length > 25 ? (
            <div className="border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
              Es werden maximal 25 Treffer angezeigt. Suche verfeinern für mehr
              Präzision.
            </div>
          ) : null}
        </div>

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
