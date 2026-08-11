import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Edit3,
  FileText,
  MapPin,
  Plus,
  Trash2,
  User,
} from "lucide-react";

import { searchInvoicesAction } from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { formatCurrency, formatDate } from "@/components/invoices/formatting";
import { invoiceStatusLabels } from "@/components/invoices/invoice-status";
import type { InvoiceStatus } from "@/domain/invoice";
import {
  getCustomerAction,
  updateCustomerAction,
} from "@/app/actions/customer-actions";
import { auth } from "@/server/auth/auth";
import { notFound, redirect } from "next/navigation";

type CustomerPageProps = {
  params: Promise<{ customerId: string }>;
  searchParams: Promise<{ edit?: string }>;
};

const statusTone: Record<InvoiceStatus, string> = {
  draft: "bg-blue-50 text-blue-700",
  review_ready: "bg-amber-50 text-amber-700",
  issued: "bg-cyan-50 text-cyan-700",
  paid: "bg-emerald-50 text-emerald-700",
};

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-4 text-sm">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-medium text-slate-950">
        {value || "Nicht hinterlegt"}
      </dd>
    </div>
  );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-md px-2 py-1 text-xs font-medium leading-none ${statusTone[status]}`}
    >
      {invoiceStatusLabels[status]}
    </span>
  );
}

export default async function CustomerDetailPage({
  params,
  searchParams,
}: CustomerPageProps) {
  const [{ customerId }, queryParams, session] = await Promise.all([
    params,
    searchParams,
    auth(),
  ]);

  const isEditing = queryParams.edit === "1";
  const customer = await getCustomerAction(customerId);

  if (!customer) {
    notFound();
  }

  async function updateCurrentCustomer(formData: FormData) {
    "use server";

    await updateCustomerAction(formData);
    redirect(`/customers/${customerId}`);
  }

  const invoiceResult = await searchInvoicesAction({ query: customer.name });
  const invoices = invoiceResult.invoices;
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const openInvoices = invoices.filter((invoice) => invoice.status !== "paid");
  const totalRevenueCents = invoices.reduce(
    (sum, invoice) => sum + invoice.totals.grossAmountCents,
    0,
  );
  const paidRevenueCents = paidInvoices.reduce(
    (sum, invoice) => sum + invoice.totals.grossAmountCents,
    0,
  );
  const latestInvoice = invoices[0];

  return (
    <AppShell activePath="/customers">
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-7">
            <Link
              href="/customers"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft size={16} />
              Zurück zu Kunden
            </Link>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {customer.name}
                  </h1>
                  <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    Aktiv
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <User size={16} />
                    Ansprechpartner nicht hinterlegt
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {customer.city}, Deutschland
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/customers/${customer.id}?edit=1`}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Edit3 size={16} />
                  Kunde bearbeiten
                </Link>
                <Link
                  href={`/invoices/new?customerId=${customer.id}`}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Neue Rechnung
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-5 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-5">
            <MetricCard
              icon={<FileText size={21} />}
              label="Gesamt-Rechnungen"
              value={String(invoices.length)}
              detail="Gesamt"
              tone="bg-blue-50 text-blue-700"
            />
            <MetricCard
              icon={<Calendar size={21} />}
              label="Offene Rechnungen"
              value={String(openInvoices.length)}
              detail={formatCurrency(
                openInvoices.reduce(
                  (sum, invoice) => sum + invoice.totals.grossAmountCents,
                  0,
                ),
              )}
              tone="bg-amber-50 text-amber-700"
            />
            <MetricCard
              icon={<CheckCircle2 size={21} />}
              label="Bezahlte Rechnungen"
              value={String(paidInvoices.length)}
              detail={formatCurrency(paidRevenueCents)}
              tone="bg-emerald-50 text-emerald-700"
            />
            <MetricCard
              icon={<BarChart3 size={21} />}
              label="Gesamtumsatz"
              value={formatCurrency(totalRevenueCents)}
              detail="Gesamt"
              tone="bg-violet-50 text-violet-700"
            />
            <MetricCard
              icon={<Calendar size={21} />}
              label="Letzte Rechnung"
              value={latestInvoice ? formatDate(latestInvoice.dueDate) : "-"}
              detail={latestInvoice?.number ?? "Keine Rechnung"}
              tone="bg-indigo-50 text-indigo-700"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <section
              id="customer-information"
              className="rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold">Kundeninformationen</h2>
              </div>
              <dl className="space-y-4 px-5 py-5">
                <InfoRow label="Firmenname" value={customer.name} />
                <InfoRow label="Ansprechpartner" value={customer.contactName} />
                <InfoRow label="E-Mail" value={customer.email} />
                <InfoRow label="Telefon" value={customer.phone} />
                <div className="border-t border-slate-200 pt-4" />
                <InfoRow label="Straße" value={customer.street} />
                <InfoRow label="PLZ" value={customer.postalCode} />
                <InfoRow label="Ort" value={customer.city} />
                <InfoRow label="Land" value="Deutschland" />
                <div className="border-t border-slate-200 pt-4" />
                <InfoRow label="USt-IdNr." value={customer.vatId} />
                <InfoRow label="Steuernummer" value={customer.taxNumber} />
              </dl>
            </section>

            <div className="space-y-5">
              <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold">
                    Rechnungseinstellungen
                  </h2>
                </div>
                <dl className="space-y-4 px-5 py-5">
                  <InfoRow
                    label="Zahlungsziel"
                    value={`${customer.paymentTermsDays} Tage`}
                  />
                  <InfoRow
                    label="Standard MwSt.-Satz"
                    value={`${customer.defaultVatRatePercent} %`}
                  />
                  <InfoRow
                    label="Währung"
                    value={`${customer.defaultCurrency} (€)`}
                  />
                </dl>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold">Interne Notizen</h2>
                </div>
                <div className="px-5 py-5 text-sm leading-6 text-slate-700">
                  <p>
                    {customer.internalNotes ||
                      "Keine internen Notizen hinterlegt."}
                  </p>
                  <p className="mt-2 text-slate-500">
                    Notizen und Kontaktrollen werden später als eigener Workflow
                    ergänzt.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {isEditing ? (
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold">Kunde bearbeiten</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Stammdaten, Rechnungseinstellungen und interne Notizen
                  aktualisieren.
                </p>
              </div>

              <form
                action={updateCurrentCustomer}
                className="grid gap-4 px-5 py-5 lg:grid-cols-2"
              >
                <input type="hidden" name="id" value={customer.id} />

                <label className="block">
                  <span className="text-sm text-slate-600">Firmenname</span>
                  <input
                    name="name"
                    defaultValue={customer.name}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">
                    Ansprechpartner
                  </span>
                  <input
                    name="contactName"
                    defaultValue={customer.contactName}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">E-Mail</span>
                  <input
                    name="email"
                    defaultValue={customer.email}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">Telefon</span>
                  <input
                    name="phone"
                    defaultValue={customer.phone}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm text-slate-600">Straße</span>
                  <input
                    name="street"
                    defaultValue={customer.street}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">PLZ</span>
                  <input
                    name="postalCode"
                    defaultValue={customer.postalCode}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">Ort</span>
                  <input
                    name="city"
                    defaultValue={customer.city}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

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

                <label className="block">
                  <span className="text-sm text-slate-600">
                    Zahlungsziel Tage
                  </span>
                  <input
                    name="paymentTermsDays"
                    type="number"
                    defaultValue={customer.paymentTermsDays}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">
                    Standard MwSt.-Satz
                  </span>
                  <input
                    name="defaultVatRatePercent"
                    type="number"
                    defaultValue={customer.defaultVatRatePercent}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="text-sm text-slate-600">
                    Interne Notizen
                  </span>
                  <textarea
                    name="internalNotes"
                    defaultValue={customer.internalNotes}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <div className="flex gap-3 lg:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                  >
                    Änderungen speichern
                  </button>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    Abbrechen
                  </Link>
                </div>
              </form>
            </section>
          ) : null}

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold">
                Rechnungen dieses Kunden
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[820px]">
                <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_40px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-600">
                  <span>Rechnungs-Nr.</span>
                  <span>Rechnungsdatum</span>
                  <span>Status</span>
                  <span>Fällig am</span>
                  <span>Betrag</span>
                  <span />
                </div>

                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_40px] items-center border-b border-slate-100 px-5 py-3 text-sm hover:bg-slate-50"
                  >
                    <span className="font-medium">{invoice.number}</span>
                    <span className="text-slate-600">
                      {formatDate(invoice.issueDate)}
                    </span>
                    <StatusBadge status={invoice.status} />
                    <span className="text-slate-600">
                      {formatDate(invoice.dueDate)}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(invoice.totals.grossAmountCents)}
                    </span>
                    <ChevronRight size={18} className="text-slate-500" />
                  </Link>
                ))}

                {invoices.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-slate-600">
                    Für diesen Kunden wurden noch keine Rechnungen gefunden.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="px-5 py-4">
              <Link
                href={`/invoices?query=${encodeURIComponent(customer.name)}`}
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                Alle Rechnungen anzeigen →
              </Link>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold">Aktivitätsverlauf</h2>
              </div>
              <div className="space-y-4 px-5 py-5">
                {invoices.slice(0, 4).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      <FileText size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-950">
                        Rechnung {invoice.number}{" "}
                        {invoiceStatusLabels[invoice.status].toLowerCase()}
                      </p>
                      <p className="text-slate-500">
                        {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <span className="text-slate-500">vom System</span>
                  </div>
                ))}

                {invoices.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Noch keine Aktivität vorhanden.
                  </p>
                ) : null}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold">Schnellaktionen</h2>
              </div>
              <div className="space-y-4 px-5 py-5 text-sm">
                <Link
                  href={`/invoices/new?customerId=${customer.id}`}
                  className="flex items-start gap-3 hover:text-blue-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Plus size={16} />
                  </span>
                  <span>
                    <span className="block font-medium">
                      Neue Rechnung für diesen Kunden
                    </span>
                    <span className="text-slate-600">
                      Eine neue Rechnung erstellen
                    </span>
                  </span>
                </Link>

                <Link
                  href={`/customers/${customer.id}?edit=1`}
                  className="flex items-start gap-3 hover:text-blue-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Edit3 size={16} />
                  </span>
                  <span>
                    <span className="block font-medium">Kunde bearbeiten</span>
                    <span className="text-slate-600">
                      Kundeninformationen prüfen
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  className="flex items-start gap-3 text-left text-slate-400"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <ClipboardList size={16} />
                  </span>
                  <span>
                    <span className="block font-medium">
                      Kundendaten exportieren
                    </span>
                    <span>Kundendaten herunterladen</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="flex items-start gap-3 text-left text-red-400"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    <Trash2 size={16} />
                  </span>
                  <span>
                    <span className="block font-medium">Kunde archivieren</span>
                    <span>Kundenkonto archivieren</span>
                  </span>
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
