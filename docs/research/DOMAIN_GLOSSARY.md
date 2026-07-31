# RechnungsPilot DE — Domain Glossary

Status: Initial baseline  
Last reviewed: 2026-07-31

| Term | Working definition | Engineering relevance |
|---|---|---|
| E-invoice / E-Rechnung | An invoice issued, transmitted, and received in a structured electronic format that enables electronic processing. A simple PDF is not sufficient under the post-2024 German definition. | Prevent ambiguous naming in UI and code. |
| EN 16931 | European semantic data model and associated rules for the core elements of an electronic invoice. | Canonical invoice model and validation baseline. |
| CIUS | Core Invoice Usage Specification: a constrained use of EN 16931 for a particular community or country. | XRechnung is implemented as a German CIUS plus extensions. |
| XRechnung | German structured E-invoice specification published by KoSIT. | First MVP output and input format. |
| UBL 2.1 | OASIS XML syntax supported by EN 16931/XRechnung. | First serialization syntax selected for MVP. |
| UN/CEFACT CII | Cross Industry Invoice XML syntax also supported by EN 16931/XRechnung. | Deferred syntax adapter; not silently claimed as MVP support. |
| ZUGFeRD | Hybrid format combining a PDF/A-3 visual document with embedded structured XML. | Post-MVP format; structured portion is authoritative. |
| Factur-X | French counterpart technically aligned with ZUGFeRD releases. | Interoperability/version context only. |
| PDF/A-3 | Archival PDF variant that permits embedded files. | Required foundation for hybrid ZUGFeRD generation. |
| Schematron | Rule-based validation language for assertions over XML. | Used for EN 16931/XRechnung business-rule validation. |
| XSD | XML Schema Definition used for structural/syntax validation. | One layer of validation; not sufficient alone. |
| Business Term (BT) | Semantically defined invoice field in EN 16931, such as invoice number or buyer reference. | Mapping documentation uses BT identifiers. |
| Business Group (BG) | Logical group of related EN 16931 business terms. | Helps structure the canonical model and error display. |
| Leitweg-ID | Routing/reference identifier commonly required for German public-sector invoice recipients. | Optional/conditional customer field; B2B behavior differs from B2G. |
| Buyer reference | Structured reference used to route or identify the invoice at the buyer. | Must be modelled separately from free text. |
| Seller | Supplier issuing the invoice. | Snapshotted when an invoice is issued. |
| Buyer | Recipient/customer receiving the invoice. | Snapshotted when an invoice is issued. |
| Invoice line | A billed good or service with quantity, unit, price, tax category, and description. | Calculation and serialization unit. |
| Net amount | Amount excluding VAT. | Decimal-safe deterministic calculation. |
| VAT | Value-added tax / Umsatzsteuer. | Category, rate, taxable basis, and amount must remain explicit. |
| Gross amount | Total including VAT. | Derived value; never manually trusted. |
| Credit note | Structured document reducing or reversing an amount, depending on business scenario. | Deferred until the invoice lifecycle is correct. |
| Draft invoice | Editable, non-issued working record without final artifact guarantees. | May change or be deleted. |
| Issued invoice | Finalized business record with assigned number and immutable financial snapshot. | Changes require correction/cancellation workflow. |
| Validation result | Versioned output of syntax and business-rule checks. | Stored with validator/configuration version and artifact hash. |
| Technical validity | Conformance to selected syntax and rule configuration. | Must not be presented as legal certification. |
| Canonical invoice | Internal version-independent representation from which format adapters generate artifacts. | Prevents UI/PDF/XML drift and isolates standards changes. |
| Artifact | Generated or uploaded PDF/XML file plus hash, media type, format, and version. | Enables provenance and authorized download. |
| Audit event | Append-only record of a meaningful action or state transition. | Explains who did what and when. |
| Tenant / organization | Security and ownership boundary for users and business data. | Every query and mutation must enforce it. |
| Idempotency | Repeating an operation produces no unintended duplicate effect. | Essential for issue/send/reminder workflows. |
| GoBD | German principles governing proper keeping and retention of digital books and records. | We document relevant design ideas but do not claim certified GoBD compliance. |

