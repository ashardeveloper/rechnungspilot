import {
  calculateLineNetAmountCents,
  calculateLineVatAmountCents,
} from "@/domain/invoice-calculations";
import type { CanonicalInvoice, InvoiceLineItem } from "@/domain/invoice";

function escapeXml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatAmount(cents: number) {
  return (cents / 100).toFixed(2);
}

function formatDate(date: string) {
  return date.replaceAll("-", "");
}

function unitCode(unit: InvoiceLineItem["unit"]) {
  if (unit === "hour") {
    return "HUR";
  }

  if (unit === "day") {
    return "DAY";
  }

  return "C62";
}

export function renderXRechnungXml(invoice: CanonicalInvoice) {
  const lineXml = invoice.lineItems
    .map((item, index) => {
      const lineNet = calculateLineNetAmountCents(item);
      const lineVat = calculateLineVatAmountCents(item);

      return `    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        <ram:LineID>${index + 1}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${escapeXml(item.description)}</ram:Name>
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${formatAmount(item.unitPriceCents)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="${unitCode(item.unit)}">${item.quantity}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>${item.vatRatePercent === 0 ? "E" : "S"}</ram:CategoryCode>
          <ram:RateApplicablePercent>${item.vatRatePercent}</ram:RateApplicablePercent>
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${formatAmount(lineNet)}</ram:LineTotalAmount>
          <ram:TaxTotalAmount>${formatAmount(lineVat)}</ram:TaxTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- RechnungsPilot DE technical XML draft. This is not legal certification and not KoSIT validation. -->
<rsm:CrossIndustryInvoice
  xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
  xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
  xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${escapeXml(invoice.number)}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${formatDate(invoice.issueDate)}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
${lineXml}
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${escapeXml(invoice.seller.name)}</ram:Name>
        <ram:PostalTradeAddress>
          <ram:PostcodeCode>${escapeXml(invoice.seller.postalCode)}</ram:PostcodeCode>
          <ram:LineOne>${escapeXml(invoice.seller.street)}</ram:LineOne>
          <ram:CityName>${escapeXml(invoice.seller.city)}</ram:CityName>
          <ram:CountryID>${invoice.seller.countryCode}</ram:CountryID>
        </ram:PostalTradeAddress>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${escapeXml(invoice.buyer.name)}</ram:Name>
        <ram:PostalTradeAddress>
          <ram:PostcodeCode>${escapeXml(invoice.buyer.postalCode)}</ram:PostcodeCode>
          <ram:LineOne>${escapeXml(invoice.buyer.street)}</ram:LineOne>
          <ram:CityName>${escapeXml(invoice.buyer.city)}</ram:CityName>
          <ram:CountryID>${invoice.buyer.countryCode}</ram:CountryID>
        </ram:PostalTradeAddress>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>${invoice.currency}</ram:InvoiceCurrencyCode>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${formatAmount(invoice.totals.netAmountCents)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${formatAmount(invoice.totals.netAmountCents)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="${invoice.currency}">${formatAmount(invoice.totals.vatAmountCents)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${formatAmount(invoice.totals.grossAmountCents)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${formatAmount(invoice.totals.grossAmountCents)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>
`;
}
