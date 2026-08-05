import { describe, expect, it } from "vitest";

import type { Customer } from "@/domain/customer";
import { prisma } from "@/server/db/prisma";
import { ensureDemoUser, demoUserId } from "@/server/demo/demo-user";

import {
  createCustomerForUser,
  deleteCustomersForUser,
  listCustomersForUser,
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
});
