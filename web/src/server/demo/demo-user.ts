import { hashPassword } from "@/server/auth/password";
import { prisma } from "@/server/db/prisma";

export const demoUserEmail = "demo@rechnungspilot.local";
export const demoUserPassword = "rechnungspilot-demo";
export const demoUserId = "demo_user_rechnungspilot";

export async function ensureDemoUser() {
  const passwordHash = await hashPassword(demoUserPassword);

  return prisma.user.upsert({
    where: { id: demoUserId },
    create: {
      id: demoUserId,
      email: demoUserEmail,
      name: "RechnungsPilot Demo",
      passwordHash,
    },
    update: {
      email: demoUserEmail,
      name: "RechnungsPilot Demo",
      passwordHash,
    },
  });
}
