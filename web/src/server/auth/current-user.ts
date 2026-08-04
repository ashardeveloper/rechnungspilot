import { auth } from "@/server/auth/auth";

export async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }

  return session.user.id;
}
