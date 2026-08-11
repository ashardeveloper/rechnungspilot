import type { Customer } from "@/domain/customer";
import { prisma } from "@/server/db/prisma";

function toCustomer(customer: {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  street: string;
  postalCode: string;
  city: string;
  countryCode: string;
  vatId: string | null;
  taxNumber: string | null;
  paymentTermsDays: number;
  defaultVatRatePercent: number;
  defaultCurrency: string;
  internalNotes: string | null;
}): Customer {
  return {
    id: customer.id,
    name: customer.name,
    contactName: customer.contactName ?? undefined,
    email: customer.email ?? undefined,
    phone: customer.phone ?? undefined,
    street: customer.street,
    postalCode: customer.postalCode,
    city: customer.city,
    countryCode: "DE",
    vatId: customer.vatId ?? undefined,
    taxNumber: customer.taxNumber ?? undefined,
    paymentTermsDays: customer.paymentTermsDays,
    defaultVatRatePercent: customer.defaultVatRatePercent,
    defaultCurrency: "EUR",
    internalNotes: customer.internalNotes ?? undefined,
  };
}

export async function listCustomersForUser(userId: string) {
  const customers = await prisma.customer.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return customers.map(toCustomer);
}

export async function createCustomerForUser(
  userId: string,
  customer: Customer,
) {
  const savedCustomer = await prisma.customer.create({
    data: {
      ...customer,
      userId,
    },
  });

  return toCustomer(savedCustomer);
}

export async function updateCustomerForUser(
  userId: string,
  customer: Customer,
) {
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      id: customer.id,
      userId,
    },
  });

  if (!existingCustomer) {
    throw new Error("Customer not found.");
  }

  const savedCustomer = await prisma.customer.update({
    where: {
      id: existingCustomer.id,
    },
    data: customer,
  });

  return toCustomer(savedCustomer);
}

export async function upsertCustomerForUser(
  userId: string,
  customer: Customer,
) {
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      id: customer.id,
      userId,
    },
  });

  if (existingCustomer) {
    return updateCustomerForUser(userId, customer);
  }

  return createCustomerForUser(userId, customer);
}

export async function deleteCustomersForUser(userId: string) {
  await prisma.customer.deleteMany({
    where: { userId },
  });
}

export type CustomerSearchResult = {
  customers: Customer[];
  nextCursor?: string;
};

export async function searchCustomersForUser({
  userId,
  query,
  cursor,
  limit = 25,
}: {
  userId: string;
  query?: string;
  cursor?: string;
  limit?: number;
}): Promise<CustomerSearchResult> {
  const normalizedQuery = query?.trim();
  const take = limit + 1;

  const customers = await prisma.customer.findMany({
    where: {
      userId,
      ...(normalizedQuery
        ? {
            OR: [
              { name: { contains: normalizedQuery } },
              { city: { contains: normalizedQuery } },
              { street: { contains: normalizedQuery } },
              { contactName: { contains: normalizedQuery } },
              { email: { contains: normalizedQuery } },
            ],
          }
        : {}),
    },
    orderBy: [{ name: "asc" }, { id: "asc" }],
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take,
  });

  const page = customers.slice(0, limit);

  return {
    customers: page.map(toCustomer),
    nextCursor: customers.length > limit ? page.at(-1)?.id : undefined,
  };
}

export async function getCustomerForUser(userId: string, customerId: string) {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      userId,
    },
  });

  return customer ? toCustomer(customer) : null;
}
