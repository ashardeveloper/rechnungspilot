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
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-6 text-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-7 py-7 shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
        <p className="text-base font-medium text-cyan-700">RechnungsPilot DE</p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Anmelden
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Melde dich im RechnungsPilot Workspace an.
        </p>

        {hasCredentialError ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Anmeldung fehlgeschlagen. Bitte Demo-Zugangsdaten prüfen.
          </p>
        ) : null}

        <form action={signInWithPassword} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">E-Mail</span>
            <input
              name="email"
              type="email"
              defaultValue={demoUserEmail}
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Passwort</span>
            <input
              name="password"
              type="password"
              defaultValue={demoUserPassword}
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-slate-950 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Einloggen
          </button>
        </form>
      </section>
    </main>
  );
}
