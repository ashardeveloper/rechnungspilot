import Link from "next/link";

import { signOutCurrentUser } from "@/app/actions/auth-actions";

type AppShellProps = {
  title: string;
  description: string;
  userEmail: string;
  activePath: "/invoices" | "/customers" | "/settings";
  children: React.ReactNode;
};

const navItems = [
  { href: "/invoices", label: "Rechnungen" },
  { href: "/customers", label: "Kunden" },
  { href: "/settings", label: "Einstellungen" },
] as const;

export function AppShell({
  title,
  description,
  userEmail,
  activePath,
  children,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              RechnungsPilot DE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
            <p className="mt-1 text-xs text-slate-500">{userEmail}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.href === activePath
                      ? "rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                      : "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <form action={signOutCurrentUser}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}
