# RechnungsPilot DE — Project Constraints

Status: Locked  
Effective date: 2026-07-30

## Hard constraints

1. No interviews, surveys, outreach, usability sessions, or other direct user
   interaction.
2. No paid library, API, hosting platform, database, email provider, monitoring
   service, storage service, research report, or other paid dependency.
3. No external AI or paid model API.
4. No real payment, banking, tax-filing, DATEV, ELSTER, or Peppol integration.
5. Development must work locally, but the product architecture is SaaS-style.
6. Only free/open-source dependencies with acceptable licenses may be added.
7. Repository changes require explicit approval of the proposed batch.

## Architecture direction

RechnungsPilot DE is a SaaS-style portfolio product, not a browser-only
local-first app.

The application must support local development, but the product direction is:

- Next.js web application;
- backend API routes or server actions;
- database-backed persistence;
- authenticated users;
- user-specific invoices;
- PDF export from canonical invoice data;
- technical validation for invoice completeness;
- later XRechnung XML generation and technical validation.

Browser localStorage may be used only as temporary prototype infrastructure. It
is not the final persistence architecture.

The production/demo target should use free tiers only. No paid service should be
required for portfolio-scale usage.

## Local substitutes

| External capability | Local/no-cost approach |
|---|---|
| Production email | Mailpit local inbox |
| Cloud object storage | Local filesystem adapter; optional MinIO |
| Payment provider | Manual fictional payment records |
| Bank synchronization | Fictional imported fixture data only |
| AI explanations | Deterministic guidance mapped to validation rules |
| Cloud monitoring | Structured local logs and health checks |
| Paid validation API | Local KoSIT validator |
| User interviews | Authoritative desk research and synthetic scenarios |
| Production hosting | Free-tier deployment target; local development remains supported |

## Portfolio claim boundaries

Allowed:

- Designed for a clearly stated synthetic target segment.
- Based on cited German and EU requirements.
- Passes named validator fixtures and automated tests.
- Demonstrates a production-oriented local architecture.

Not allowed:

- Claims of product-market fit.
- Claims about customer demand or willingness to pay.
- Invented users, interviews, testimonials, revenue, retention, or time savings.
- Claims of legal certification or guaranteed tax compliance.
- Claims that a local simulation is a live external integration.

## Dependency gate

Before adding a dependency, record:

- purpose;
- open-source license;
- maintenance status;
- security posture;
- alternatives considered;
- reason native/platform functionality is insufficient.
