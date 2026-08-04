import { redirect } from "next/navigation";

import { auth } from "@/server/auth/auth";

export default async function HomePage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/invoices");
  }

  redirect("/login");
}
