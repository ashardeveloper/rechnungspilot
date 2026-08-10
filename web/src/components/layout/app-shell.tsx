import Link from "next/link";
import { FileText } from "lucide-react";

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
      <header className="border-b border-slate-200 bg-white/95 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/invoices" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <FileText size={18} />
            </span>
            <span className="text-base font-semibold">RechnungsPilot DE</span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.href === activePath
                      ? "rounded-md bg-slate-950 px-5 py-2 text-sm font-medium text-white shadow-sm"
                      : "rounded-md px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <form action={signOutCurrentUser}>
              <button
                type="submit"
                className="rounded-md px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          <p className="mt-2 text-sm text-slate-500">{userEmail}</p>
        </div>
      </section>

      {children}
    </main>
  );
}
