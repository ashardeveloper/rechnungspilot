"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  FileText,
  MapPin,
  StickyNote,
} from "lucide-react";

import { createCustomerAndRedirectAction } from "@/app/actions/customer-actions";

export function NewCustomerClient() {
  const [name, setName] = useState("Atelier Nord GmbH");
  const [contactName, setContactName] = useState("Max Mustermann");
  const [email, setEmail] = useState("info@atelier-nord.de");
  const [phone, setPhone] = useState("+49 40 12345678");
  const [street, setStreet] = useState("Kanalstrasse 19");
  const [postalCode, setPostalCode] = useState("20359");
  const [city, setCity] = useState("Hamburg");
  const [vatId, setVatId] = useState("DE123456789");
  const [taxNumber, setTaxNumber] = useState("17/123/45678");
  const [paymentTermsDays, setPaymentTermsDays] = useState("14");
  const [defaultVatRatePercent, setDefaultVatRatePercent] = useState("19");
  const [internalNotes, setInternalNotes] = useState(
    "Bevorzugt PDF per E-Mail.\nAnsprechpartner ist Herr Max Mustermann.",
  );

  const requiredFieldsComplete = Boolean(
    name.trim() && street.trim() && postalCode.trim() && city.trim(),
  );

  return (
    <form action={createCustomerAndRedirectAction}>
      <section className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft size={16} />
            Zurück zu Kunden
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/customers"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              name="intent"
              value="detail"
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              Kunde speichern
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Building2 size={18} />
                <h2 className="font-semibold">Kundeninformationen</h2>
              </div>

              <div className="space-y-4 px-5 py-4">
                <Field label="Firmenname *">
                  <input
                    name="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Ansprechpartner">
                  <input
                    name="contactName"
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="E-Mail">
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Telefon">
                  <input
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="input"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <MapPin size={18} />
                <h2 className="font-semibold">Adresse</h2>
              </div>

              <div className="space-y-4 px-5 py-4">
                <Field label="Straße *">
                  <input
                    name="street"
                    required
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="PLZ *">
                  <input
                    name="postalCode"
                    required
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Ort *">
                  <input
                    name="city"
                    required
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Land *">
                  <select
                    name="countryCode"
                    defaultValue="DE"
                    className="input"
                  >
                    <option value="DE">Deutschland (DE)</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <FileText size={18} />
                <h2 className="font-semibold">Steuerinformationen</h2>
              </div>

              <div className="space-y-4 px-5 py-4">
                <Field label="USt-IdNr.">
                  <input
                    name="vatId"
                    value={vatId}
                    onChange={(event) => setVatId(event.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Steuernummer">
                  <input
                    name="taxNumber"
                    value={taxNumber}
                    onChange={(event) => setTaxNumber(event.target.value)}
                    className="input"
                  />
                </Field>
              </div>
            </section>
          </div>

          <div className="space-y-3">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <FileText size={18} />
                <h2 className="font-semibold">Rechnungsstandard</h2>
              </div>

              <div className="space-y-4 px-5 py-4">
                <Field label="Zahlungsziel">
                  <select
                    name="paymentTermsDays"
                    value={paymentTermsDays}
                    onChange={(event) =>
                      setPaymentTermsDays(event.target.value)
                    }
                    className="input"
                  >
                    <option value="7">7 Tage</option>
                    <option value="14">14 Tage</option>
                    <option value="30">30 Tage</option>
                  </select>
                </Field>

                <Field label="Standard MwSt.-Satz">
                  <select
                    name="defaultVatRatePercent"
                    value={defaultVatRatePercent}
                    onChange={(event) =>
                      setDefaultVatRatePercent(event.target.value)
                    }
                    className="input"
                  >
                    <option value="19">19 %</option>
                    <option value="7">7 %</option>
                    <option value="0">0 %</option>
                  </select>
                </Field>

                <Field label="Währung">
                  <select
                    name="defaultCurrency"
                    defaultValue="EUR"
                    className="input"
                  >
                    <option value="EUR">EUR (€)</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <StickyNote size={18} />
                <h2 className="font-semibold">Interne Notizen</h2>
              </div>

              <div className="px-5 py-4">
                <textarea
                  name="internalNotes"
                  value={internalNotes}
                  onChange={(event) => setInternalNotes(event.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Eye size={18} />
                <h2 className="font-semibold">Vorschau</h2>
              </div>

              <div className="mx-5 my-4 grid gap-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="font-semibold">{name || "Firmenname"}</p>
                  <p>{contactName || "Ansprechpartner"}</p>
                  <p>{email || "E-Mail"}</p>
                  <p className="mt-4">
                    {street || "Straße"}
                    <br />
                    {postalCode || "PLZ"} {city || "Ort"}
                    <br />
                    Deutschland
                  </p>
                </div>

                <div className="border-slate-200 md:border-l md:pl-5">
                  <p>
                    <span className="font-semibold">Zahlungsziel:</span>{" "}
                    {paymentTermsDays} Tage
                  </p>
                  <p>
                    <span className="font-semibold">MwSt.:</span>{" "}
                    {defaultVatRatePercent} %
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h2 className="font-semibold">Pflichtfelder</h2>
              </div>

              <div className="grid gap-3 px-5 py-4 text-sm sm:grid-cols-2">
                <Requirement
                  done={Boolean(name.trim())}
                  label="Firmenname gesetzt"
                />
                <Requirement
                  done={Boolean(street.trim())}
                  label="Straße gesetzt"
                />
                <Requirement
                  done={Boolean(postalCode.trim())}
                  label="PLZ gesetzt"
                />
                <Requirement done={Boolean(city.trim())} label="Ort gesetzt" />

                <p className="sm:col-span-2 text-emerald-700">
                  {requiredFieldsComplete
                    ? "Alle Pflichtfelder sind vollständig."
                    : "Bitte alle Pflichtfelder ausfüllen."}
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 -mx-6 border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-end gap-3">
            <Link
              href="/customers"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              name="intent"
              value="detail"
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            >
              Kunde speichern
            </button>
            <button
              type="submit"
              name="intent"
              value="invoice"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Speichern und Rechnung erstellen
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .input {
          width: 100%;
          height: 2.5rem;
          border-radius: 0.375rem;
          border: 1px solid rgb(203 213 225);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }

        .input:focus {
          border-color: rgb(71 85 105);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm md:grid-cols-[180px_1fr] md:items-center">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Requirement({ done, label }: { done: boolean; label: string }) {
  return (
    <p
      className={
        done
          ? "flex items-center gap-2 text-emerald-700"
          : "flex items-center gap-2 text-slate-500"
      }
    >
      <CheckCircle2 size={16} />
      {label}
    </p>
  );
}
