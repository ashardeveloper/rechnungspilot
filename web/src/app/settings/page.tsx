import { redirect } from "next/navigation";

import {
  getBusinessProfileAction,
  getInvoiceNumberSettingsAction,
  updateBusinessProfileAction,
  updateInvoiceNumberSettingsAction,
} from "@/app/actions/settings-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/server/auth/auth";
import { AppShell } from "@/components/layout/app-shell";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [settings, businessProfile] = await Promise.all([
    getInvoiceNumberSettingsAction(),
    getBusinessProfileAction(),
  ]);

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
        <form
          action={updateBusinessProfileAction}
          className="rounded-lg border border-slate-200 bg-white"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Absenderprofil</h2>
            <p className="mt-1 text-sm text-slate-600">
              Diese Daten werden in neue Rechnungsentwürfe übernommen.
            </p>
          </div>

          <div className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="text-sm text-slate-600">Name</span>
              <input
                name="name"
                defaultValue={businessProfile.name}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Straße</span>
              <input
                name="street"
                defaultValue={businessProfile.street}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
              <label className="block">
                <span className="text-sm text-slate-600">PLZ</span>
                <input
                  name="postalCode"
                  defaultValue={businessProfile.postalCode}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Ort</span>
                <input
                  name="city"
                  defaultValue={businessProfile.city}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Steuernummer</span>
                <input
                  name="taxNumber"
                  defaultValue={businessProfile.taxNumber}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">USt-IdNr.</span>
                <input
                  name="vatId"
                  defaultValue={businessProfile.vatId}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <SubmitButton>Absenderprofil speichern</SubmitButton>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
