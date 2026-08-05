"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/server/auth/current-user";
import { listCustomersForUser } from "@/server/customers/customer-repository";
import { seedDemoCustomers } from "@/server/demo/seed-demo-customers";
import type { Customer } from "@/domain/customer";
import { upsertCustomerForUser } from "@/server/customers/customer-repository";

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
    street: String(formData.get("street") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    countryCode: "DE",
    vatId: String(formData.get("vatId") ?? "").trim() || undefined,
    taxNumber: String(formData.get("taxNumber") ?? "").trim() || undefined,
  };

  await upsertCustomerForUser(userId, customer);
  revalidatePath("/customers");
  revalidatePath("/invoices");
}
