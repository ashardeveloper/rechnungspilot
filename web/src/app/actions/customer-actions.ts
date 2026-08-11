"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/current-user";
import { seedDemoCustomers } from "@/server/demo/seed-demo-customers";
import type { Customer } from "@/domain/customer";

import {
  listCustomersForUser,
  searchCustomersForUser,
  upsertCustomerForUser,
  updateCustomerForUser,
  getCustomerForUser,
} from "@/server/customers/customer-repository";

export async function listCustomersAction() {
  const userId = await getCurrentUserId();

  const customers = await listCustomersForUser(userId);

  if (customers.length > 0) {
    return customers;
  }

  await seedDemoCustomers();

  return listCustomersForUser(userId);
}

export async function createCustomerAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const customer: Customer = {
    id: `customer_${crypto.randomUUID()}`,
    name: String(formData.get("name") ?? "").trim(),
    contactName: String(formData.get("contactName") ?? "").trim() || undefined,
    email: String(formData.get("email") ?? "").trim() || undefined,
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    street: String(formData.get("street") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    countryCode: "DE",
    vatId: String(formData.get("vatId") ?? "").trim() || undefined,
    taxNumber: String(formData.get("taxNumber") ?? "").trim() || undefined,
    paymentTermsDays: Number(formData.get("paymentTermsDays") ?? 14),
    defaultVatRatePercent: Number(formData.get("defaultVatRatePercent") ?? 19),
    defaultCurrency: "EUR",
    internalNotes:
      String(formData.get("internalNotes") ?? "").trim() || undefined,
  };

  await upsertCustomerForUser(userId, customer);
  revalidatePath("/customers");
  revalidatePath("/invoices");
}

export async function updateCustomerAction(formData: FormData) {
  const userId = await getCurrentUserId();

  await updateCustomerForUser(userId, {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? "").trim(),
    contactName: String(formData.get("contactName") ?? "").trim() || undefined,
    email: String(formData.get("email") ?? "").trim() || undefined,
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    street: String(formData.get("street") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    countryCode: "DE",
    vatId: String(formData.get("vatId") ?? "").trim() || undefined,
    taxNumber: String(formData.get("taxNumber") ?? "").trim() || undefined,
    paymentTermsDays: Number(formData.get("paymentTermsDays") ?? 14),
    defaultVatRatePercent: Number(formData.get("defaultVatRatePercent") ?? 19),
    defaultCurrency: "EUR",
    internalNotes:
      String(formData.get("internalNotes") ?? "").trim() || undefined,
  });

  revalidatePath("/customers");
  revalidatePath("/invoices");
}

export async function searchCustomersAction({
  query,
  cursor,
}: {
  query?: string;
  cursor?: string;
}) {
  const userId = await getCurrentUserId();

  const result = await searchCustomersForUser({
    userId,
    query,
    cursor,
    limit: 25,
  });

  if (result.customers.length > 0 || query || cursor) {
    return result;
  }

  await seedDemoCustomers();

  return searchCustomersForUser({
    userId,
    query,
    cursor,
    limit: 25,
  });
}

export async function getCustomerAction(customerId: string) {
  const userId = await getCurrentUserId();

  return getCustomerForUser(userId, customerId);
}
