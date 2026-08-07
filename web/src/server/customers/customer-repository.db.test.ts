import { describe, expect, it } from "vitest";

import type { Customer } from "@/domain/customer";
import { prisma } from "@/server/db/prisma";
import { ensureDemoUser, demoUserId } from "@/server/demo/demo-user";

import {
  createCustomerForUser,
  deleteCustomersForUser,
  listCustomersForUser,
  searchCustomersForUser,
  updateCustomerForUser,
} from "./customer-repository";

const customer: Customer = {
  id: "customer_authorization_test",
  name: "Authorization Test GmbH",
  street: "Teststraße 1",
  postalCode: "10115",
  city: "Berlin",
  countryCode: "DE",
};

describe("customer repository authorization", () => {
  it("only updates customers owned by the current user", async () => {
    await ensureDemoUser();
    await deleteCustomersForUser(demoUserId);

    await createCustomerForUser(demoUserId, customer);

    const otherUser = await prisma.user.upsert({
      where: { id: "other_customer_user" },
      create: {
        id: "other_customer_user",
        email: "other-customer@rechnungspilot.local",
        name: "Other Customer User",
      },
      update: {},
    });

    await expect(
      updateCustomerForUser(otherUser.id, {
        ...customer,
        name: "Should Not Update",
      }),
    ).rejects.toThrow("Customer not found.");

    const customers = await listCustomersForUser(demoUserId);

    expect(customers[0].name).toBe(customer.name);

    await deleteCustomersForUser(demoUserId);
    await prisma.user.delete({
      where: { id: otherUser.id },
    });
  });
  it("searches customers for the current user only", async () => {
    await ensureDemoUser();
    await deleteCustomersForUser(demoUserId);

    await createCustomerForUser(demoUserId, {
      ...customer,
      id: "customer_search_current_user",
      name: "Searchable Berlin GmbH",
    });

    const otherUser = await prisma.user.upsert({
      where: { id: "other_customer_search_user" },
      create: {
        id: "other_customer_search_user",
        email: "other-customer-search@rechnungspilot.local",
        name: "Other Customer Search User",
      },
      update: {},
    });

    await createCustomerForUser(otherUser.id, {
      ...customer,
      id: "customer_search_other_user",
      name: "Searchable Berlin GmbH",
    });

    const results = await searchCustomersForUser({
      userId: demoUserId,
      query: "Berlin",
    });

    expect(results.customers).toHaveLength(1);
    expect(results.customers[0].id).toBe("customer_search_current_user");

    await deleteCustomersForUser(demoUserId);
    await deleteCustomersForUser(otherUser.id);
    await prisma.user.delete({
      where: { id: otherUser.id },
    });
  });

  it("returns a cursor for loading more customers", async () => {
    await ensureDemoUser();
    await deleteCustomersForUser(demoUserId);

    for (let index = 0; index < 30; index += 1) {
      await createCustomerForUser(demoUserId, {
        ...customer,
        id: `customer_cursor_${index}`,
        name: `Cursor Customer ${String(index).padStart(2, "0")}`,
      });
    }

    const firstPage = await searchCustomersForUser({
      userId: demoUserId,
      limit: 25,
    });

    expect(firstPage.customers).toHaveLength(25);
    expect(firstPage.nextCursor).toBeDefined();

    const secondPage = await searchCustomersForUser({
      userId: demoUserId,
      cursor: firstPage.nextCursor,
      limit: 25,
    });

    expect(secondPage.customers).toHaveLength(5);
    expect(secondPage.nextCursor).toBeUndefined();

    await deleteCustomersForUser(demoUserId);
  });
});
