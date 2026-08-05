import { sampleInvoices } from "@/domain/invoice-fixtures";
import { ensureDemoUser, demoUserId } from "@/server/demo/demo-user";
import { upsertInvoiceForUser } from "@/server/invoices/invoice-repository";
import { seedDemoCustomers } from "./seed-demo-customers";

export async function seedDemoInvoices() {
  await ensureDemoUser();
  await seedDemoCustomers();

  for (const invoice of sampleInvoices) {
    await upsertInvoiceForUser(demoUserId, invoice);
  }
}
