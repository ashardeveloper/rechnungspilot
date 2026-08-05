import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getInvoiceNumberSettingsAction,
  updateInvoiceNumberSettingsAction,
} from "@/app/actions/settings-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/server/auth/auth";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const settings = await getInvoiceNumberSettingsAction();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              RechnungsPilot DE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Einstellungen
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Nummernkreis für neue Rechnungen konfigurieren.
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

      <section className="mx-auto max-w-xl px-6 py-8">
        <form
          action={updateInvoiceNumberSettingsAction}
          className="rounded-lg border border-slate-200 bg-white"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Rechnungsnummern</h2>
            <p className="mt-1 text-sm text-slate-600">
              Neue Rechnungen werden aus Präfix, Jahr und laufender Nummer
              erzeugt.
            </p>
          </div>

          <div className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="text-sm text-slate-600">Präfix</span>
              <input
                name="prefix"
                defaultValue={settings.prefix}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Jahr</span>
              <input
                name="year"
                type="number"
                defaultValue={settings.year}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">
                Nächste laufende Nummer
              </span>
              <input
                name="nextSequence"
                type="number"
                min="1"
                defaultValue={settings.nextSequence}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Vorschau: {settings.prefix}-{settings.year}-
              {String(settings.nextSequence).padStart(3, "0")}
            </div>

            <SubmitButton>Einstellungen speichern</SubmitButton>
          </div>
        </form>
      </section>
    </main>
  );
}
