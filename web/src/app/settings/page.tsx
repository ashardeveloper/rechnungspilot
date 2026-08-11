import { redirect } from "next/navigation";
import { Eye, Hash, Save, UserRound } from "lucide-react";

import {
  getBusinessProfileAction,
  getInvoiceNumberSettingsAction,
  updateBusinessProfileAction,
  updateInvoiceNumberSettingsAction,
} from "@/app/actions/settings-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [settings, businessProfile] = await Promise.all([
    getInvoiceNumberSettingsAction(),
    getBusinessProfileAction(),
  ]);

  const invoiceNumberPreview = `${settings.prefix}-${settings.year}-${String(
    settings.nextSequence,
  ).padStart(3, "0")}`;

  return (
    <AppShell
      title="Einstellungen"
      description="Nummernkreis und Absenderprofil für neue Rechnungen konfigurieren."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/settings"
    >
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-2">
        <form
          action={updateInvoiceNumberSettingsAction}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <Hash size={30} />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Rechnungsnummern
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Neue Rechnungen werden aus Präfix, Jahr und laufender Nummer
                erzeugt.
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-slate-200" />

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Präfix</span>
              <input
                name="prefix"
                defaultValue={settings.prefix}
                required
                className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-600">Jahr</span>
              <input
                name="year"
                type="number"
                defaultValue={settings.year}
                required
                className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-600">
                Nächste laufende Nummer
              </span>
              <input
                name="nextSequence"
                type="number"
                min="1"
                defaultValue={settings.nextSequence}
                required
                className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-slate-700">
              <Eye size={20} className="text-blue-700" />
              <span>Vorschau:</span>
              <strong className="text-slate-950">{invoiceNumberPreview}</strong>
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <Save size={18} />
              Einstellungen speichern
            </button>
          </div>
        </form>

        <form
          action={updateBusinessProfileAction}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <UserRound size={30} />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Absenderprofil
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Diese Daten werden in neue Rechnungsentwürfe übernommen.
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-slate-200" />

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Name</span>
              <input
                name="name"
                defaultValue={businessProfile.name}
                required
                className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-600">Straße</span>
              <input
                name="street"
                defaultValue={businessProfile.street}
                required
                className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-[0.8fr_1fr]">
              <label className="block">
                <span className="text-sm font-medium text-slate-600">PLZ</span>
                <input
                  name="postalCode"
                  defaultValue={businessProfile.postalCode}
                  required
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-600">Ort</span>
                <input
                  name="city"
                  defaultValue={businessProfile.city}
                  required
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-600">
                  Steuernummer
                </span>
                <input
                  name="taxNumber"
                  defaultValue={businessProfile.taxNumber}
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-600">
                  USt-IdNr.
                </span>
                <input
                  name="vatId"
                  defaultValue={businessProfile.vatId}
                  placeholder="Optional"
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 px-4 text-sm shadow-sm outline-none focus:border-slate-500"
                />
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <UserRound size={18} />
              Absenderprofil speichern
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
