"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { searchCustomersAction } from "@/app/actions/customer-actions";
import type { Customer } from "@/domain/customer";
import type { CanonicalInvoice } from "@/domain/invoice";
import { formatCurrency, formatDate } from "@/components/invoices/formatting";
import { invoiceStatusLabels } from "@/components/invoices/invoice-status";

type CustomerManagementClientProps = {
  initialCustomers: Customer[];
  initialNextCursor?: string;
  initialQuery?: string;
  invoices: CanonicalInvoice[];
};

export function CustomerManagementClient({
  initialCustomers,
  initialNextCursor,
  initialQuery = "",
  invoices,
}: CustomerManagementClientProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();

  const customerRows = useMemo(
    () =>
      customers.map((customer) => {
        const customerInvoices = invoices.filter(
          (invoice) => invoice.buyer.name === customer.name,
        );
        const openInvoices = customerInvoices.filter(
          (invoice) =>
            invoice.status !== "paid" && invoice.status !== "archived",
        );
        const latestInvoice = customerInvoices[0];
        const revenueCents = customerInvoices.reduce(
          (sum, invoice) => sum + invoice.totals.grossAmountCents,
          0,
        );

        return {
          customer,
          openInvoices,
          latestInvoice,
          revenueCents,
        };
      }),
    [customers, invoices],
  );

  const customersWithOpenInvoices = customerRows.filter(
    (row) => row.openInvoices.length > 0,
  ).length;

  function loadMore() {
    if (!nextCursor) {
      return;
    }

    startTransition(async () => {
      const result = await searchCustomersAction({
        query: initialQuery,
        cursor: nextCursor,
      });

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        ...result.customers,
      ]);
      setNextCursor(result.nextCursor);
    });
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          tone="blue"
          label="Gesamt"
          value={customers.length}
          subline="Kunden"
        />
        <MetricCard
          icon={<CheckCircle2 size={20} />}
          tone="green"
          label="Aktive Kunden"
          value={customers.length}
          subline="Kunden"
        />
        <MetricCard
          icon={<FileText size={20} />}
          tone="amber"
          label="Mit offenen Rechnungen"
          value={customersWithOpenInvoices}
          subline="Kunden"
        />
        <MetricCard
          icon={<CalendarDays size={20} />}
          tone="violet"
          label="Neu diesen Monat"
          value={0}
          subline="Kunden"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={initialQuery}
              placeholder="Kunde suchen (Name, Ort, USt-IdNr.)..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm shadow-sm outline-none focus:border-slate-500"
            />
          </label>

          <select className="h-10 rounded-lg border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500">
            <option>Alle Kunden</option>
            <option>Mit offenen Rechnungen</option>
          </select>

          <select className="h-10 rounded-lg border border-slate-300 px-3 text-sm shadow-sm outline-none focus:border-slate-500">
            <option>Sortieren: A-Z</option>
            <option>Sortieren: Umsatz</option>
          </select>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Filter size={16} />
            Filter
          </button>
        </form>

        {initialQuery ? (
          <Link
            href="/customers"
            className="mt-3 inline-block text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Suche zurücksetzen
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.25fr_0.7fr_0.85fr_0.8fr_0.9fr_0.8fr_36px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-600">
          <span>Kunde</span>
          <span>Ort</span>
          <span>Offene Rechnungen</span>
          <span>Gesamtumsatz</span>
          <span>Letzte Rechnung</span>
          <span>Aktionen</span>
          <span />
        </div>

        <div className="divide-y divide-slate-200">
          {customerRows.length > 0 ? (
            customerRows.map(
              ({ customer, openInvoices, latestInvoice, revenueCents }) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="grid grid-cols-[1.25fr_0.7fr_0.85fr_0.8fr_0.9fr_0.8fr_36px] items-center px-5 py-4 text-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {customer.vatId ?? customer.taxNumber ?? "Stammdaten"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-950">{customer.city}</p>
                    <p className="mt-1 text-slate-600">{customer.postalCode}</p>
                  </div>

                  <div>
                    <p className="text-slate-950">{openInvoices.length}</p>
                    <p
                      className={
                        openInvoices.length > 0
                          ? "mt-1 text-amber-600"
                          : "mt-1 text-emerald-600"
                      }
                    >
                      {openInvoices.length === 0
                        ? "Keine offen"
                        : openInvoices.length === 1
                          ? "Rechnung"
                          : "Rechnungen"}
                    </p>
                  </div>

                  <p className="font-medium">{formatCurrency(revenueCents)}</p>

                  <div>
                    {latestInvoice ? (
                      <>
                        <p className="text-slate-600">
                          {formatDate(latestInvoice.dueDate)}
                        </p>
                        <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                          {invoiceStatusLabels[latestInvoice.status]}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-500">Keine Rechnung</span>
                    )}
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    <Plus size={16} />
                    Rechnung
                  </span>

                  <ChevronRight size={18} className="text-slate-500" />
                </Link>
              ),
            )
          ) : (
            <div className="px-5 py-10 text-sm text-slate-600">
              Kein Kunde gefunden.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
          <span>
            {customers.length > 0
              ? `1 bis ${customers.length} Kunden geladen`
              : "Keine Kunden geladen"}
          </span>

          {nextCursor ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={isPending}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              {isPending ? "Wird geladen..." : "Mehr laden"}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

function MetricCard({
  icon,
  tone,
  label,
  value,
  subline,
}: {
  icon: React.ReactNode;
  tone: "blue" | "green" | "amber" | "violet";
  label: string;
  value: number;
  subline: string;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{subline}</p>
        </div>
      </div>
    </div>
  );
}
