import Link from "next/link";
import { redirect } from "next/navigation";
import { Archive, CheckCircle2, FileText, Plus, Send } from "lucide-react";

import { getInvoiceDashboardAction } from "@/app/actions/invoice-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";
import { formatCurrency, formatDate } from "@/components/invoices/formatting";
import { invoiceStatusLabels } from "@/components/invoices/invoice-status";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dashboard = await getInvoiceDashboardAction();

  return (
    <AppShell
      title="Dashboard"
      description="Überblick über Rechnungen, Status und offene Aufgaben."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <section className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DashboardMetric
            icon={<FileText size={20} />}
            label="Aktive Rechnungen"
            value={dashboard.stats.total}
          />
          <DashboardMetric
            icon={<Plus size={20} />}
            label="Entwürfe"
            value={dashboard.stats.draft}
          />
          <DashboardMetric
            icon={<Send size={20} />}
            label="Ausgestellt"
            value={dashboard.stats.issued}
          />
          <DashboardMetric
            icon={<CheckCircle2 size={20} />}
            label="Bezahlt"
            value={dashboard.stats.paid}
          />
          <DashboardMetric
            icon={<Archive size={20} />}
            label="Archiviert"
            value={dashboard.archivedCount}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold">Aktuelle Rechnungen</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Die letzten aktiven Rechnungen im Arbeitsbereich.
                </p>
              </div>
              <Link
                href="/invoices"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Alle anzeigen
              </Link>
            </div>

            <div className="divide-y divide-slate-200">
              {dashboard.invoices.length > 0 ? (
                dashboard.invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="grid gap-3 px-5 py-4 text-sm hover:bg-slate-50 sm:grid-cols-[1fr_120px_120px_120px]"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {invoice.number}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {invoice.buyer.name}
                      </p>
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
                  Keine aktiven Rechnungen vorhanden.
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Schnellaktionen</h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/invoices"
                className="block rounded-md bg-slate-950 px-4 py-3 text-sm font-medium text-white"
              >
                Neue Rechnung anlegen
              </Link>
              <Link
                href="/customers"
                className="block rounded-md border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Kunden verwalten
              </Link>
              <Link
                href="/settings"
                className="block rounded-md border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Absenderprofil prüfen
              </Link>
              <Link
                href="/invoices/archived"
                className="block rounded-md border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Archiv öffnen
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function DashboardMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          {icon}
        </span>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
