---
layout: doc
lang: en
role: contributor
title: How our payment works
subtitle: How funded contributions and Payment Requests move toward payout
tags: payments, work, bounty, get paid, reward, open-source payments
redirect_from:
  - /docs/en/pages/
  - /docs/en/posts/
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Gitpay has two documented payment paths: a funded project task that a contributor delivers and a Payment Request that a provider sends for completed customer work. In either path, approval or payment, transfer credit, and payout are separate steps.

## Follow the payment stages

1. Agree on the work and amount. A project can fund an issue; a provider can create a Payment Request after delivery.
2. Deliver and obtain acceptance where the project or customer requires it.
3. Complete the applicable payment or release step.
4. Check the credited transfer in [Claims](/docs/en/claims/).
5. Withdraw available funds through [Payouts](/docs/en/payouts/).

A merged Pull Request alone does not guarantee that payment has been released. A paid request can still require processing before funds are available.

## Gitpay uses more than one payment provider
Depending on how a task or payment request was funded, and which payout method you've connected,
money moves through **Stripe**, **Whop**, or **PayPal**:

- **Stripe** is Gitpay's default provider for card payments and payouts (via Stripe Connect).
- **Whop** is available as an alternative payout method — see
  [How to set up a payout account on Whop](/docs/en/whop-payout-setup/).
- **PayPal** remains supported for some accounts and older funded tasks.

You don't choose the provider yourself for a given payout — it follows whichever method was used to
fund the task or payment request, and whichever payout method you have active on your profile.

## Connect a payout account
To receive payouts, you need an active payout method on your profile: a bank account connected
through Stripe or Whop, or a linked PayPal account. See [How payouts work](/docs/en/payouts/) for the
full withdrawal flow.

## How fees work
- Gitpay charges an 8% platform fee on payment requests. This fee is not refunded if the payment is
  later disputed — see [Disputes and refunds](/docs/en/disputes-and-refunds/).
- Stripe-connected payouts follow Stripe's own transfer and payout-schedule terms.
- Whop payouts are requested on demand — see [How payouts work](/docs/en/payouts/).
- PayPal payouts follow PayPal's own fees and require an active, linked PayPal account.

## Invoices & history
Use your account payment history to track funded tasks, payout status, and completed transfers.

## Where to go next
- [How payouts work](/docs/en/payouts/) — turning a credited balance into money in your account.
- [Claims](/docs/en/claims/) — where completed transfers show up first.
- [Disputes and refunds](/docs/en/disputes-and-refunds/) — what happens if a payment is contested.
