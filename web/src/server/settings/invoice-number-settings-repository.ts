import { prisma } from "@/server/db/prisma";

export type InvoiceNumberSettings = {
  prefix: string;
  year: number;
  nextSequence: number;
};

const defaultSettings = {
  prefix: "RP",
  year: 2026,
  nextSequence: 4,
};

export async function getInvoiceNumberSettingsForUser(userId: string) {
  const settings = await prisma.invoiceNumberSettings.upsert({
    where: { userId },
    create: {
      id: `invoice_number_settings_${userId}`,
      userId,
      ...defaultSettings,
    },
    update: {},
  });

  return {
    prefix: settings.prefix,
    year: settings.year,
    nextSequence: settings.nextSequence,
  };
}

export async function updateInvoiceNumberSettingsForUser(
  userId: string,
  settings: InvoiceNumberSettings,
) {
  const savedSettings = await prisma.invoiceNumberSettings.upsert({
    where: { userId },
    create: {
      id: `invoice_number_settings_${userId}`,
      userId,
      ...settings,
    },
    update: settings,
  });

  return {
    prefix: savedSettings.prefix,
    year: savedSettings.year,
    nextSequence: savedSettings.nextSequence,
  };
}

export async function reserveNextInvoiceNumber(userId: string) {
  const settings = await getInvoiceNumberSettingsForUser(userId);
  const sequence = settings.nextSequence;

  await prisma.invoiceNumberSettings.update({
    where: { userId },
    data: {
      nextSequence: sequence + 1,
    },
  });

  return `${settings.prefix}-${settings.year}-${String(sequence).padStart(3, "0")}`;
}
