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

1. Create an **Account API key** (Developer → Account API Keys) with enough permissions for Gitpay.  
   Prefer **Admin** while integrating, then narrow down. Custom keys that call `account_links` must include at least:
   - `company:balance:read` (required by Whop for account onboarding / payout portal links)
   - Company create / manage (connected accounts)
   - Payments / checkout / invoices (pay-in)
   - Transfers and withdrawals (pay-out)
   - Webhooks as needed  

   If you see  
   `This API key is not authorized to scope to the following action: company:balance:read`  
   even after selecting “all permissions”, check:

   1. **Key type** — use a **Company / Account API key** under the **platform** business  
      (Developer → **Company API Keys** / **Account API Keys**).  
      **App API keys** (Apps section) often fail on `account_links` for connected accounts  
      with this exact error even when every checkbox is selected.
   2. **Same company as `WHOP_COMPANY_ID`** — the key must belong to the platform `biz_…`  
      in env. Confirm with a call that returns your company id (e.g. account “me”).
   3. **Sub-merchant parent** — `Users.whop_account_id` must be a **child** company  
      created with `parent_company_id = WHOP_COMPANY_ID`. Links only work for  
      sub-merchants of the key’s company.
   4. **Recreate the key** — after changing roles/permissions, create a **new** key and  
      update `WHOP_API_KEY` (some “edit permission” flows do not fully re-scope).
   5. **Sandbox vs prod** — sandbox keys only work with `WHOP_SANDBOX=true` / sandbox API base URL.
2. Create a webhook pointing to `https://<API_HOST>/webhooks/whop`.
3. Subscribe at least to:
   - `payment.succeeded`, `payment.failed`
   - **`membership.activated`** and/or **`membership.went_valid`**  
     (one-time plan / product checkout often delivers these when access is granted;  
     Gitpay uses them as a paid signal for payment requests when `payment.succeeded` is missing)
   - `invoice.paid`, `invoice.past_due`
   - `withdrawal.created`, `withdrawal.updated`
   - `refund.created`, `refund.updated`
   - `dispute.created`, `dispute.updated` (payment-request balance clawback)
4. Store the webhook secret as `WHOP_WEBHOOK_SECRET`.

**If you only log `membership.activated` and never `payment.succeeded`:** that is common for Whop product/plan purchases. Ensure `membership.activated` is subscribed (and deploy code that handles it). Unhandled events still return HTTP 200 so Whop stops retrying — check logs for `[whop] membership.activated/went_valid`.

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
| User withdraw | Connect Payout (`POST /payouts/request`) | Whop `POST /withdrawals` via same Gitpay **Request payout** UI (`method: whop`) |

### Payment request vs payout (Whop)

| Step | Automatic? | API |
|------|------------|-----|
| Customer pays PR | Webhook | payment / membership |
| Platform → seller company | Webhook or cron | `transfers` (ledger) |
| Seller → bank | **User request** | Gitpay `POST /payouts/request` → Whop `withdrawals` |

Gitpay **Payouts** page for Whop:

- Shows connected company **available** balance (ledger → cents for UI)
- **Request payout** creates a Whop withdrawal (on-demand; no Stripe-style schedule)
- Requires `Users.whop_account_id` and a payout method configured on Whop (portal / verification)

Money movement on Whop is always:

`checkout → platform company balance → transfers.create → connected company → withdrawals`

Whop’s Workforce **Bounties** API is **not** used for GitHub issue bounties (different product model).

## Account onboarding

With `PAYMENT_PROVIDER=whop`:

1. User creates payout account → `companies.create` → stores `Users.whop_account_id`.
2. Verification link → `account_links` with `use_case: account_onboarding`.
   Return/refresh URLs hit the **API**, which then redirects into the SPA (same pattern as `/orders/authorize`):

   | Provider callback | API route | Frontend destination |
   |-------------------|-----------|----------------------|
   | Success / done | `GET /user/account/verification/return` | `/#/profile/payout-settings/bank-account/account-verification/return?status=success` |
   | Expired / resume | `GET /user/account/verification/refresh` | `/#/profile/payout-settings/bank-account/account-verification/refresh?status=expired` |

   Whop requires **https://** callback URLs. For local dev:
   - Tunnel the API (`ngrok http 3000`) and set `WHOP_API_HOST=https://…` (or `API_HOST` with https).
   - Keep `FRONTEND_HOST=http://localhost:8082` so the API can bounce the browser back to the local app with a success toast.
3. User completes KYC and adds a payout method in Whop; they land back on the verification return page with a success message.
4. Platform can transfer funds and the user can request withdrawals.

With Stripe (default), existing Connect custom account flow is unchanged (`Users.account_id`).

### Account readiness (`active`)

`GET /user/account` always returns:

| Field | Meaning |
|-------|---------|
| `provider` | Active payment provider name (`stripe` \| `whop`) |
| `active` | Whether the connected account can use payouts / payment requests |

`active` is computed by `PaymentProvider.isConnectedAccountActive(account)`:

| Provider | Active when |
|----------|-------------|
| **Stripe** | Account has an `id`, is not rejected, and has no `requirements.currently_due` |
| **Whop** | Account has a connected company `id` (`Users.whop_account_id`) |

The frontend gates payment-request creation and the “Action required” banner via `validAccount()`, which prefers this `active` flag (no provider-specific branches).

## Mixed Stripe + Whop payment requests

`PAYMENT_PROVIDER` only defaults **new** resources (and frontend build). Each `PaymentRequests.provider` row is the source of truth for that request.

| Operation | Routing |
|-----------|---------|
| Create | env default (`PAYMENT_PROVIDER`) unless override |
| Pay webhook | Endpoint-specific (`/webhooks/stripe-platform` vs `/webhooks/whop`) |
| Transfer | `getPaymentProvider(paymentRequest.provider)` |
| Update title/active | `getPaymentProvider(paymentRequest.provider)` → Stripe link/product or Whop plan/product |
| Refund | Same, from parent PR provider (`pi_…` / `pay_…`) |
| Lists | DB only — Stripe and Whop rows appear together; payment list includes `PaymentRequest.provider` |

When switching env to `whop`, keep Stripe keys and webhooks until open Stripe PRs are paid or closed.

## Payment request: pay → transfer → emails

Shared path for Stripe and Whop:

1. Webhook: Stripe `checkout.session.completed` or Whop `payment.succeeded`
2. `processPaymentRequestPaymentFromCheckoutSession` → `processCheckoutSessionCompleted`
3. **Always** creates `PaymentRequestPayment` (`source` = Stripe PI or Whop `pay_…`) and marks the request paid
4. Transfer flow is extracted into `executePaymentRequestTransfer` (shared by webhook + cron)
5. Emails: payment made + optional instructions always; transfer initiated only when a transfer is created

| Provider | Transfer timing |
|----------|-----------------|
| **Stripe** | Immediate (uses `source_transaction` on the charge) |
| **Whop** | Tried immediately; if platform **available** balance is still settling, payment is stored with `transferStatus=pending_funds` and completed later |

### Deferred Whop transfers (pending balance)

Whop card payments often land in **pending** for 1–4 days before becoming **available**. Ledger transfers can only debit available balance.

When transfer is deferred:

| Field | Value |
|-------|--------|
| `PaymentRequestPayment` | **Always created** on pay (`status` = paid; `transferStatus` = `pending_funds`) |
| `PaymentRequestPayment.transferStatus` | `pending_funds` |
| `PaymentRequest.transfer_status` | `pending_funds` |
| `PaymentRequest.transfer_id` | null until transfer succeeds |
| `PaymentRequestTransfer` (Claims) | Created immediately with `status = pending`, `transfer_id = null` so Claims UI shows the claim while funds settle. Updated to `status = created` + provider `transfer_id` when cron/script succeeds. |

**Why Claims was empty before:** Claims → “payment request transfers” reads `PaymentRequestTransfer` only. Older code created that row **after** a successful provider transfer, so deferred Whop pays left no claim and the cron only looked for `transferStatus = pending_funds` (never set if transfer threw a non-matched error).

**Daily cron** (midnight, with the other daily jobs) runs `processPendingPaymentRequestTransfers`:

- Loads payments with `transferStatus = pending_funds` (oldest first)
- Retries `executePaymentRequestTransfer`
- On success: sets status to `initiated`, creates `PaymentRequestTransfer`, sends transfer + balance emails
- If still insufficient available balance: leaves `pending_funds` for the next day

**Manual / ops script** (same logic as the cron):

```bash
npm run scripts:payment-request:process_pending_transfers
```

### Whop adapter notes

- Real `payment.succeeded` payloads often **omit `status`**; the event type means paid.
- PR metadata is usually on **plan.metadata**; the handler merges plan + payment metadata.
- Whop has no `source_transaction` on transfers; correlation is via transfer `metadata.source_payment_id`.
- Transfers use `POST /transfers` with **`type: "ledger"`** (platform `origin_id` → connected `destination_id`).
  Gitpay never uses `wallet_send` (crypto).

  **`Sends are only supported from an Ethereum wallet`** is a **misleading Whop API error**. In practice it
  often means:

  1. **Available balance is 0** while funds sit in **pending** (card payments settle over 1–4 days).
     Check `GET /ledger_accounts/{WHOP_COMPANY_ID}` → `balances[].balance` (available) vs `pending_balance`.
  2. **Sandbox limitation**: [Whop sandbox docs](https://docs.whop.com/developer/guides/sandbox) list
     **payouts as not available yet**; ledger transfers may fail the same way even with correct `type: ledger`.
  3. Platform company not fully ready for transfers (less common if `capabilities.transfer` is `active`).

  Before transferring, the platform needs **available** USD ≥ transfer amount. Destination must be a
  connected company (`Users.whop_account_id` = `biz_…` under `WHOP_COMPANY_ID`).

### Key source files

| File | Role |
|------|------|
| `src/mutations/payment-request/checkout-session/processCheckoutSessionCompleted.ts` | Persist payment, then call transfer |
| `src/services/paymentRequest/executePaymentRequestTransfer.ts` | Shared transfer + balance/debt logic |
| `src/services/paymentRequest/processPendingPaymentRequestTransfers.ts` | Cron/script batch for `pending_funds` |
| `src/crons/paymentRequests/paymentRequestTransferCron.ts` | Daily job wrapper |
| `src/scripts/payment-request/process_pending_transfers.ts` | CLI entry for the same job |

## Payment request: disputes / PR balance

| Stripe | Whop |
|--------|------|
| `charge.dispute.created` → notify | `dispute.created` → notify |
| `charge.dispute.funds_withdrawn` → **DEBIT** | Same on `dispute.created` (Whop withdraws immediately) |
| `charge.dispute.closed` won → **CREDIT** | `dispute.updated` status `won` → **CREDIT** |

Debit formula (cents):

```
disputed amount
+ 8% Gitpay platform fee
+ provider fee (Stripe balance_tx fee, or WHOP_DISPUTE_FEE_CENTS default 1500 = $15)
```

Lookup: `PaymentRequestPayment.source` = Stripe `payment_intent` or Whop `payment.id` (`pay_…`).

Debits/credits are idempotent per `sourceId` + type so webhook retries are safe.


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
