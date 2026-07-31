# RechnungsPilot DE — Assumption Register

Status: Active  
Last updated: 2026-07-28

Assumptions are not facts. Each material product decision should link to user
evidence, authoritative documentation, or a repeatable local experiment.

| ID | Assumption | Risk | Validation method | Status |
|---|---|---|---|---|
| A-01 | Independent IT consultants and small digital agencies are a useful synthetic first segment | Medium | Public workflow research; retain as unvalidated | Open |
| A-02 | Structured E-invoice creation or inspection causes recurring confusion | High | Public documentation and issue/review analysis | Open |
| A-03 | Existing products feel broader than this segment needs | High | Public competitor workflow comparison | Open |
| A-04 | German and English invoice content is useful | Medium | Public workflow evidence; retain as assumption | Open |
| A-05 | XRechnung is the correct first structured format | Medium | Record actual recipient requests | Open |
| A-06 | Local email/download simulation is sufficient for the portfolio MVP | Low | End-to-end local test | Open |
| A-07 | A full workflow is a stronger portfolio artifact than a converter alone | Medium | Architecture and feature-depth review | Open |
| A-08 | Payment reminders demonstrate useful workflow automation | Medium | Public competitor documentation | Open |
| A-09 | A local-first demo adequately demonstrates privacy-conscious design | Medium | Threat model and security tests | Open |
| A-10 | An export bundle is a reasonable future accountant workflow | Medium | Public product documentation only | Open |
| A-11 | Versioned validators can isolate standards migration from the invoice domain | Medium | Technical spike in Week 1/2 | Open |
| A-12 | Users may pay for the focused workflow | High | Cannot validate under current constraints; never claim | Unvalidated |

## Evidence rules

- No direct participant evidence will be collected.
- Public anecdotes are weaker than authoritative requirements.
- Competitor marketing is not proof of user pain.
- A legal/compliance claim requires an authoritative source and, before
  commercial launch, qualified review.
- Revenue, conversion, retention, and time-saved claims must come from measured
  data.

## Decision log

### 2026-07-28 — Select initial target segment

Decision: Start discovery with independent IT consultants and 2–10 person
digital agencies in Germany.

Reason: They have comparatively simple B2B service invoices, are reachable for
research, and are suitable for an initial product that does not implement
inventory or full accounting.

Revisit only if the no-user-interaction constraint changes.

### 2026-07-28 — Treat standards as versioned dependencies

Decision: Keep the canonical invoice domain separate from format serializers and
validators. Store format and validator versions with generated artifacts.

Reason: The European Commission reports that EN 16931:2026 was published in May
2026 and migration planning is ongoing. Product behavior must remain
reproducible while standards evolve.

Revisit when: The XRechnung validation technical spike is complete.
