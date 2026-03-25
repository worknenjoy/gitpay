# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gitpay is an open-source platform that integrates payment workflows with Git repositories. It supports bounties (rewards attached to GitHub issues) and payment requests (requests for work delivered).

## Common Commands

### Development

```bash
# Backend (runs on port 3000, frontend served on 8082)
npm run start:dev

# Frontend (from /frontend directory)
cd frontend && npm run dev

# Both require: cp .env.example .env (then configure credentials)
```

### Database

```bash
# Run migrations
npm run migrate:dev

# Run migrations for test environment
npm run migrate:test:dev

# Create new migration
sequelize migration:create --name modelname

# Seed database
npm run seed:dev

# Reset database (destructive)
npm run reset:dev
```

### Testing

```bash
# Backend tests (Mocha)
npm run test

# Run a single test file
cross-env NODE_ENV=test NODE_OPTIONS="--import tsx" mocha --extension ts,js --timeout 30000 --exit "test/path/to/file.test.ts"

# Frontend tests (Jest, from /frontend)
cd frontend && npm run test

# E2E tests (Playwright)
npm run test:e2e
```

### Linting & Formatting

```bash
npm run lint
npm run lint-fix
npm run format
npm run typecheck
```

### Build

```bash
npm run build  # TypeScript compilation to /dist
```

## Architecture

### Backend Structure (`/src`)

The backend is a Node.js/Express application with TypeScript:

- **`/app`** - Express app configuration
  - `/controllers` - Request handlers
  - `/routes` - HTTP endpoint definitions
- **`/models`** - Sequelize ORM models (User, Task, Order, Organization, Project, PaymentRequest, Wallet, Transfer, Payout, etc.)
- **`/modules`** - Business logic organized by feature (tasks/, orders/, users/, organizations/, paymentRequests/, wallets/, transfers/, payouts/)
- **`/services`** - External service integrations (GitHub, Stripe, PayPal)
- **`/queries`** - Database read operations
- **`/mutations`** - Database write operations
- **`/client/auth`** - Passport.js authentication strategies (GitHub, Google, Facebook, Bitbucket, JWT)

Request flow: Routes → Controllers → Modules → Models/Queries/Mutations

### Frontend Structure (`/frontend/src`)

React/Redux application with Material-UI:

- **`/main`** - App entry point, Redux store setup, routes
- **`/containers`** - Smart components connected to Redux (auth/, profile/, payment/, tasks/, dashboard/)
- **`/components`** - Presentational components
  - `/design-library` - Reusable UI components
- **`/actions`** - Redux action creators
- **`/reducers`** - Redux reducers
- **`/selectors`** - Reselect selectors for derived state
- **`/translations`** - i18n files (en.json, br.json)

### Key Technologies

- **Backend**: Express 5, Sequelize 6, PostgreSQL, Passport.js, Stripe SDK, PayPal SDK
- **Frontend**: React 18, Redux, Material-UI 7, React Router 5, React Intl
- **Node version**: 18.20.8

### API Routes

Main endpoint groups: `/tasks`, `/users`, `/orders`, `/organizations`, `/projects`, `/payment-requests`, `/wallets`, `/transfers`, `/payouts`, `/webhooks`, `/dashboard`

## Coding Standards

- 2 spaces for indentation
- Run `npm run lint-fix` for automatic style fixes
- Translation: use React Intl, run `npm run translate` in frontend (don't edit translation files directly)

## Database

PostgreSQL with Sequelize ORM. Create databases `gitpay_dev` and `gitpay_test` with user `postgres`.

Migrations are in `/migrations`, seeders in `/seeders`. The migrate script uses Umzug.
