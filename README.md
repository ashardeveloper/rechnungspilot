# RechnungsPilot DE

SaaS-style invoicing workspace for German freelancers and small businesses.

RechnungsPilot DE demonstrates a production-shaped invoice workflow: authenticated workspace, PostgreSQL persistence, customer management, invoice creation/editing, PDF download, technical XRechnung XML draft export, audit history, archive/restore, configurable invoice numbering, sender profile settings, Docker support, CI, and CD.

## Live Demo

[https://rechnungspilot-ten.vercel.app/](https://rechnungspilot-ten.vercel.app/)

Demo login:

```txt
Email: demo@rechnungspilot.local
Password: rechnungspilot-demo

```

## Project Highlights

- Production-style SaaS dashboard
- Login-protected workspace
- PostgreSQL persistence with Prisma
- Customer directory with search and load more
- Customer detail pages and customer-specific invoice creation
- Invoice creation from real form input
- Invoice search, status filters, due-status tracking, archive and restore
- Invoice lifecycle controls with locked issued/paid behavior
- PDF invoice download
- Technical XRechnung XML draft download
- Invoice audit/history timeline
- Configurable sender profile and invoice numbering
- Dockerized app and PostgreSQL setup
- GitHub Actions CI
- GitHub Actions CD trigger for Vercel deployment

## Screenshots

### Login

![Login](docs/screenshots/login.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Invoices

![Invoices](docs/screenshots/invoices.png)

### Invoice Detail

![Invoice Detail](docs/screenshots/invoice-detail.png)

### New Invoice

![New Invoice](docs/screenshots/new-invoice.png)

### Customers

![Customers](docs/screenshots/customers.png)

### Customer Detail

![Customer Detail](docs/screenshots/customer-detail.png)

### New Customer

![New Customer](docs/screenshots/new-customer.png)

### Archive Invoices

![Archive Invoices](docs/screenshots/archive-invoices.png)

### Settings

![Settings](docs/screenshots/settings.png)

## Case Study

### Problem

Small businesses and freelancers need a clear way to create invoices, manage customers, track invoice status, and export documents without turning the workflow into a complex accounting system.

### Solution

RechnungsPilot DE focuses on a practical invoicing workflow:

1. Manage reusable customer master data.
2. Create invoices from structured form input.
3. Track invoice lifecycle from draft to review-ready, issued, and paid.
4. Lock issued/paid invoices to avoid accidental changes.
5. Export issued invoices as PDF and technical XRechnung XML draft.
6. Keep an audit history of invoice events.
7. Configure invoice numbering and sender profile from settings.

### Engineering Focus

The project is structured like a real SaaS app rather than a static demo.

- Server actions handle user-facing mutations.
- Repository modules isolate persistence logic.
- Domain modules hold invoice calculations, lifecycle rules, due-status logic, and export mapping.
- Prisma models enforce relational persistence.
- Tests cover domain rules and database authorization behavior.
- CI verifies lint, unit tests, DB integration tests, and production build.
- CD triggers Vercel deployment after successful CI.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Auth.js credentials login
- Vitest unit and DB integration tests
- PDFKit for invoice PDF generation
- Docker and Docker Compose
- GitHub Actions CI/CD
- Vercel deployment
- Neon PostgreSQL

## Scope

This is a portfolio MVP.

It is intentionally not a certified accounting, tax, DATEV, ELSTER, Peppol, payment, or legal invoicing product.

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
- Dockerized local production-style runtime
- CI and CD workflows

## Local Setup

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

PostgreSQL runs on:

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
AUTH_SECRET="replace-with-a-long-random-secret"
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

## Docker

Build and run the app with Docker Compose:

```bash
cd /d/Projects/RechnungsPilot
docker compose build web
docker compose up -d postgres
docker compose up -d web
```

Docker app URL:

```txt
http://localhost:3001
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

## Continuous Integration

The repository includes a GitHub Actions workflow at:

```txt
.github/workflows/ci.yml
```

The CI pipeline starts a PostgreSQL service container and runs:

```txt
npm ci
Prisma client generation
Prisma migrations
demo seed
lint
unit tests
database integration tests
production build
```

This keeps the portfolio demo close to a real SaaS delivery workflow.

## Continuous Deployment

The repository includes a deployment workflow at:

```txt
.github/workflows/deploy.yml
```

After CI passes on `main`, the deployment workflow triggers a Vercel production deployment.

Current deployment setup:

```txt
Hosting: Vercel
Database: Neon PostgreSQL
CI: GitHub Actions
CD: GitHub Actions + Vercel deploy hook
```
