# RechnungsPilot DE — Standards Support Matrix

Status: Architecture baseline, not implemented  
Last reviewed: 2026-07-31

“Planned” does not mean currently supported. This matrix prevents accidental
overclaiming and must be updated only after passing named fixtures.

| Standard/format | Current external baseline | Project target | Release | Validation approach |
|---|---|---|---|---|
| EN 16931 | 2026 revision published; migration planning ongoing | Version-independent canonical concepts with recorded rule-set version | Foundation | Versioned adapters and fixtures |
| XRechnung | Specification 3.0.2; KoSIT Winter 2025/26 bugfix components | 3.0.2 | MVP | Local KoSIT validator/configuration |
| UBL | UBL 2.1 syntax binding | UBL 2.1 invoice first | MVP | XSD + EN 16931 rules + XRechnung rules |
| UN/CEFACT CII | Supported XRechnung syntax | Parse/generate later | Post-MVP | Separate adapter and fixtures |
| ZUGFeRD | 2.5, recommended from 2026-07-01 | EN 16931 profile only initially | Post-MVP | FeRD XSD/Schematron artifacts plus PDF/A checks |
| Factur-X | 1.09 aligned with ZUGFeRD 2.5 | No separate product claim | Deferred | Covered only when validated explicitly |
| PDF invoice | Human-readable document, not structured E-invoice alone | Deterministic visual companion | MVP | Snapshot/content tests |
| PDF/A-3 | Container basis for hybrid ZUGFeRD | Required for ZUGFeRD milestone | Post-MVP | Conformance tooling selected after license review |
| Peppol | Transport/network, not merely an invoice format | Research only; no live delivery | Out of scope | No production claim |
| GoBD | Record-keeping principles | Design alignment only | Ongoing | Audit/immutability tests; no certification claim |

## MVP syntax decision

XRechnung 3.0.2 serialized as UBL 2.1 is the first supported output because:

- KoSIT provides reference validation components and fixtures;
- one syntax keeps the initial mapping and test surface manageable;
- a second syntax can be implemented behind the same canonical interface;
- version support can be demonstrated honestly.

## Validation pipeline

1. Reject unsupported media type or oversized input.
2. Parse XML with external entities and unsafe features disabled.
3. Verify syntax/schema.
4. Evaluate EN 16931 business rules.
5. Evaluate XRechnung rules.
6. Normalize the validator report.
7. Map known rules to actionable fields without hiding the original rule ID.
8. Store artifact hash, format version, validator version, configuration version,
   timestamp, and complete report.

## Version-change policy

- Never silently revalidate historical issued artifacts under a new rule set.
- A new standard version receives a new adapter/configuration identity.
- Existing artifacts keep their original validation provenance.
- Migration fixtures must pass before a version becomes selectable.
- Unsupported versions produce an explicit result, not a generic invalid message.

## Authoritative sources

- KoSIT XRechnung: https://xeinkauf.de/xrechnung/
- KoSIT FAQ: https://xeinkauf.de/xrechnung/faq
- KoSIT support/validator: https://xeinkauf.de/xrechnung/supporthinweise/
- FeRD ZUGFeRD 2.5: https://www.ferd-net.de/en/downloads/publications/details/zugferd-25-deutsch
- European Commission EN 16931: https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108661/European%2BStandard%2Band%2BSpecifications

