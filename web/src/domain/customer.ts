import type { InvoiceParty } from "./invoice";

export type Customer = {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: "DE";
  vatId?: string;
  taxNumber?: string;
};

export function customerToInvoiceParty(customer: Customer): InvoiceParty {
  return {
    name: customer.name,
    street: customer.street,
    postalCode: customer.postalCode,
    city: customer.city,
    countryCode: customer.countryCode,
    vatId: customer.vatId,
    taxNumber: customer.taxNumber,
  };
}
