# RechnungsPilot DE

SaaS-style invoicing workspace for German freelancers and small businesses.

The project demonstrates a production-shaped invoice workflow: authenticated workspace, PostgreSQL persistence, customer management, invoice creation/editing, PDF download, technical XRechnung XML draft export, audit history, archive/restore, and configurable invoice numbering/sender profile.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL via Docker
- Auth.js credentials login
- Vitest unit and DB integration tests
- PDFKit for invoice PDF generation

## Scope

This is a portfolio MVP. It is intentionally not a certified accounting, tax, DATEV, ELSTER, Peppol, or payment product.

XRechnung export is implemented as a technical XML draft for demonstration only. It is not legal certification.

## Features

- Login-protected SaaS workspace
- Dashboard overview
- Invoice search, filters, metrics, archive and restore
- Create invoice from form
- Customer search, load more, create and edit
- Customer-specific invoice creation
- Invoice status lifecycle
- Locked issued/paid invoice behavior
- PDF download for issued/paid invoices
- Technical XRechnung XML draft download for issued/paid invoices
- Audit timeline for invoice activity
- Sender profile and invoice numbering settings

## Local Setup

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

Postgres runs on:

```txt
localhost:5433
```

### 2. Configure environment

Copy the example env file:

```bash
cd web
cp .env.example .env
```

Default local values:

```txt
DATABASE_URL="postgresql://rechnungspilot:rechnungspilot@localhost:5433/rechnungspilot?schema=public"
AUTH_SECRET="replace-with-local-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install dependencies

```bash
cd web
npm install
```

### 4. Run migrations and seed demo data

```bash
npm run db:migrate
npm run db:seed
```

Demo login:

```txt
Email: demo@rechnungspilot.local
Password: rechnungspilot-demo
```

### 5. Start development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Verification

Run the full verification suite:

```bash
cd web
npm run verify
```

This runs:

```txt
lint
unit tests
database integration tests
production build
```

## Useful Commands

```bash
npm run dev
npm run lint
npm test
npm run test:db
npm run build
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Current Architecture

The app uses server actions and repository modules to keep UI code separated from persistence logic.

Invoices and customers are scoped to the authenticated user. The current demo uses a seeded demo user, but the code is structured so real auth/user management can replace the demo account without rewriting the core invoice/customer repositories.

## Deployment Notes

The app is PostgreSQL-ready. For a hosted portfolio deployment, use a managed PostgreSQL provider and set the production environment variables accordingly.

Recommended production env variables:

```txt
DATABASE_URL
AUTH_SECRET
NEXTAUTH_URL
```
