import type { InvoiceParty } from "@/domain/invoice";
import { prisma } from "@/server/db/prisma";

const defaultBusinessProfile: InvoiceParty = {
  name: "RechnungsPilot Demo",
  street: "Musterstraße 12",
  postalCode: "10115",
  city: "Berlin",
  countryCode: "DE",
  taxNumber: "12/345/67890",
};

function toInvoiceParty(profile: {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: string;
  taxNumber: string | null;
  vatId: string | null;
}): InvoiceParty {
  return {
    name: profile.name,
    street: profile.street,
    postalCode: profile.postalCode,
    city: profile.city,
    countryCode: "DE",
    taxNumber: profile.taxNumber ?? undefined,
    vatId: profile.vatId ?? undefined,
  };
}

export async function getBusinessProfileForUser(userId: string) {
  const profile = await prisma.businessProfile.upsert({
    where: { userId },
    create: {
      id: `business_profile_${userId}`,
      userId,
      ...defaultBusinessProfile,
    },
    update: {},
  });

  return toInvoiceParty(profile);
}

export async function updateBusinessProfileForUser(
  userId: string,
  profile: InvoiceParty,
) {
  const savedProfile = await prisma.businessProfile.upsert({
    where: { userId },
    create: {
      id: `business_profile_${userId}`,
      userId,
      ...profile,
    },
    update: profile,
  });

  return toInvoiceParty(savedProfile);
}
