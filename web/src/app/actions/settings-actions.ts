"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/server/auth/current-user";
import {
  getInvoiceNumberSettingsForUser,
  updateInvoiceNumberSettingsForUser,
} from "@/server/settings/invoice-number-settings-repository";

export async function getInvoiceNumberSettingsAction() {
  const userId = await getCurrentUserId();

  return getInvoiceNumberSettingsForUser(userId);
}

export async function updateInvoiceNumberSettingsAction(formData: FormData) {
  const userId = await getCurrentUserId();

  await updateInvoiceNumberSettingsForUser(userId, {
    prefix: String(formData.get("prefix") ?? "RP").trim() || "RP",
    year: Number.parseInt(String(formData.get("year") ?? "2026"), 10),
    nextSequence: Number.parseInt(
      String(formData.get("nextSequence") ?? "1"),
      10,
    ),
  });

  revalidatePath("/settings");
}
