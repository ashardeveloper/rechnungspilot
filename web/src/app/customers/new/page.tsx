import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/server/auth/auth";

import { NewCustomerClient } from "./new-customer-client";

export default async function NewCustomerPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AppShell
      title="Neuer Kunde"
      description="Lege einen neuen Rechnungsempfänger an."
      userEmail={session.user.email ?? "Angemeldeter Nutzer"}
      activePath="/customers"
    >
      <NewCustomerClient />
    </AppShell>
  );
}
