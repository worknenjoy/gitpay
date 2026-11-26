---
layout: doc
lang: en
title: How payments and fees work
subtitle: Where the money goes for payment requests and bounties, and exactly what Gitpay charges
tags: payments, fees, payment-requests, bounties
redirect_from:
  - /docs/en/pages/
  - /docs/en/posts/
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

## Payment requests

### Direct charge (all new payment requests)

Every payment request you create now is a **direct charge** on your own Whop account:

1. The customer pays on the checkout.
2. Whop charges the payment on your account and, in the same charge, sends Gitpay's platform fee to Gitpay.
3. The rest lands in your Whop balance, minus Whop's processing fee.

With a direct charge, **your Whop account is the merchant of record**: refunds and disputes for that payment are handled on your account. See [Refunds and disputes](/docs/en/disputes-and-refunds/).

**Fee:** 5% of the amount the customer paid, plus Whop's processing fee.

| Example: customer pays $180 | |
|---|---|
| Customer paid | $180.00 |
| Platform fee (5%) | −$9.00 |
| Processing fee (Whop) | depends on the payment method and the customer's country |
| **Net amount** | $180.00 − $9.00 − processing fee |

The exact processing fee for each payment is shown in **Payment Requests → Payments → View details**. Whop's processing fees are set by Whop and differ by payment method (for example card or bank transfer) and by country.

### Older payment requests (Gitpay as merchant of record)

Payment requests created before direct charges were introduced keep working the old way:

1. The customer pays into Gitpay's Whop account.
2. Whop deducts its processing fee.
3. Gitpay takes 8% of what's left and transfers the rest to your Whop account.

**Fee:** 8% of the amount after Whop's processing fee. Gitpay handles disputes for these payments, and recovers dispute costs from your payment request balance (see [Refunds and disputes](/docs/en/disputes-and-refunds/)).

If a card payment hasn't settled yet, the transfer waits. Gitpay retries every night until the funds are available, so the claim may show **pending** for a few days.

### The fee is fixed per link

The platform fee is saved on each payment request when you create it. If Gitpay's fee changes, your existing links keep the rate they were created with. To move a link to the current rate, create a new one.

### Currency

Payment requests are priced in USD. Your payout currency depends on the country you chose when you set up payouts.

## Bounties

### What the sponsor pays

| Plan | Fee added to the bounty |
|---|---|
| Open source | 8% |
| Open source, bounty of $5,000 or more | No fee |
| Private issue | 18% |

The fee is shown as **Total with fee** before you pay. Example: a $100 open source bounty costs the sponsor $108.

Sponsors can pay by **card** (charged now), **invoice** (for companies, paid by bank transfer before the due date) or **wallet** (funds already added to Gitpay). Or they can **pay later**: nothing is charged now, and they pay when a solution is accepted. See [Fund an issue](/docs/en/sponsor/).

### Where the money is held

When a sponsor pays now, Gitpay holds the money until a solution is merged. The issue shows the bounty as **Funded** (or **Invoice pending** until an invoice is paid). Pledges to pay later show as **To pay later**.

### What the contributor receives

When the solution is accepted, Gitpay transfers **92% of the paid bounty** to the contributor's payout account. Example: on a $100 bounty, the contributor receives $92.

If several sponsors funded the same issue, their paid amounts are added together.

## Wallets

A wallet holds funds you add in advance to pay for bounties. Add funds in **Payments → Wallets → Add funds**; Gitpay sends you an invoice to pay. Once paid, choose **Wallet** as the payment method when you fund an issue. Bounties paid from a wallet are refunded to the wallet.

## Next steps

- [Set up payouts](/docs/en/whop-payout-setup/)
- [Payouts](/docs/en/payouts/)
- [Refunds and disputes](/docs/en/disputes-and-refunds/)
