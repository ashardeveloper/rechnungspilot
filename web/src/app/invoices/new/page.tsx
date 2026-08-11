import { redirect } from "next/navigation";

import { listCustomersAction } from "@/app/actions/customer-actions";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";
import { getBusinessProfileForUser } from "@/server/settings/business-profile-repository";
import { getCurrentUserId } from "@/server/auth/current-user";
import { reserveNextInvoiceNumber } from "@/server/settings/invoice-number-settings-repository";

import { NewInvoiceClient } from "./new-invoice-client";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = await getCurrentUserId();
  const today = new Date();

  const [customers, seller, invoiceNumber] = await Promise.all([
    listCustomersAction(),
    getBusinessProfileForUser(userId),
    reserveNextInvoiceNumber(userId),
  ]);

  return (
    <AppShell
      title="Neue Rechnung"
      description="Erstelle eine neue Rechnung für einen Kunden."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/invoices"
    >
      <NewInvoiceClient
        customers={customers}
        seller={seller}
        invoiceNumber={invoiceNumber}
        initialCustomerId={params.customerId}
        issueDate={isoDate(today)}
        dueDate={isoDate(addDays(today, 14))}
      />
    </AppShell>
  );
}
