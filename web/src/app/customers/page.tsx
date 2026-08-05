import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createCustomerAction,
  listCustomersAction,
} from "@/app/actions/customer-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/server/auth/auth";

export default async function CustomersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const customers = await listCustomersAction();

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

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          action={createCustomerAction}
          className="rounded-lg border border-slate-200 bg-white"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Kunde anlegen</h2>
            <p className="mt-1 text-sm text-slate-600">
              Neue Kunden stehen anschließend in der Rechnungssuche zur Auswahl.
            </p>
          </div>

          <div className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="text-sm text-slate-600">Name</span>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Straße</span>
              <input
                name="street"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
              <label className="block">
                <span className="text-sm text-slate-600">PLZ</span>
                <input
                  name="postalCode"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Ort</span>
                <input
                  name="city"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">USt-IdNr.</span>
                <input
                  name="vatId"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Steuernummer</span>
                <input
                  name="taxNumber"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <SubmitButton>Kunde speichern</SubmitButton>
          </div>
        </form>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Gespeicherte Kunden</h2>
            <p className="mt-1 text-sm text-slate-600">
              {customers.length} Kundendatensätze im aktuellen Workspace.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {customers.map((customer) => (
              <div key={customer.id} className="px-5 py-4">
                <p className="font-medium">{customer.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {customer.street}, {customer.postalCode} {customer.city}
                </p>
                {customer.vatId ? (
                  <p className="mt-1 text-sm text-slate-500">
                    USt-IdNr. {customer.vatId}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
