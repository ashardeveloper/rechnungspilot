# ADR 0002: SaaS-Style Free-Tier Architecture

- Status: Accepted
- Date: 2026-08-03

## Context

RechnungsPilot DE is intended as a serious German-market portfolio SaaS product.
The earlier local-first direction does not match the target story strongly
enough because the product should demonstrate authenticated users, backend
persistence, database modelling, and deployable SaaS workflows.

The project must still avoid paid requirements for portfolio-scale usage.

## Decision

Build RechnungsPilot DE as a SaaS-style application.

The target architecture is:

- Next.js web application;
- backend API routes or server actions;
- Prisma ORM;
- database-backed invoice persistence;
- authenticated users;
- user-owned invoices;
- PDF export from canonical invoice data;
- technical validation before export;
- later XRechnung XML generation and technical validation.

Local development may use SQLite initially to avoid Docker requirements.
Production/demo deployment should remain compatible with free-tier PostgreSQL
providers.

## Consequences

The existing domain model, calculation helpers, validation, invoice editor, and
preview remain useful.

localStorage is treated as temporary prototype infrastructure and should be
replaced by database-backed persistence.

Future implementation should avoid expanding browser-only storage as the main
architecture.

The product must not claim legal certification, tax filing, DATEV integration,
ELSTER integration, Peppol connectivity, banking, or payment processing.

## Revisit Conditions

Revisit this decision only if:

- a free-tier deployment target becomes unavailable;
- local development cannot remain reproducible without paid services;
- authentication or persistence constraints require a different architecture;
- the user explicitly changes the product direction again.
