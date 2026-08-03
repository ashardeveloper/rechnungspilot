# ADR 0001: Local-first, no-cost architecture

- Status: Superseded by ADR 0002
- Date: 2026-07-30

This ADR is kept for historical context. The project direction changed to a
SaaS-style architecture with backend/database persistence, user-specific
invoices, and free-tier deployability.

## Context

RechnungsPilot DE must be built without paid libraries or services and without
direct user interaction. It still needs to demonstrate professional architecture,
security, testing, standards integration, and operational thinking.

## Decision

Build a modular monolith that runs through local Docker Compose:

- Next.js and TypeScript for the application;
- PostgreSQL for relational data;
- Prisma for migrations and data access;
- local filesystem storage behind an adapter;
- Mailpit for email delivery simulation;
- local KoSIT validation for XRechnung;
- deterministic financial and validation guidance;
- structured local logs and health endpoints;
- Vitest and Playwright for automated verification.

External payment, bank, AI, production email, cloud storage, and paid monitoring
integrations are outside scope.

## Consequences

Positive:

- reproducible without paid accounts;
- easier for a portfolio reviewer to run;
- external dependencies and privacy exposure are reduced;
- business logic can be tested deterministically.

Trade-offs:

- no real deliverability or provider-webhook behavior is demonstrated;
- product-market fit cannot be validated;
- production infrastructure behavior is simulated locally;
- commercial readiness cannot be claimed.

## Revisit conditions

Revisit only if the project constraints change and a separate implementation
batch is explicitly approved.
