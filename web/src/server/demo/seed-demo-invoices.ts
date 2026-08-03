import { sampleInvoices } from "@/domain/invoice-fixtures";
import { ensureDemoUser, demoUserId } from "@/server/demo/demo-user";
import { upsertInvoiceForUser } from "@/server/invoices/invoice-repository";

export async function seedDemoInvoices() {
  await ensureDemoUser();

  for (const invoice of sampleInvoices) {
    await upsertInvoiceForUser(demoUserId, invoice);
  }
}
