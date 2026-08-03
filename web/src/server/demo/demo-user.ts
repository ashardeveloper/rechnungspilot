import { prisma } from "@/server/db/prisma";

export const demoUserId = "demo_user_rechnungspilot";

export async function ensureDemoUser() {
  return prisma.user.upsert({
    where: { id: demoUserId },
    create: {
      id: demoUserId,
      email: "demo@rechnungspilot.local",
      name: "RechnungsPilot Demo",
    },
    update: {},
  });
}
