import type { Customer } from "@/domain/customer";
import { prisma } from "@/server/db/prisma";

function toCustomer(customer: {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: string;
  vatId: string | null;
  taxNumber: string | null;
}): Customer {
  return {
    id: customer.id,
    name: customer.name,
    street: customer.street,
    postalCode: customer.postalCode,
    city: customer.city,
    countryCode: "DE",
    vatId: customer.vatId ?? undefined,
    taxNumber: customer.taxNumber ?? undefined,
  };
}

export async function listCustomersForUser(userId: string) {
  const customers = await prisma.customer.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return customers.map(toCustomer);
}

export async function upsertCustomerForUser(
  userId: string,
  customer: Customer,
) {
  const savedCustomer = await prisma.customer.upsert({
    where: { id: customer.id },
    create: {
      ...customer,
      userId,
    },
    update: customer,
  });

  return toCustomer(savedCustomer);
}

export async function deleteCustomersForUser(userId: string) {
  await prisma.customer.deleteMany({
    where: { userId },
  });
}
