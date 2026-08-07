"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { searchCustomersAction } from "@/app/actions/customer-actions";
import type { Customer } from "@/domain/customer";

type CustomerManagementClientProps = {
  initialCustomers: Customer[];
  initialNextCursor?: string;
  initialQuery?: string;
};

export function CustomerManagementClient({
  initialCustomers,
  initialNextCursor,
  initialQuery = "",
}: CustomerManagementClientProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!nextCursor) {
      return;
    }

    startTransition(async () => {
      const result = await searchCustomersAction({
        query: initialQuery,
        cursor: nextCursor,
      });

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        ...result.customers,
      ]);
      setNextCursor(result.nextCursor);
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Kundenliste</h2>
            <p className="mt-1 text-sm text-slate-600">
              {customers.length} Kundendatensätze geladen.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <form className="flex w-full gap-2 sm:w-[420px]">
              <input
                name="q"
                defaultValue={initialQuery}
                placeholder="Kunden suchen..."
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
              >
                Suchen
              </button>
            </form>

            {initialQuery ? (
              <Link
                href="/customers"
                className="text-sm font-medium text-slate-600 hover:text-slate-950"
              >
                Suche zurücksetzen
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {customers.map((customer) => (
          <Link
            key={customer.id}
            href={`/customers?${new URLSearchParams({
              ...(initialQuery ? { q: initialQuery } : {}),
              selected: customer.id,
            })}`}
            className="grid gap-2 px-5 py-4 text-sm hover:bg-cyan-50 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <p className="font-medium text-slate-950">{customer.name}</p>
              <p className="text-slate-600">
                {customer.postalCode} {customer.city}
              </p>
            </div>
            <p className="text-slate-600">{customer.street}</p>
            <span className="text-right text-slate-500">Bearbeiten</span>
          </Link>
        ))}

        {customers.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-600">
            Kein Kunde gefunden.
          </div>
        ) : null}
      </div>

      {nextCursor ? (
        <div className="border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
          >
            {isPending ? "Wird geladen..." : "Mehr laden"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
