import { sampleCustomers } from "@/domain/customer-fixtures";
import { upsertCustomerForUser } from "@/server/customers/customer-repository";
import { ensureDemoUser, demoUserId } from "@/server/demo/demo-user";

export async function seedDemoCustomers() {
  await ensureDemoUser();

  for (const customer of sampleCustomers) {
    await upsertCustomerForUser(demoUserId, customer);
  }
}
