# RechnungsPilot DE — Synthetic Persona and Workflow

Status: Design fixture, not user research  
Date: 2026-07-31

No real person, interview, or customer is represented here.

## Persona RP-P01: Sara Weber

- Fictional role: independent software consultant
- Fictional location: Berlin, Germany
- Business form: sole proprietor
- Languages: German and English
- Work: fixed-price architecture review and time-based implementation services
- Buyers: fictional German private companies
- Accounting: outside the product scope

## Scenario RP-S01: Domestic B2B service invoice

Sara completes a fictional architecture review for Musterwerk GmbH. She needs to
create an invoice, verify its structured data, issue it, send it to a local test
inbox, and record a fictional payment.

### Happy-path workflow

1. Sign in and select Sara Consulting.
2. Complete seller identity and payment details.
3. Create buyer Musterwerk GmbH.
4. Create a draft invoice with one fixed-price service line.
5. Review deterministic net, VAT, and gross totals.
6. Generate a preview without issuing.
7. Run pre-issue XRechnung validation.
8. Fix any field-linked validation problem.
9. Issue the invoice; assign the final number and snapshot all financial data.
10. Generate XRechnung XML and human-readable PDF from the same canonical data.
11. Deliver the artifacts to Mailpit.
12. Record a fictional full payment.
13. Inspect the audit timeline.

### Required observable outcomes

- Draft remains editable before issue.
- Financial totals cannot rely on binary floating point.
- Issued financial snapshot cannot be edited in place.
- XML and PDF show the same seller, buyer, lines, dates, and totals.
- Validation report records versions and artifact hash.
- Another organization cannot access the invoice or artifacts.
- Repeating issue/send commands does not create unintended duplicates.

## Failure scenario RP-S02: Missing buyer reference

The selected validation scenario requires a buyer reference, but it is absent.

Expected behavior:

- pre-issue validation fails;
- the original rule identifier remains visible;
- guidance links to the exact form field;
- the product does not call the invoice “illegal” or offer legal advice;
- after correction, a new validation run is stored separately.

## Failure scenario RP-S03: Cross-tenant file request

A member of another fictional organization requests Sara's artifact URL.

Expected behavior:

- server-side authorization denies access;
- response reveals no invoice metadata;
- the denial is security-tested;
- logs contain identifiers needed for diagnosis but no sensitive invoice body.

## Failure scenario RP-S04: Unsafe incoming XML

An uploaded XML contains a prohibited external entity or exceeds configured size.

Expected behavior:

- processing stops before business-rule validation;
- no external resource is resolved;
- a safe, generic upload error is returned;
- the event is logged without echoing unsafe content.

## Limitations

This workflow demonstrates engineering behavior only. It does not prove that a
real consultant wants this product, finds it usable, or would pay for it.

