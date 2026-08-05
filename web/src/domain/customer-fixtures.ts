import type { Customer } from "./customer";

export const sampleCustomers: Customer[] = [
  {
    id: "customer_musteragentur_berlin",
    name: "Musteragentur Berlin",
    street: "Invalidenstraße 45",
    postalCode: "10115",
    city: "Berlin",
    countryCode: "DE",
  },
  {
    id: "customer_schneider_it",
    name: "Schneider IT Beratung",
    street: "Hansaallee 8",
    postalCode: "60322",
    city: "Frankfurt am Main",
    countryCode: "DE",
    vatId: "DE123456789",
  },
  {
    id: "customer_atelier_nord",
    name: "Atelier Nord GmbH",
    street: "Kanalstraße 19",
    postalCode: "20359",
    city: "Hamburg",
    countryCode: "DE",
  },
];
