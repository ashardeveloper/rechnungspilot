# RechnungsPilot DE — Implementation and Learning Plan

## 1. Product vision

RechnungsPilot DE is a compliance-first E-invoice workflow for German freelancers
and small service businesses. It helps users create, validate, send, receive, and
track structured invoices without pretending to replace a tax adviser.

### Primary user

A German freelancer or a 1–20 person service business that:

- sends B2B invoices;
- needs XRechnung or ZUGFeRD support;
- wants payment-status tracking and reminders;
- does not want a full accounting suite;
- may work in German and English.

### Product promise

> Create, understand, validate, send, and track German E-invoices with confidence.

### Portfolio promise

The project will demonstrate product discovery, domain modelling, TypeScript,
relational databases, multi-tenant SaaS design, secure authentication and
authorization, XML/PDF processing, standards-based validation, background jobs,
local email simulation, testing, CI/CD, observability, and deterministic
automation.

## 2. Scope boundaries

### MVP includes

- user authentication;
- organization onboarding;
- organization membership and roles;
- customer and service catalogue;
- invoice drafts and immutable issued invoices;
- deterministic totals and VAT calculations;
- human-readable PDF preview;
- XRechnung XML generation;
- standards-based validation;
- local email-delivery simulation;
- invoice status and payment tracking;
- German and English UI;
- audit trail;
- automated tests, CI, local deployment, and monitoring.

### MVP does not include

- full bookkeeping or tax filing;
- legal or tax advice;
- automatic ELSTER submission;
- direct DATEV, Peppol, or bank integration;
- external AI or model APIs;
- payroll, inventory, or cash-register functionality;
- support for every international tax scenario.

These may become later releases only after authoritative desk research, public
workflow evidence, or repeatable local experiments.

## 3. Initial technical direction

The architecture will start as a modular monolith. This keeps deployment and
debugging manageable while preserving clear domain boundaries.

- Web application and server: Next.js with TypeScript
- Database: PostgreSQL
- ORM and migrations: Prisma
- Styling and accessible components: Tailwind CSS plus a small component system
- Validation: Zod at application boundaries
- Authentication: established session-based authentication library
- File storage: local filesystem behind a storage adapter
- Email testing: local Mailpit inbox
- Unit/integration tests: Vitest
- Browser tests: Playwright
- Local infrastructure: Docker Compose
- CI: GitHub Actions
- Monitoring: local structured logs and health checks

No Redis, separate Express server, MongoDB, microservices, or queue infrastructure
will be added until a demonstrated requirement justifies them.

## 4. Professional development workflow

Every feature follows the same loop:

1. Write the user story and acceptance criteria.
2. Model the domain and identify invariants.
3. Threat-model sensitive paths and list edge cases.
4. Design the smallest vertical slice.
5. Implement it with tests.
6. Review naming, boundaries, accessibility, and failure states.
7. Update documentation and the decision log.
8. Commit a complete, working change.
9. Deploy and verify the behavior in a production-like environment.

Definition of done for every feature:

- acceptance criteria pass;
- authorization is enforced server-side;
- relevant tests pass;
- loading, empty, success, and error states exist;
- user-facing text works in German and English where applicable;
- logs contain no secrets or sensitive invoice content;
- documentation is updated;
- the feature works from a clean setup.

## 5. Phase and week plan

The schedule assumes approximately 12–15 focused hours per week. If less time is
available, preserve the sequence and extend the calendar rather than cutting
testing or security.

### Phase 0 — Discovery and foundation

#### Week 1 — Evidence-based desk research and domain analysis

Learning:

- difference between PDF invoices and structured E-invoices;
- basic concepts of EN 16931, XRechnung, and ZUGFeRD;
- German invoice terminology and lifecycle;
- distinction between product assistance and tax/legal advice.

Build:

- product requirements document;
- three user personas and their jobs-to-be-done;
- authoritative-source evidence register;
- competitor comparison based on verified features and pricing;
- glossary of domain terms;
- first user-story map;
- risk register;
- architecture decision record for the modular monolith.

Deliverable:

- a reviewed MVP scope with explicit non-goals.

Exit criteria:

- one primary user segment is selected;
- the core workflow can be explained in one sentence;
- at least five potential users have been approached for discovery;
- every MVP feature maps to a user problem.

#### Week 2 — Engineering foundation

Learning:

- strict TypeScript and server/client boundaries;
- relational modelling, migrations, and constraints;
- container-based local development;
- CI fundamentals and environment configuration.

Build:

- initialize the application;
- configure strict TypeScript, linting, formatting, and import conventions;
- PostgreSQL development container;
- Prisma setup and first migration;
- environment-variable validation;
- test framework and first unit/integration/browser tests;
- GitHub Actions checks;
- application shell, error boundary, health endpoint, and structured logging;
- contributor setup documentation.

Deliverable:

- a clean clone can be installed, tested, and run using documented commands.

Exit criteria:

- build, lint, type-check, and tests pass locally and in CI;
- no secret is committed;
- database reset and migration workflow is documented.

### Phase 1 — Secure SaaS foundation

#### Week 3 — Authentication, organizations, and authorization

Learning:

- authentication versus authorization;
- secure sessions and cookie settings;
- password/provider security;
- tenant isolation and broken-access-control risks.

Build:

- sign-up, sign-in, sign-out, and account recovery;
- organization creation;
- organization membership;
- `OWNER`, `ADMIN`, and `MEMBER` roles;
- centralized authorization policy functions;
- protected application layout;
- security event logging;
- rate limiting on sensitive endpoints.

Deliverable:

- users can securely access only organizations they belong to.

Exit criteria:

- cross-organization access tests fail safely;
- unauthenticated and unauthorized states are covered;
- sensitive cookies and redirects are configured safely.

#### Week 4 — Business onboarding, customers, and services

Learning:

- domain modelling and database constraints;
- VAT identifier versus tax number;
- accessible form design and server-side validation.

Build:

- organization business profile;
- invoice sender details and bank/payment information;
- customer CRUD;
- customer billing address and identifiers;
- service/product catalogue;
- paginated search and filtering;
- onboarding completion checklist;
- audit events for sensitive changes.

Deliverable:

- an organization can prepare all master data required for an invoice.

Exit criteria:

- duplicate and invalid data are handled predictably;
- all mutations enforce organization ownership;
- empty, loading, validation, and failure states are present.

### Phase 2 — Core invoicing

#### Week 5 — Invoice domain and deterministic calculation engine

Learning:

- money representation and rounding;
- invoice numbering and uniqueness;
- state machines and immutable business records;
- net, tax, and gross calculations.

Build:

- invoice, invoice-line, tax, payment-term, and status models;
- draft invoice editor;
- deterministic calculation module using decimal-safe arithmetic;
- invoice numbering strategy;
- draft-to-issued state transition;
- snapshot customer and seller data at issue time;
- unit tests for calculation and rounding edge cases.

Deliverable:

- users can create and issue a correct internal invoice record.

Exit criteria:

- issued invoice financial data cannot be silently edited;
- all totals are reproduced from stored inputs;
- calculation tests cover zero tax, standard tax, discounts, and rounding.

#### Week 6 — PDF document and delivery workflow

Learning:

- server-side document generation;
- secure local file storage and authorized access;
- local email simulation and idempotency.

Build:

- accessible invoice preview;
- deterministic PDF generation;
- German and English invoice templates;
- local filesystem storage adapter;
- send-invoice workflow;
- delivery attempt records;
- email templates;
- retry-safe delivery behavior;
- download authorization.

Deliverable:

- an issued invoice can be rendered, stored, delivered to Mailpit, and
  downloaded securely.

Exit criteria:

- duplicate submission does not send unintended duplicate invoices;
- only authorized members can access invoice files;
- a generated document can be reproduced and traced to its invoice version.

### Phase 3 — German E-invoice differentiation

#### Week 7 — XRechnung generation and validation

Learning:

- structured invoice data and EN 16931 concepts;
- XML namespaces and schema validation;
- business-rule validation versus syntax validation;
- mapping internal domain fields to XRechnung.

Build:

- canonical internal invoice representation;
- XRechnung serializer;
- mapping documentation;
- integration with an appropriate validator;
- machine-readable validation results;
- user-friendly validation report;
- valid and invalid fixture library;
- downloadable XML.

Deliverable:

- an invoice can generate an XRechnung document and pass the selected validator.

Exit criteria:

- official/reference fixtures are used where licensing permits;
- invalid invoices show actionable errors;
- PDF and XML originate from the same canonical invoice data;
- validation version is recorded for auditability.

#### Week 8 — Incoming E-invoice inbox

Learning:

- defensive file parsing;
- upload security and content-type verification;
- untrusted XML risks;
- normalized data extraction.

Build:

- secure XML upload;
- size and type limits;
- protection against unsafe XML features;
- incoming invoice parser;
- human-readable invoice viewer;
- validation result and original-file preservation;
- duplicate detection;
- inbox filters and status workflow.

Deliverable:

- users can upload, validate, and understand an incoming XRechnung.

Exit criteria:

- malformed and malicious files fail safely;
- parsed values can always be traced to the original document;
- organization isolation applies to files and extracted data.

#### Week 9 — ZUGFeRD and interoperability

Learning:

- hybrid PDF/XML invoice concepts;
- conformance profiles;
- embedded-file extraction and validation.

Build:

- select and document the supported ZUGFeRD profile;
- generate or parse the selected profile;
- show the embedded structured data;
- cross-format regression fixtures;
- interoperability documentation;
- capability matrix listing supported and unsupported cases.

Deliverable:

- the product supports a clearly documented ZUGFeRD workflow without claiming
  universal compatibility.

Exit criteria:

- supported files validate using the selected toolchain;
- profile/version is visible to the user;
- unsupported profiles produce a clear error.

### Phase 4 — Workflow automation

#### Week 10 — Payment tracking, reminders, and audit trail

Learning:

- scheduled work and retry semantics;
- idempotent background tasks;
- audit logging and state-transition rules.

Build:

- mark paid, partially paid, overdue, and cancelled states;
- record payments without becoming a bookkeeping ledger;
- dashboard for outstanding amounts;
- reminder schedule and German/English templates;
- background job abstraction;
- immutable audit timeline;
- notification preferences.

Deliverable:

- users can see what is owed and automate controlled reminders.

Exit criteria:

- retries cannot send duplicate reminders;
- status transitions are validated;
- every automated action is explainable in the audit timeline.

#### Week 11 — Privacy, security, and quality hardening

Learning:

- GDPR-oriented data lifecycle;
- threat modelling and secure file handling;
- backups, restoration, retention, and incident readiness;
- accessibility testing.

Build:

- data export and account/organization deletion workflow;
- documented retention policy and cleanup jobs;
- privacy controls and consent records where required;
- security headers and dependency review;
- authorization regression suite;
- backup and restore exercise;
- accessibility review;
- performance profiling;
- production-like end-to-end test suite.

Deliverable:

- a documented security and privacy baseline with tested controls.

Exit criteria:

- critical authorization paths have regression tests;
- restore procedure has been exercised;
- no unresolved critical security finding remains;
- core flows meet the selected accessibility baseline.

### Phase 5 — Productization and launch

#### Week 12 — Local production-style delivery and portfolio presentation

Learning:

- production configuration and secret management;
- database migration safety;
- observability and release management;
- presenting engineering trade-offs honestly.

Build:

- optimized production containers;
- one-command local Docker Compose deployment;
- local backups, structured logs, and health checks;
- seeded demo organization with fictional data;
- landing page and onboarding tour;
- architecture diagram;
- engineering case study;
- API/domain documentation;
- demo video and screenshots;
- release checklist and version tag.

Deliverable:

- a locally demonstrable, monitored MVP.

Exit criteria:

- a fresh checkout runs through documented local commands;
- the demo contains no real personal or financial data;
- a recruiter can understand the problem, architecture, and trade-offs in five
  minutes;
- all claims in the case study are verifiable.

## 6. Post-MVP roadmap

Features are promoted only after authoritative research, public workflow
evidence, or repeatable local experiments:

1. recurring invoices and credit notes;
2. accountant workspace and export bundle;
3. team invitations and granular permissions;
4. additional deterministic validation explanations;
5. DATEV-compatible export research;
6. Peppol workflow research without live delivery;
7. public API and webhooks;
8. optional free-tier hosting only after separate approval.

## 7. Automation safety rules

- No external AI or paid model API is used.
- Invoice totals and tax amounts are calculated by deterministic, tested code.
- The application never declares that an invoice is legally certified.
- A versioned validator remains the source of truth for technical validation.
- Automated reminders and state changes are deterministic, idempotent, and
  auditable.

## 8. Testing strategy

- Unit tests: money calculations, invoice state machine, field mappings, policies.
- Integration tests: database constraints, tenant isolation, serializers, parsing.
- Contract/fixture tests: XRechnung and ZUGFeRD inputs and outputs.
- Browser tests: onboarding, customer creation, invoice issue/send/download.
- Security tests: cross-tenant access, upload abuse, unauthorized file access.
- Operational tests: migrations, backups, restore, email/job idempotency.

Coverage percentage is a signal, not the goal. Critical financial and
authorization behavior must have explicit scenario coverage.

## 9. Milestones

- M1 — End of Week 2: reproducible engineering foundation
- M2 — End of Week 4: secure multi-tenant customer workspace
- M3 — End of Week 6: complete PDF invoice workflow
- M4 — End of Week 8: XRechnung create/receive workflow
- M5 — End of Week 10: payment and reminder workflow
- M6 — End of Week 12: deployed, documented portfolio MVP

## 10. Today — Day 1

Today is a discovery day, not a framework-installation race.

Progress:

- [x] Initial target segment selected as a hypothesis
- [x] Product brief drafted
- [x] Desk-research protocol established
- [x] Assumption register created
- [x] No-user-interaction constraint recorded
- [x] Authoritative evidence register created
- [x] Competitor workflow matrix created
- [x] Domain glossary created
- [x] Standards/version support matrix created
- [x] Synthetic persona and workflow created
- [x] Fictional fixture catalogue created

### Tasks

1. Write the one-page product brief.
2. Select the first niche: independent consultants and small digital agencies.
3. Define the first persona and current invoice workflow.
4. Create an authoritative-source evidence register.
5. Create a verified competitor matrix.
6. Start the domain glossary.
7. Draft the first six user stories.
8. Record assumptions that require validation.

### First six user stories

1. As a freelancer, I can configure my business identity so required sender
   information appears consistently.
2. As a freelancer, I can store a client's billing information so it can be
   reused safely.
3. As a freelancer, I can create invoice lines and see deterministic totals
   before issuing an invoice.
4. As a freelancer, I can issue an invoice so its financial content becomes an
   auditable record.
5. As a freelancer, I can generate a validated XRechnung so a German business
   customer can process it.
6. As a freelancer, I can understand validation failures and correct the source
   data.

### Day 1 completion test

At the end of today we should be able to answer:

- Who exactly is the first user?
- What painful workflow are we replacing?
- What is the smallest end-to-end value we can deliver?
- Which claims are supported by authoritative research, and which must remain
  assumptions?
- What will we deliberately not build in the MVP?

## 11. Learning journal

For every work session, record:

- what problem was addressed;
- what was learned;
- what alternatives were considered;
- what decision was made and why;
- what failed and how it was diagnosed;
- what test proves the result;
- how the decision would be explained in a technical portfolio review.

This journal will later become the raw material for the portfolio case study.
