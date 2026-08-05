"use server";

import { getCurrentUserId } from "@/server/auth/current-user";
import { listCustomersForUser } from "@/server/customers/customer-repository";
import { seedDemoCustomers } from "@/server/demo/seed-demo-customers";

export async function listCustomersAction() {
  const userId = await getCurrentUserId();

  const customers = await listCustomersForUser(userId);

  if (customers.length > 0) {
    return customers;
  }

  await seedDemoCustomers();

  return listCustomersForUser(userId);
}
