# Payment providers (Stripe & Whop)

Gitpay supports multiple payment connectors behind a single abstract `PaymentProvider` API.

## Config

Set in `.env` (see `.env.example`):

```bash
# Platform-wide switch (default: stripe)
PAYMENT_PROVIDER=stripe   # or whop

# Stripe
STRIPE_KEY=
STRIPE_PUBKEY=
STRIPE_WEBHOOK_SECRET_PLATFORM=
STRIPE_WEBHOOK_SECRET_CONNECT=

# Whop
WHOP_API_KEY=
WHOP_WEBHOOK_SECRET=
WHOP_COMPANY_ID=biz_...
# Optional sandbox
WHOP_SANDBOX=true
# WHOP_API_BASE_URL=https://sandbox-api.whop.com/api/v1
```

Frontend webpack injects `PAYMENT_PROVIDER` (and `STRIPE_PUBKEY` / `WHOP_COMPANY_ID`). Rebuild the frontend after changing env.

## Architecture

```
src/providers/
  PaymentProvider.ts          # abstract connector
  registry.ts                 # getPaymentProvider()
  stripe/StripePaymentProvider.ts
  whop/WhopPaymentProvider.ts # REST client (nock-friendly)
  webhooks/WebhookEventRegistry.ts
```

Domain code should call `getPaymentProvider()` (or `getPaymentProvider(order.provider)`) instead of the Stripe SDK directly for new work.

## Webhooks

| Provider | Endpoint | Auth |
|----------|----------|------|
| Stripe platform | `POST /webhooks/stripe-platform` | `stripe-signature` + `STRIPE_WEBHOOK_SECRET_PLATFORM` |
| Stripe connect | `POST /webhooks/stripe-connect` | Connect secret |
| Whop | `POST /webhooks/whop` | Standard Webhooks headers + `WHOP_WEBHOOK_SECRET` |

In `NODE_ENV=test`, signature verification is skipped for both providers.

### Whop dashboard setup

1. Create an Account API key with payment, transfer, and company permissions.
2. Create a webhook pointing to `https://<API_HOST>/webhooks/whop`.
3. Subscribe at least to:
   - `payment.succeeded`, `payment.failed`
   - `invoice.paid`, `invoice.past_due`
   - `withdrawal.created`, `withdrawal.updated`
   - `refund.created`, `refund.updated`
4. Store the webhook secret as `WHOP_WEBHOOK_SECRET`.

## Flows

### Pay-in (funding)

| Flow | Stripe | Whop |
|------|--------|------|
| Bounty card / checkout | Elements + Charges | Checkout configuration + embed/link |
| Bounty invoice | Stripe Invoices | Whop Invoices (`send_invoice`) |
| Payment request | Product + Price + Payment Link | Product + Plan (`purchase_url`) |
| Wallet top-up | Stripe invoice | Whop invoice |

### Pay-out

| Flow | Stripe | Whop |
|------|--------|------|
| Pay assignee (bounty) | Transfer to `User.account_id` | Transfer to `User.whop_account_id` |
| Payment request after pay | Transfer (source_transaction charge) | Transfer (platform balance → connected company) |
| User withdraw | Connect Payout | Withdrawal on connected company |

Money movement on Whop is always:

`checkout → platform company balance → transfers.create → connected company → withdrawals`

Whop’s Workforce **Bounties** API is **not** used for GitHub issue bounties (different product model).

## Account onboarding

With `PAYMENT_PROVIDER=whop`:

1. User creates payout account → `companies.create` → stores `Users.whop_account_id`.
2. Verification link → `account_links` with `use_case: account_onboarding`.
3. User completes KYC and adds a payout method in Whop.
4. Platform can transfer funds and the user can request withdrawals.

With Stripe (default), existing Connect custom account flow is unchanged (`Users.account_id`).


## Supported countries (payout onboarding)

Country pickers and `GET /user/account/countries` are **provider-aware**:

| Provider | Source | Approx. count |
|----------|--------|----------------|
| **Stripe** | Gitpay Connect product list (`country-codes.js` / `STRIPE_SUPPORTED_COUNTRIES`) | ~63 |
| **Whop** | Whop payout-supported countries ([docs](https://docs.whop.com/manage-your-business/manage-payouts/set-up-payouts)) | ~200+ |

- Frontend: `getSupportedCountryCodes()` in `frontend/src/components/areas/private/shared/provider-country-codes.ts` (uses `PAYMENT_PROVIDER`).
- Backend: `src/providers/shared/supportedCountries.ts` + `userAccountCountries`.
- Public **Supported Countries** page and the payout **country picker** both follow the active provider.
- Stripe bank currency fields still use Stripe Country Spec fields on the countries response when the user already has a Connect account.

When you switch `PAYMENT_PROVIDER`, rebuild the frontend so the country list matches the backend.

## Tests

- Default test bootstrap forces `PAYMENT_PROVIDER=stripe`.
- Whop suites use `withPaymentProvider('whop', …)` and nock `https://api.whop.com` (or `WHOP_API_BASE_URL`).
- Fixtures: `test/data/whop/*`
- Whop API tests: `test/api/**/*Whop*`, `test/api/webhooks/whop/*`

```bash
# Stripe-focused
npx mocha test/api/webhooks/stripe/**/*.test.ts

# Whop-focused
npx mocha test/api/webhooks/whop/*.test.ts test/api/**/*Whop*.test.ts
```

## Adding a third provider

1. Implement `PaymentProvider` under `src/providers/<name>/`.
2. Register in `registry.ts`.
3. Add webhook route + `register*Handlers`.
4. Add fixtures and parallel tests under `test/data/<name>` and `test/api/webhooks/<name>`.
5. Extend frontend `PAYMENT_PROVIDER` switch (badge, checkout card, payout method).
