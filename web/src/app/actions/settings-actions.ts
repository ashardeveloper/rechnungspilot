"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/server/auth/current-user";
import {
  getInvoiceNumberSettingsForUser,
  updateInvoiceNumberSettingsForUser,
} from "@/server/settings/invoice-number-settings-repository";
import type { InvoiceParty } from "@/domain/invoice";
import {
  getBusinessProfileForUser,
  updateBusinessProfileForUser,
} from "@/server/settings/business-profile-repository";

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

export async function getBusinessProfileAction() {
  const userId = await getCurrentUserId();

  return getBusinessProfileForUser(userId);
}

export async function updateBusinessProfileAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const profile: InvoiceParty = {
    name: String(formData.get("name") ?? "").trim(),
    street: String(formData.get("street") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    countryCode: "DE",
    taxNumber: String(formData.get("taxNumber") ?? "").trim() || undefined,
    vatId: String(formData.get("vatId") ?? "").trim() || undefined,
  };

  await updateBusinessProfileForUser(userId, profile);

  revalidatePath("/settings");
  revalidatePath("/invoices");
}
