import { demoUserId, ensureDemoUser } from "@/server/demo/demo-user";

export async function getCurrentUserId() {
  const user = await ensureDemoUser();

  return user.id;
}

export { demoUserId };
