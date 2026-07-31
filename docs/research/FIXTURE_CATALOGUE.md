# RechnungsPilot DE — Fictional Fixture Catalogue

Status: Planned fixtures, no implementation yet  
Date: 2026-07-31

All people, companies, identifiers, addresses, invoices, and payments must be
obviously fictional. Do not use copied real invoices or valid personal tax data.

## Fixture naming convention

`<format>-<version>-<scenario>-<expected-result>`

Example: `xrechnung-3.0.2-standard-vat-valid.xml`

## Seller and buyer fixtures

| ID | Entity | Purpose |
|---|---|---|
| F-ORG-001 | Sara Consulting, fictional Berlin address | Standard seller |
| F-ORG-002 | Nordlicht Digital, fictional Hamburg address | Second tenant for isolation tests |
| F-BUY-001 | Musterwerk GmbH, fictional Munich address | Domestic B2B buyer |
| F-BUY-002 | Beispiel Behörde, explicitly fictional | Conditional buyer-reference/Leitweg-ID scenarios only |

Identifiers will use unmistakable test placeholders that pass only application
shape validation where necessary. They must never be presented as officially
issued identifiers.

## Calculation fixtures

| ID | Scenario | Expected focus |
|---|---|---|
| F-CALC-001 | One line, 19% VAT | Basic net/tax/gross |
| F-CALC-002 | Multiple quantities and decimal unit price | Decimal precision |
| F-CALC-003 | Two lines with different rounding boundaries | Line versus document rounding policy |
| F-CALC-004 | Zero-rated/exempt placeholder scenario | Explicit category/reason handling; rules researched before implementation |
| F-CALC-005 | Line discount | Allowance calculation |
| F-CALC-006 | Partial payment | Outstanding balance only, not accounting ledger |

## XRechnung fixtures

| ID | Scenario | Expected result |
|---|---|---|
| F-XR-001 | Minimal supported domestic B2B invoice | Valid under selected configuration |
| F-XR-002 | Multiple service lines | Valid |
| F-XR-003 | Missing invoice number | Invalid, mapped guidance |
| F-XR-004 | Missing buyer reference when selected scenario requires it | Invalid, mapped guidance |
| F-XR-005 | Tax subtotal inconsistent with lines | Invalid |
| F-XR-006 | Unsupported code-list value | Invalid |
| F-XR-007 | Empty optional XML element | Invalid/avoided by serializer |
| F-XR-008 | Valid UBL syntax but failing XRechnung business rule | Invalid at rule layer |
| F-XR-009 | Unsupported XRechnung version | Explicit unsupported result |

## Upload-security fixtures

| ID | Scenario | Expected result |
|---|---|---|
| F-SEC-001 | XML external entity declaration | Rejected without resolution |
| F-SEC-002 | Oversized XML | Rejected before parsing |
| F-SEC-003 | Non-XML file with `.xml` extension | Rejected by content inspection |
| F-SEC-004 | Deeply nested or expansion-heavy XML | Rejected/limited safely |
| F-SEC-005 | Malformed XML | Safe parse failure |
| F-SEC-006 | Artifact requested by another tenant | Authorization denied |

## Lifecycle fixtures

| ID | Scenario | Expected result |
|---|---|---|
| F-LIFE-001 | Edit draft | Allowed and audited where appropriate |
| F-LIFE-002 | Issue valid draft | Final number and immutable snapshot |
| F-LIFE-003 | Issue same draft twice | One issued invoice only |
| F-LIFE-004 | Edit issued financial line | Denied |
| F-LIFE-005 | Send retry | No unintended duplicate delivery record |
| F-LIFE-006 | Partial then full fictional payment | Correct outstanding status |

## Provenance required for every XML fixture

- fixture ID and purpose;
- synthetic/reference origin;
- standard and syntax version;
- expected validation result;
- validator and configuration version used;
- expected rule identifiers where invalid;
- cryptographic hash after the file is committed.

Official/reference fixtures will remain clearly distinguished from project-made
synthetic fixtures and will be added only after license/redistribution review.

