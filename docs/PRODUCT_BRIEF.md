# RechnungsPilot DE — Product Brief

Status: Discovery draft  
Date: 2026-07-28  
Owner: Product/Engineering  
Validation state: Desk research and synthetic workflow analysis

## 1. One-sentence product

RechnungsPilot DE helps Germany-based independent IT consultants and small
digital agencies create, validate, send, receive, and track structured
E-invoices without requiring them to learn XML or operate a complete accounting
suite. The target segment is a synthetic design persona, not a validated
customer segment.

## 2. Why now

Since 1 January 2025, a simple PDF is no longer considered a structured
E-invoice under the new German rules. Domestic businesses must be able to
receive E-invoices, while transitional rules for issuing them expire in stages.
Common German formats include XRechnung and qualifying ZUGFeRD profiles.

The product opportunity is not "another invoice template." It is a focused
workflow that makes structured invoice data understandable, validates it before
delivery, and tracks what happens afterward.

This brief is product planning, not legal or tax advice. Regulatory behavior
must be checked against authoritative sources and reviewed by a qualified expert
before commercial claims are made.

## 3. Initial target segment

### Primary beachhead

Germany-based:

- independent software consultants;
- freelance developers;
- UX/UI designers and technical consultants;
- digital agencies with 2–10 people.

### Why start here

- They commonly deliver time-based or fixed-price B2B services.
- They are comfortable adopting cloud software.
- Their invoice structure is simpler than inventory-heavy businesses.
- They may invoice German companies or public-sector customers.
- Their public workflows and documented requirements can be studied without
  direct user interaction.

### Excluded from the first release

- retailers and cash-register businesses;
- payroll-heavy businesses;
- inventory and logistics businesses;
- medical billing;
- construction-specific billing;
- full accounting or tax-filing workflows;
- cross-border VAT edge cases.

## 4. Persona hypothesis

### Primary persona: Sara, independent IT consultant

- Location: Berlin, Germany
- Business: Solo consultant
- Customers: German startups and mid-sized businesses
- Invoice volume: Hypothesis — 5–20 invoices per month
- Current tools: Hypothesis — document template plus spreadsheet or lightweight
  invoicing software
- Language: German and English
- Accounting relationship: Sends documents to a tax adviser

### Jobs to be done

When Sara finishes client work, she wants to:

1. create a correct invoice without re-entering repeated data;
2. know whether the structured invoice contains required information;
3. send it in a format her business customer can process;
4. retain the exact issued document and its history;
5. see which invoices are due or overdue;
6. hand organized records to her tax adviser.

### Suspected pain points

These are hypotheses, not established facts:

- XRechnung XML is not human-friendly.
- It is unclear which fields are required for a particular recipient.
- PDF and structured data can drift apart.
- validation messages are too technical;
- invoice follow-up is manual;
- documents and payment status live in different places.

## 5. Problem statement

Small service businesses need to exchange machine-readable invoices, but the
standards, required fields, validation results, and invoice lifecycle are
difficult to understand. Existing accounting suites may solve much more than
this user needs. A focused tool can reduce uncertainty and manual work without
claiming to replace accounting or professional tax advice.

## 6. Value proposition

### Functional value

- One canonical invoice record produces consistent human- and machine-readable
  outputs.
- Validation runs before delivery.
- Technical validation errors are translated into actionable form guidance.
- Incoming XML is rendered as a readable invoice.
- Status and reminder history remain attached to the invoice.

### Emotional value

- Confidence before sending an invoice.
- Less anxiety around unfamiliar structured formats.
- Clear visibility into unpaid work.

### Business value

- Fewer rejected invoices.
- Less repeated data entry.
- Faster correction and follow-up.
- Better organized handoff to an accountant.

These outcomes are design goals and will not be published as measured benefits.

## 7. Core workflow

1. User creates an account and an organization.
2. User enters business identity and payment details.
3. User creates or selects a customer.
4. User adds service lines and payment terms.
5. The system calculates totals deterministically.
6. The system maps the invoice to a canonical structured representation.
7. The system generates and validates XRechnung.
8. The user resolves actionable validation errors.
9. The user issues and sends the invoice.
10. The product records delivery, due date, reminders, and payment state.

## 8. MVP outcome

A user can complete this end-to-end task:

> Configure a German service business, create a customer and invoice, validate
> an XRechnung, issue it, send it, download both structured and human-readable
> representations, and track its payment status.

## 9. MVP capabilities

### Required

- secure authentication;
- organization and membership model;
- business profile;
- customer and service records;
- deterministic invoice calculations;
- draft and issued invoice lifecycle;
- PDF preview/download;
- XRechnung generation;
- versioned validation;
- actionable validation report;
- local email-delivery simulation;
- due/overdue/paid tracking;
- audit trail;
- German and English UI;
- automated tests and local production-style deployment.

### Later

- incoming XRechnung viewer;
- ZUGFeRD workflow;
- recurring invoices;
- reminder automation;
- accountant export bundle;
- credit notes;
- team invitations.

### Explicitly not in MVP

- bookkeeping ledger;
- tax returns or ELSTER submission;
- DATEV or Peppol integration;
- banking integration;
- receipt OCR;
- external AI or model APIs;
- payroll, inventory, or CRM;
- legal guarantee of compliance.

## 10. Product principles

1. Deterministic, tested rules decide and explain validation outcomes.
2. Structured invoice data is the source of truth.
3. Issued financial records are immutable; corrections create traceable events.
4. Every organization boundary is enforced server-side.
5. Validation is versioned and reproducible.
6. Compliance claims remain narrow, explicit, and evidence-based.
7. Complexity must be earned by a real requirement.
8. German and English are product behavior, not a final translation pass.

## 11. Initial success criteria

### Discovery

- maintain an authoritative-source evidence register;
- document at least three public competitor workflows;
- separate verified requirements from synthetic assumptions;
- build representative fictional invoice fixtures;
- avoid claims about willingness to switch or pay.

### Prototype

- scripted browser tests complete the invoice-creation journey;
- deterministic validation fixtures produce expected guidance;
- draft-to-valid-document performance is benchmarked locally;
- no cross-organization access succeeds in security tests.

### Portfolio MVP

- locally deployable end-to-end workflow;
- valid reference fixtures pass the selected validator;
- calculation and authorization invariants have automated tests;
- architecture and trade-offs are documented;
- all published user/revenue metrics are real and reproducible.

## 12. Major risks

| Risk | Impact | Initial response |
|---|---|---|
| Mature competitors already cover invoicing | High | Focus on a narrow workflow and validate willingness to switch |
| Regulatory/standard changes | High | Versioned format adapters, validators, fixtures, and metadata |
| Product interpreted as tax advice | High | Narrow claims, clear boundaries, expert review before launch |
| Incorrect totals or rounding | High | Decimal-safe deterministic engine and exhaustive scenario tests |
| Tenant data leakage | Critical | Central authorization policies and cross-tenant regression tests |
| Untrusted XML/file uploads | High | Defensive parser, size/type limits, isolated processing |
| Scope expands into accounting | High | Maintain explicit non-goals and milestone gates |
| Product shape may not match real user preferences | Medium | State as a limitation and compare public competitor workflows |

## 13. Decisions made

- Initial segment: independent IT consultants and small digital agencies.
- Initial architecture: modular monolith.
- First structured format: XRechnung.
- First delivery channel: secure download and local Mailpit email simulation.
- External AI is excluded from the project.

## 14. Open questions

1. Do target users create invoices themselves or delegate to a tax adviser?
2. Which tool do they currently use?
3. Are they already sending XRechnung, or only receiving it?
4. Which recipients reject or request corrections most often?
5. Is an integrated invoicing product desirable, or would a validator/converter
   fit their workflow better?
6. Which export does their tax adviser actually request?
7. Are German and English invoice descriptions both necessary?
8. What invoice volume and pricing model feel natural?
9. Real delivery-channel preference remains unvalidated.
10. Which data are users unwilling to place in a cloud product?

## 15. Authoritative references

- German Federal Ministry of Finance, E-invoice FAQ, updated March 2026:
  https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html
- German Federal startup portal, mandatory invoice information:
  https://www.existenzgruendungsportal.de/Redaktion/DE/Downloads/DE/Checklisten-Uebersichten/Steuern-Versicherungen-Preiskalkulation/05_uebersicht-Das-gehoert-in-eine-Rechnung.pdf
- European Commission, EN 16931 standard and migration information:
  https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108661/European%2BStandard%2Band%2BSpecifications
- KoSIT/XRechnung information:
  https://xeinkauf.de/
