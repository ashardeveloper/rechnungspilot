"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { listInvoiceAuditEventsAction } from "@/app/actions/invoice-audit-actions";
import { updateInvoiceAction } from "@/app/actions/invoice-actions";
import { InvoiceEditor } from "@/components/invoices/invoice-editor";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import type { Customer } from "@/domain/customer";
import type { CanonicalInvoice } from "@/domain/invoice";
import type { InvoiceAuditEvent } from "@/domain/invoice-audit";
import {
  getInvoiceStatusTransitions,
  transitionInvoiceStatus,
} from "@/domain/invoice-lifecycle";

type InvoiceDetailClientProps = {
  invoice: CanonicalInvoice;
  customers: Customer[];
};

export function InvoiceDetailClient({
  invoice,
  customers,
}: InvoiceDetailClientProps) {
  const [currentInvoice, setCurrentInvoice] = useState(invoice);
  const [auditEvents, setAuditEvents] = useState<InvoiceAuditEvent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLocked =
    currentInvoice.status === "issued" || currentInvoice.status === "paid";

  useEffect(() => {
    let isCurrent = true;

    startTransition(async () => {
      const events = await listInvoiceAuditEventsAction(currentInvoice.id);

      if (isCurrent) {
        setAuditEvents(events);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [currentInvoice.id]);

  function saveInvoice(nextInvoice: CanonicalInvoice) {
    startTransition(async () => {
      const invoices = await updateInvoiceAction(nextInvoice);
      const updatedInvoice =
        invoices.find((item) => item.id === nextInvoice.id) ?? nextInvoice;

      setCurrentInvoice(updatedInvoice);
      setIsEditing(false);

      const events = await listInvoiceAuditEventsAction(updatedInvoice.id);
      setAuditEvents(events);
    });
  }

  function updateInvoiceStatus(status: CanonicalInvoice["status"]) {
    saveInvoice(transitionInvoiceStatus(currentInvoice, status));
  }

  return (
    <>
      <InvoicePreview
        invoice={currentInvoice}
        eyebrow={
          <Link
            href="/invoices"
            className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
          >
            ← Zurück zur Rechnungsübersicht
          </Link>
        }
        actions={
          <>
            {!isLocked ? (
              <button
                type="button"
                onClick={() => setIsEditing((current) => !current)}
                className="rounded-md bg-slate-950 px-3 py-1.5 text-sm font-medium text-white"
              >
                {isEditing ? "Bearbeitung schließen" : "Bearbeiten"}
              </button>
            ) : null}

            {getInvoiceStatusTransitions(currentInvoice).map((transition) => (
              <button
                key={transition.targetStatus}
                type="button"
                onClick={() => updateInvoiceStatus(transition.targetStatus)}
                disabled={isPending || Boolean(transition.blockedReason)}
                title={transition.blockedReason}
                className={
                  transition.targetStatus === "paid"
                    ? "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    : "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                {transition.label}
              </button>
            ))}
          </>
        }
      />

      {isEditing && !isLocked ? (
        <InvoiceEditor
          key={currentInvoice.id}
          invoice={currentInvoice}
          customers={customers}
          onSaveInvoice={saveInvoice}
        />
      ) : null}

      {isLocked ? (
        <section className="mx-auto max-w-6xl px-6 pb-8 print:hidden">
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <h2 className="text-lg font-semibold">Rechnung gesperrt</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ausgestellte oder bezahlte Rechnungen sind in dieser Demo nicht
              mehr direkt bearbeitbar. Korrekturen werden später als eigener
              Workflow modelliert.
            </p>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 pb-10 print:hidden">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsAuditOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
          >
            <div>
              <h2 className="text-base font-semibold">Historie</h2>
              <p className="mt-1 text-sm text-slate-600">
                Technische Ereignisse zu Erstellung, Änderungen, Statuswechseln
                und PDF-Downloads.
              </p>
            </div>

            <span className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">
              {isAuditOpen ? "Historie ausblenden" : "Historie anzeigen"}
            </span>
          </button>

          {isAuditOpen ? (
            <div className="border-t border-slate-200">
              {auditEvents.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {auditEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-3 px-5 py-4 text-sm"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-600" />
                      <div>
                        <p className="font-medium text-slate-950">
                          {event.message}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {new Intl.DateTimeFormat("de-DE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(event.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-sm text-slate-600">
                  Noch keine Historie für diese Rechnung vorhanden.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
