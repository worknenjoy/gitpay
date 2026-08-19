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

1. User picks a **country** → `POST /user/account` → `companies.create` → stores `Users.whop_account_id`.
   Gitpay sends to Whop:
   - **email** (deliverable `Users.email`)
   - **country** (lowercase ISO, e.g. `us`, `br`)
   - **title** (display name)
   - **metadata**: `internal_user_id` / `gitpay_user_id`, email, country, `currency` / `default_currency` (from country map), name, username  
   Bank account numbers are **not** collected in Gitpay for Whop.
2. Verification link → `account_links` with `use_case: account_onboarding`.
   Return/refresh URLs hit the **API**, which then redirects into the SPA (same pattern as `/orders/authorize`):

   | Provider callback | API route | Frontend destination |
   |-------------------|-----------|----------------------|
   | Success / done | `GET /user/account/verification/return` | `/#/profile/payout-settings/bank-account/account-verification/return?status=success` |
   | Expired / resume | `GET /user/account/verification/refresh` | `/#/profile/payout-settings/bank-account/account-verification/refresh?status=expired` |

   Whop requires **https://** callback URLs. For local dev:
   - Tunnel the API (`ngrok http 3000`) and set `WHOP_API_HOST=https://…` (e.g. `https://hesitant-hardy-foothold.ngrok-free.dev`).
   - Keep `FRONTEND_HOST=http://localhost:8082` so the API can bounce the browser back to the local app.
   - Same `WHOP_API_HOST` is used for **bounty checkout** `redirect_url` → `GET /orders/whop/return?taskId=…` → SPA task page.
3. User completes **KYC and bank / payout method on Whop** (hosted portal). That is where the bank account is “settled” — not in Stripe-style Gitpay bank fields.
4. Gitpay **Account holder** and **Bank account** tabs show connected company summary + **currency from the user’s country** (`currencyMap`), not Stripe Country Specs.
5. Platform can transfer funds; the user requests withdrawals from Gitpay (**Request payout** → Whop `withdrawals`).

With Stripe (default), existing Connect custom account flow is unchanged (`Users.account_id` + external bank accounts in Gitpay).

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
| **Whop** | Account has a connected company `id`, Whop's own `GET /accounts/{id}` `capabilities.standard_payout` is `active` (or, if that capability is unavailable — older API key without `company:balance:read`, or the lookup failed — falls back to `company.verified === true`, a Whop trust & safety review flag used only as a last resort), **and** the account has at least one payout method on file. Both the KYC/capability signal and the payout method are required — `capabilities.standard_payout` reflects payout-rail eligibility, not whether a payout destination has actually been linked. |

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

### Sandbox: emulating Whop settlement & payout

Whop’s [sandbox docs](https://docs.whop.com/developer/guides/sandbox) note that **payouts may not be available**. Card payments also often stay in **pending** balance for days (or forever in sandbox), so ledger transfers fail with insufficient available balance.

Use the same settlement script with explicit flags to complete the **Gitpay** side of the flow without waiting on Whop:

| Step | Real production | Sandbox / dry-run |
|------|-----------------|-------------------|
| 1. Customer pays | Whop checkout + `payment.succeeded` webhook | Same, **or** `--bounty-orders` to mark unpaid Whop `Order`s paid |
| 2. Platform → seller company | Webhook / cron `transfers` (ledger) | `--mock-settlement` writes `mock_tr_pr_…` and completes claims |
| 3. Platform → bounty assignee | Transfer API after assign | `--bounty-transfers --mock-settlement` |
| 4. Seller → bank | User **Request payout** → `withdrawals` | `--mock-payout --user-id=N --amount=…` |

```bash
# Retry deferred payment-request transfers (real Whop API — needs available balance)
npm run scripts:payment-request:process_pending_transfers

# Sandbox: complete deferred PR transfers without calling Whop ledger
npm run scripts:payment-request:process_pending_transfers -- --mock-settlement

# Emulate payment.succeeded for open Whop bounty orders
npm run scripts:payment-request:process_pending_transfers -- --bounty-orders
npm run scripts:payment-request:process_pending_transfers -- --bounty-orders --order-id=42

# Bounty assignee transfer (mock ledger when sandbox cannot transfer)
npm run scripts:payment-request:process_pending_transfers -- --bounty-transfers --mock-settlement
npm run scripts:payment-request:process_pending_transfers -- --bounty-transfers --task-id=12 --mock-settlement

# Emulate completed withdrawal (Gitpay Payout row only)
npm run scripts:payment-request:process_pending_transfers -- --mock-payout --user-id=3 --amount=50

# Full sandbox path after a real (or emulated) pay-in
npm run scripts:payment-request:process_pending_transfers -- --mock-settlement --bounty-orders --bounty-transfers --mock-payout --user-id=3 --amount=50
```

**Architecture (services used by cron, webhooks, and script):**

| Service | Role |
|---------|------|
| `executePaymentRequestTransfer` | Single PR payment → transfer (`mockSettlement` optional) |
| `processPendingPaymentRequestTransfers` | Batch deferred PR transfers |
| `markBountyOrderPaid` / `processUnpaidWhopBountyOrders` | Bounty pay-in (webhook + script) |
| `transferBuildsService` | Bounty assignee transfer (`mockSettlement` optional) |
| `processPendingBountyWhopTransfers` | Batch bounty transfers for script |
| `mockPayoutSettlement` | Synthetic paid Whop withdrawal row |

**Never enable `mockSettlement` on the daily cron** — only the CLI with an explicit flag.

Mock transfer ids look like `mock_tr_pr_<paymentId>_<ts>` / `mock_tr_bounty_<taskId>_<ts>`.  
Mock payouts use `source_id` like `mock_wdrl_<userId>_<ts>` and `method: whop`, `status: paid`.

On **production**, omit mock flags: run real checkouts, wait for available balance (or fund the platform company), then use the cron/script without `--mock-settlement` and the normal **Request payout** UI for withdrawals.

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
| `src/services/orders/markBountyOrderPaid.ts` | Bounty order paid (webhook + script) |
| `src/services/orders/processPendingBountyWhopTransfers.ts` | Script batch for bounty assignee transfers |
| `src/services/payouts/mockPayoutSettlement.ts` | Ops mock withdrawal completion |
| `src/crons/paymentRequests/paymentRequestTransferCron.ts` | Daily job wrapper (no mock flags) |
| `src/scripts/payment-request/process_pending_transfers.ts` | CLI: PR transfers + bounty + mock payout |

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

`WHOP_DISPUTE_FEE_CENTS` (default `1500` = $15) is the source of the Whop provider fee in the
debit formula above — unlike Stripe, whose fee is read per-event from `balance_transactions[0].fee`,
Whop's webhook payload has no per-event fee breakdown, so this env var stands in for it. Override it
if Whop's actual chargeback fee changes.

A won dispute's CREDIT is `amount + provider fee` only — it does **not** reimburse Gitpay's own 8%
platform fee that was part of the original DEBIT, so the balance does not return fully to zero even
when a dispute is won (same behavior on both providers, since they share `disputeService.ts`).

### Negative balance recovery on Whop

The debt-recovery mechanism (`executePaymentRequestTransfer.ts`) that applies a user's next paid
`PaymentRequest` against an existing negative `PaymentRequestBalance` is provider-agnostic, but on
Whop it interacts with Whop's normal pending-balance settlement lag (card payments often take 1–4
days to become available):

- If the new payment fully covers the debt, no provider transfer is attempted at all — the debt is
  cleared immediately regardless of Whop's available balance.
- If the new payment only partially covers the debt, a real Whop transfer is still required for the
  remainder. The debt-clearing CREDIT is written atomically with that transfer, so **if the transfer
  is deferred (insufficient available balance), the negative balance stays exactly as it was** until
  the daily cron / `process_pending_transfers` retry succeeds — it is never applied optimistically.

### Testing disputes in sandbox

Whop's sandbox cannot generate a real chargeback (disputes are bank/card-network driven — there is no
Stripe-CLI-style `stripe trigger charge.dispute.created` for Whop). To validate the deployed code path
(real `WHOP_WEBHOOK_SECRET` signature verification, real DB writes, real email sending) without a live
chargeback, sign and deliver a synthetic event yourself:

1. Run a real Whop sandbox checkout to get a genuine `payment.id` (`pay_…`) tied to an existing
   `PaymentRequestPayment`.
2. Simulate the dispute opening:
   ```bash
   npm run scripts:whop:simulate_dispute -- --type=dispute.created --payment-id=pay_xxx --amount=49.95 --url=https://your-host/webhooks/whop
   ```
   Confirm a `PaymentRequestBalanceTransaction` DEBIT appears and the dispute-opened email is sent.
3. Simulate it resolving (won/lost):
   ```bash
   npm run scripts:whop:simulate_dispute -- --type=dispute.updated --status=won --payment-id=pay_xxx --url=https://your-host/webhooks/whop
   ```
   Confirm the CREDIT/recovery path (or, for `--status=lost`, that no CREDIT is created).

`--url` can point at a local server, an ngrok tunnel, or a deployed sandbox — see
`src/scripts/whop/simulate_dispute.ts` for the full flag list.

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

# Whop-focused (webhooks, orders, payouts, settlement script services)
npm run test:whop
npx mocha test/api/scripts/whop-settlement.test.ts
```

## Adding a third provider

1. Implement `PaymentProvider` under `src/providers/<name>/`.
2. Register in `registry.ts`.
3. Add webhook route + `register*Handlers`.
4. Add fixtures and parallel tests under `test/data/<name>` and `test/api/webhooks/<name>`.
5. Extend frontend `PAYMENT_PROVIDER` switch (badge, checkout card, payout method).
