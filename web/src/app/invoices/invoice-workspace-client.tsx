"use client";

import { useMemo, useReducer, useTransition } from "react";
import { signOutCurrentUser } from "@/app/actions/auth-actions";

import {
  createDraftInvoiceAction,
  resetDemoInvoicesAction,
  updateInvoiceAction,
} from "@/app/actions/invoice-actions";
import { InvoiceEditor } from "@/components/invoices/invoice-editor";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import type { CanonicalInvoice } from "@/domain/invoice";

type WorkspaceState = {
  invoices: CanonicalInvoice[];
  selectedInvoiceId: string;
};

type WorkspaceAction =
  | {
      type: "replace_invoices";
      invoices: CanonicalInvoice[];
      selectedInvoiceId?: string;
    }
  | { type: "select_invoice"; invoiceId: string };

type InvoiceWorkspaceClientProps = {
  initialInvoices: CanonicalInvoice[];
  userEmail: string;
};

const checks = [
  "Pflichtangaben nach Rechnungstyp erfassen",
  "PDF aus kanonischem Rechnungsmodell erzeugen",
  "XRechnung XML später technisch validieren",
  "Keine Steuer-, DATEV-, ELSTER- oder Zahlungsintegration",
];

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "replace_invoices":
      return {
        invoices: action.invoices,
        selectedInvoiceId:
          action.selectedInvoiceId ?? action.invoices[0]?.id ?? "",
      };

    case "select_invoice":
      return {
        ...state,
        selectedInvoiceId: action.invoiceId,
      };
  }
}

export function InvoiceWorkspaceClient({
  initialInvoices,
  userEmail,
}: InvoiceWorkspaceClientProps) {
  const [isPending, startTransition] = useTransition();
  const [state, dispatch] = useReducer(workspaceReducer, {
    invoices: initialInvoices,
    selectedInvoiceId: initialInvoices[0]?.id ?? "",
  });

  const selectedInvoice = useMemo(
    () =>
      state.invoices.find(
        (invoice) => invoice.id === state.selectedInvoiceId,
      ) ?? state.invoices[0],
    [state.invoices, state.selectedInvoiceId],
  );

  const invoiceStats = useMemo(
    () => ({
      total: state.invoices.length,
      drafts: state.invoices.filter((invoice) => invoice.status === "draft")
        .length,
      reviewReady: state.invoices.filter(
        (invoice) => invoice.status === "review_ready",
      ).length,
      paid: state.invoices.filter((invoice) => invoice.status === "paid")
        .length,
    }),
    [state.invoices],
  );

  function createDraftInvoice() {
    startTransition(async () => {
      const invoices = await createDraftInvoiceAction();

      dispatch({
        type: "replace_invoices",
        invoices,
        selectedInvoiceId: invoices[0]?.id,
      });
    });
  }

  function updateInvoice(invoice: CanonicalInvoice) {
    startTransition(async () => {
      const invoices = await updateInvoiceAction(invoice);

      dispatch({
        type: "replace_invoices",
        invoices,
        selectedInvoiceId: invoice.id,
      });
    });
  }

  function resetDemoData() {
    startTransition(async () => {
      const invoices = await resetDemoInvoicesAction();

      dispatch({
        type: "replace_invoices",
        invoices,
        selectedInvoiceId: invoices[0]?.id,
      });
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              RechnungsPilot DE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Lokaler Rechnungsarbeitsplatz
            </h1>
            <p className="mt-1 text-sm text-slate-600">{userEmail}</p>
          </div>
          <div className="flex gap-2">
            <form action={signOutCurrentUser}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                Abmelden
              </button>
            </form>
            <button
              type="button"
              onClick={resetDemoData}
              disabled={isPending}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              {isPending ? "Wird gespeichert..." : "Beispieldaten zurücksetzen"}
            </button>
            <button
              type="button"
              onClick={createDraftInvoice}
              disabled={isPending}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isPending ? "Wird erstellt..." : "Neue Rechnung"}
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 sm:grid-cols-4">
          <div>
            <p className="text-sm text-slate-600">Gesamt</p>
            <p className="mt-1 text-2xl font-semibold">{invoiceStats.total}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Entwürfe</p>
            <p className="mt-1 text-2xl font-semibold">{invoiceStats.drafts}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Prüfbereit</p>
            <p className="mt-1 text-2xl font-semibold">
              {invoiceStats.reviewReady}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Bezahlt</p>
            <p className="mt-1 text-2xl font-semibold">{invoiceStats.paid}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.4fr_0.8fr] print:hidden">
        <InvoiceList
          invoices={state.invoices}
          selectedInvoiceId={selectedInvoice?.id ?? ""}
          onSelectInvoice={(invoiceId) =>
            dispatch({ type: "select_invoice", invoiceId })
          }
        />

        <aside className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">MVP-Leitplanken</h2>
            <p className="mt-1 text-sm text-slate-600">
              Technisch sauber, lokal lauffähig, ohne
              Zertifizierungsversprechen.
            </p>
          </div>

          <ul className="space-y-3 px-5 py-4">
            {checks.map((check) => (
              <li key={check} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-600" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {selectedInvoice ? (
        <InvoiceEditor
          invoice={selectedInvoice}
          onUpdateInvoice={updateInvoice}
        />
      ) : null}

      {selectedInvoice ? <InvoicePreview invoice={selectedInvoice} /> : null}
    </main>
  );
}
