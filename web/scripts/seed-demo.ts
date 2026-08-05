import { prisma } from "../src/server/db/prisma";
import { seedDemoInvoices } from "../src/server/demo/seed-demo-invoices";

async function main() {
  await seedDemoInvoices();

  const invoiceCount = await prisma.invoice.count();
  const userCount = await prisma.user.count();
  const customerCount = await prisma.customer.count();

  console.log(
    `Seeded ${userCount} user(s), ${customerCount} customer(s), and ${invoiceCount} invoice(s).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
