import { redirect } from "next/navigation";

import { signInWithPassword } from "@/app/actions/auth-actions";
import { auth } from "@/server/auth/auth";
import { demoUserEmail, demoUserPassword } from "@/server/demo/demo-user";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  const params = await searchParams;
  const hasCredentialError = params.error === "credentials";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-cyan-700">RechnungsPilot DE</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Demo anmelden
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Lokaler SaaS-Demozugang mit datenbankgespeicherten Rechnungen.
        </p>

        {hasCredentialError ? (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Anmeldung fehlgeschlagen. Bitte Demo-Zugangsdaten prüfen.
          </p>
        ) : null}

        <form action={signInWithPassword} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-600">E-Mail</span>
            <input
              name="email"
              type="email"
              defaultValue={demoUserEmail}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-600">Passwort</span>
            <input
              name="password"
              type="password"
              defaultValue={demoUserPassword}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Einloggen
          </button>
        </form>
      </section>
    </main>
  );
}
