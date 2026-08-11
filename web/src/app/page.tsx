import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
  Info,
  PencilLine,
  Plus,
  Send,
  Settings,
  Users,
} from "lucide-react";

import { getInvoiceDashboardAction } from "@/app/actions/invoice-actions";
import { formatCurrency, formatDate } from "@/components/invoices/formatting";
import { invoiceStatusLabels } from "@/components/invoices/invoice-status";
import { AppShell } from "@/components/layout/app-shell";
import { getInvoiceDueStatus } from "@/domain/invoice-due-status";
import type { CanonicalInvoice } from "@/domain/invoice";
import { auth } from "@/server/auth/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dashboard = await getInvoiceDashboardAction();
  const invoices = dashboard.invoices;
  const openInvoices = invoices.filter(
    (invoice) => invoice.status !== "paid" && invoice.status !== "draft",
  );
  const overdueInvoices = invoices.filter(
    (invoice) => getInvoiceDueStatus(invoice) === "overdue",
  );
  const dueSoonInvoices = invoices.filter(
    (invoice) => getInvoiceDueStatus(invoice) === "due_soon",
  );
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const actionRequiredInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "draft" || invoice.status === "review_ready",
  );
  const totalRevenueCents = invoices.reduce(
    (sum, invoice) => sum + invoice.totals.grossAmountCents,
    0,
  );
  const paidThisMonthCents = paidInvoices.reduce(
    (sum, invoice) => sum + invoice.totals.grossAmountCents,
    0,
  );

  return (
    <AppShell
      title="Willkommen zurück, Ashar"
      description="Hier ist dein Rechnungsüberblick."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <section className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/invoices"
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              <Plus size={16} />
              Neue Rechnung
            </Link>
            <Link
              href="/customers"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Users size={16} />
              Kunden verwalten
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            icon={<FileText size={20} />}
            tone="blue"
            label="Offene Rechnungen"
            value={formatCurrency(
              openInvoices.reduce(
                (sum, invoice) => sum + invoice.totals.grossAmountCents,
                0,
              ),
            )}
            subline={`${openInvoices.length} Rechnung${
              openInvoices.length === 1 ? "" : "en"
            }`}
          />
          <MetricCard
            icon={<AlertCircle size={20} />}
            tone="red"
            label="Überfällig"
            value={formatCurrency(
              overdueInvoices.reduce(
                (sum, invoice) => sum + invoice.totals.grossAmountCents,
                0,
              ),
            )}
            subline={`${overdueInvoices.length} Rechnungen`}
          />
          <MetricCard
            icon={<Clock3 size={20} />}
            tone="amber"
            label="Bald fällig"
            value={formatCurrency(
              dueSoonInvoices.reduce(
                (sum, invoice) => sum + invoice.totals.grossAmountCents,
                0,
              ),
            )}
            subline={`${dueSoonInvoices.length} Rechnungen`}
          />
          <MetricCard
            icon={<CheckCircle2 size={20} />}
            tone="green"
            label="Bezahlt diesen Monat"
            value={formatCurrency(paidThisMonthCents)}
            subline={`${paidInvoices.length} Rechnung${
              paidInvoices.length === 1 ? "" : "en"
            }`}
          />
          <MetricCard
            icon={<BarChart3 size={20} />}
            tone="slate"
            label="Gesamtumsatz (dieses Jahr)"
            value={formatCurrency(totalRevenueCents)}
            subline={`${invoices.length} Rechnungen`}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.2fr]">
          <Panel
            title="Aktion erforderlich"
            description="Diese Rechnungen benötigen deine Aufmerksamkeit."
          >
            {actionRequiredInvoices.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {actionRequiredInvoices.slice(0, 2).map((invoice) => (
                  <ActionRequiredRow key={invoice.id} invoice={invoice} />
                ))}
              </div>
            ) : (
              <EmptyPanelText>
                Keine offenen Aufgaben für aktive Rechnungen.
              </EmptyPanelText>
            )}

            <PanelLink href="/invoices">Alle Rechnungen anzeigen →</PanelLink>
          </Panel>

          <Panel
            title="Letzte Rechnungen"
            description="Deine zuletzt erstellten oder bearbeiteten Rechnungen."
          >
            <div className="divide-y divide-slate-200">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="grid gap-3 px-5 py-4 text-sm hover:bg-slate-50 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {invoice.number}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {invoice.buyer.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <span className="text-slate-600">
                        {formatDate(invoice.dueDate)}
                      </span>
                      <StatusBadge invoice={invoice} />
                      <span className="w-28 text-right font-medium">
                        {formatCurrency(invoice.totals.grossAmountCents)}
                      </span>
                      <span className="text-slate-500">→</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-5 py-8 text-sm text-slate-600">
                  Keine aktiven Rechnungen vorhanden.
                </div>
              )}
            </div>

            <PanelLink href="/invoices">Alle Rechnungen anzeigen →</PanelLink>
          </Panel>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.2fr]">
          <Panel
            title="Schnellaktionen"
            description="Häufig genutzte Aktionen direkt starten."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction
                href="/invoices"
                icon={<FilePlus2 size={22} />}
                label="Neue Rechnung"
                subline="erstellen"
              />
              <QuickAction
                href="/customers"
                icon={<Users size={22} />}
                label="Kunde"
                subline="hinzufügen"
              />
              <QuickAction
                href="/invoices"
                icon={<Send size={22} />}
                label="PDF/XML Export"
                subline="prüfen"
              />
              <QuickAction
                href="/settings"
                icon={<Settings size={22} />}
                label="Einstellungen"
                subline="öffnen"
              />
            </div>
          </Panel>

          <Panel
            title="E-Rechnung Bereitschaft"
            description="Status deiner lokalen Rechnungen und technischer Prüfungen."
          >
            <div className="px-5 py-5">
              <div className="grid gap-5 md:grid-cols-3">
                <ReadinessItem
                  icon={<CheckCircle2 size={20} />}
                  tone="green"
                  title={`${dashboard.stats.total} Rechnungen`}
                  description="lokal erstellt"
                />
                <ReadinessItem
                  icon={<CheckCircle2 size={20} />}
                  tone="amber"
                  title={`${dashboard.stats.reviewReady} Rechnung`}
                  description="prüfbereit"
                />
                <ReadinessItem
                  icon={<Info size={20} />}
                  tone="blue"
                  title="0 Hinweise"
                  description="technische Pflichtfelder"
                />
              </div>

              <p className="mt-5 text-sm text-slate-600">
                XML-Validierung und XRechnung Export in späteren Updates
                verfügbar.
              </p>
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
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
  tone: "blue" | "red" | "amber" | "green" | "slate";
  label: string;
  value: string;
  subline: string;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          <p
            className={
              tone === "red"
                ? "mt-2 text-sm text-red-600"
                : tone === "amber"
                  ? "mt-2 text-sm text-amber-600"
                  : tone === "green"
                    ? "mt-2 text-sm text-emerald-600"
                    : "mt-2 text-sm text-blue-700"
            }
          >
            {subline}
          </p>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ActionRequiredRow({ invoice }: { invoice: CanonicalInvoice }) {
  const isReviewReady = invoice.status === "review_ready";

  return (
    <div className="grid gap-3 px-5 py-4 text-sm sm:grid-cols-[auto_1fr_auto_auto] sm:items-center">
      <span
        className={
          isReviewReady
            ? "flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700"
            : "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"
        }
      >
        {isReviewReady ? <FileText size={20} /> : <PencilLine size={20} />}
      </span>

      <div>
        <p className="font-semibold text-slate-950">{invoice.number}</p>
        <p className="mt-1 text-slate-600">{invoice.buyer.name}</p>
      </div>

      <StatusBadge invoice={invoice} />

      <Link
        href={`/invoices/${invoice.id}`}
        className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        {isReviewReady ? "Rechnung ausstellen" : "Weiter bearbeiten"}
      </Link>
    </div>
  );
}

function StatusBadge({ invoice }: { invoice: CanonicalInvoice }) {
  const className = {
    draft: "bg-blue-50 text-blue-700",
    review_ready: "bg-amber-50 text-amber-700",
    issued: "bg-indigo-50 text-indigo-700",
    paid: "bg-emerald-50 text-emerald-700",
  }[invoice.status];

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-medium ${className}`}>
      {invoiceStatusLabels[invoice.status]}
    </span>
  );
}

function QuickAction({
  href,
  icon,
  label,
  subline,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  subline: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-slate-200 px-3 py-4 text-center text-sm hover:bg-slate-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        {icon}
      </span>
      <span className="mt-3 font-medium text-slate-950">{label}</span>
      <span className="mt-1 text-slate-600">{subline}</span>
    </Link>
  );
}

function ReadinessItem({
  icon,
  tone,
  title,
  description,
}: {
  icon: React.ReactNode;
  tone: "green" | "amber" | "blue";
  title: string;
  description: string;
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function PanelLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-slate-200 px-5 py-4">
      <Link href={href} className="text-sm font-medium text-blue-700">
        {children}
      </Link>
    </div>
  );
}

function EmptyPanelText({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-8 text-sm text-slate-600">{children}</div>;
}
