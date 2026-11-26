---
layout: doc
lang: en
title: Contribute to Gitpay itself
subtitle: Run the Gitpay platform locally and find your way around the code
author: Alexandre Magno
tags: development, open-source, setup
redirect_from:
  - /docs/en/installation/
  - /docs/en/assets/
  - /docs/en/structure/
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Gitpay is open source: [github.com/worknenjoy/gitpay](https://github.com/worknenjoy/gitpay). This page is for developers who want to run it locally and contribute. The repository's `README.md` and `CONTRIBUTING.md` are the reference if anything here differs.

## Requirements

- Node.js 24 (see `.nvmrc`) and npm
- PostgreSQL, with databases `gitpay_dev` and `gitpay_test` owned by the `postgres` user
- Or Docker and Docker Compose

## Run locally

```bash
git clone https://github.com/worknenjoy/gitpay.git
cd gitpay
npm install
cd frontend && npm install && cd ..
cp .env.example .env    # then fill in the credentials you need

npm run migrate:dev     # create the tables
npm run seed:dev        # optional: sample data

npm run start:dev       # backend on http://localhost:3000
cd frontend && npm run dev   # frontend on http://localhost:8082
```

### With Docker

```bash
docker-compose up                                  # app on http://localhost:8082
docker-compose -f docker-compose.test.yml up       # tests
```

## Tests and checks

```bash
npm run test               # backend (Mocha)
cd frontend && npm run test   # frontend (Jest)
npm run test:e2e           # end-to-end (Playwright)
npm run lint && npm run typecheck
```

## Payment providers

Payments go through a provider abstraction in `src/providers/`. Set `PAYMENT_PROVIDER=stripe` or `PAYMENT_PROVIDER=whop` in `.env`. Webhooks, Whop sandbox setup and the full money flow are documented in [`docs/payments-providers.md`](https://github.com/worknenjoy/gitpay/blob/master/docs/payments-providers.md) in the repository.

## Where things are

| Path | Contents |
|---|---|
| `src/app/routes`, `src/app/controllers` | HTTP API |
| `src/modules`, `src/services` | Business logic by feature |
| `src/models` | Sequelize models |
| `src/queries`, `src/mutations` | Database reads and writes |
| `src/providers` | Stripe and Whop connectors |
| `src/crons`, `src/inngest` | Scheduled jobs |
| `frontend/src/components/design-library` | UI components ([Storybook](https://docs.gitpay.me/storybook)) |
| `frontend/src/translations` | UI strings (English and Portuguese) |

## Contributing

1. Pick an issue on [GitHub](https://github.com/worknenjoy/gitpay/issues) or on Gitpay; some have bounties.
2. Fork, branch, and open a pull request that references the issue.
3. Follow the code style (`npm run lint-fix`). For UI text, use React Intl and run `npm run translate` in `frontend` instead of editing the translation files.

Bounties on Gitpay's own issues are paid like any other: see [Submit a solution](/docs/en/pull-requests/).
