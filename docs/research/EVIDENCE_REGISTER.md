# RechnungsPilot DE — Evidence Register

Status: Active  
Last reviewed: 2026-07-31

This register separates authoritative requirements from vendor claims and
product assumptions. It is not legal or tax advice.

## Evidence levels

- **A — Authoritative:** Government, standards body, or official specification.
- **B — Primary product evidence:** A vendor's own documentation of its workflow.
- **C — Anecdotal:** Public review or issue report; never treated as prevalence.
- **D — Assumption:** A design choice that has not been validated with users.

## Regulatory and standards evidence

| ID | Level | Verified statement | Product consequence | Source |
|---|---|---|---|---|
| E-001 | A | Since 1 January 2025, a simple PDF is not a structured E-invoice under the German definition. | PDF alone must never be labelled as the structured E-invoice output. | BMF E-invoice FAQ, March 2026: https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html |
| E-002 | A | Domestic businesses must be able to receive E-invoices from 1 January 2025. | Incoming structured-invoice viewing is a relevant workflow. | BMF E-invoice FAQ, questions 2 and 12 |
| E-003 | A | General transitional issuing rules run through 31 December 2026; issuers with previous-year turnover up to EUR 800,000 have an extension through 2027. | The case study describes a transition period and does not oversimplify the mandate. | BMF E-invoice FAQ, question 11 |
| E-004 | A | XRechnung and qualifying ZUGFeRD versions are common German formats meeting the tax requirements; MINIMUM and BASIC-WL are excluded. | Format/profile support must be explicit rather than saying all ZUGFeRD files are compliant. | BMF E-invoice FAQ, question 7 |
| E-005 | A | All invoice-required tax information must be present in the structured portion. | Attachments and PDF text cannot compensate for missing structured required data. | BMF E-invoice FAQ, question 7a |
| E-006 | A | Validation is recommended before issuing, although validation alone is not a direct condition for tax recognition. | UI wording is “technical validation,” never “legally certified.” | BMF E-invoice FAQ, question 7 |
| E-007 | A | In hybrid invoices, structured data is authoritative if it differs from the visual PDF. | Canonical structured data generates both outputs; drift is tested. | BMF E-invoice FAQ, question 12a |
| E-008 | A | The current published XRechnung specification is 3.0.2. | First serializer and validator adapter target XRechnung 3.0.2. | KoSIT XRechnung page: https://xeinkauf.de/xrechnung/ |
| E-009 | A | KoSIT publishes validator, validator configuration, tests, and visualization components. | Use local open-source/reference artifacts instead of a paid validation API. | KoSIT support/specification pages: https://xeinkauf.de/xrechnung/supporthinweise/ |
| E-010 | A | XRechnung rules apply to existing UBL and UN/CEFACT CII syntaxes; there is no XRechnung-only XSD. | Implement syntax validation plus EN 16931 and XRechnung business rules. | KoSIT FAQ: https://xeinkauf.de/xrechnung/faq |
| E-011 | A | ZUGFeRD 2.5 was released on 10 June 2026 and is recommended from 1 July 2026. | Later ZUGFeRD work targets 2.5, not older tutorial versions. | FeRD release: https://www.ferd-net.de/en/downloads/publications/details/zugferd-25-deutsch |
| E-012 | A | ZUGFeRD 2.5 embeds structured XML in PDF/A-3 and provides profile-specific validation artifacts. | Hybrid-file generation requires PDF/A-3 and explicit profile/version metadata. | FeRD ZUGFeRD 2.5 information package page |
| E-013 | A | EN 16931:2026 was published in May 2026 and migration planning is ongoing; the 2017 version remains compliant during migration. | Standards adapters and fixtures are versioned dependencies. | European Commission: https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108661/European%2BStandard%2Band%2BSpecifications |

## Product-workflow evidence

| ID | Level | Observed public capability | What it proves | Source |
|---|---|---|---|---|
| E-101 | B | Lexware Office exposes missing-field guidance, PDF preview, XRechnung download, sending, and incoming invoice processing. | These capabilities exist in a mature competitor; it does not prove dissatisfaction. | https://www.lexware.de/funktionen/xrechnung/ |
| E-102 | B | sevdesk publicly documents XRechnung/ZUGFeRD creation, upload/processing, open-invoice status, and reminders. | Lifecycle breadth is an established competitor pattern. | https://sevdesk.de/preise/ |
| E-103 | B | Papierkram documents drafts, immutable finalized invoices, cancellation, structured upload/visualization, and validation. | Draft/finalized separation and readable incoming XML are established workflows. | https://hilfe.papierkram.de/rechnungen/ and https://www.papierkram.de/lp/ |

## Explicit unknowns

The project cannot establish the following under its constraints:

- willingness to pay;
- frequency or severity of user pain;
- preference for a full invoicing workflow versus a converter;
- actual adoption, retention, or time savings;
- whether the synthetic target segment is the best commercial segment.

