---
layout: doc
lang: en
role: contributor
title: How payouts work
subtitle: How Gitpay sends your bounty and payment-request earnings to your account
tags: payout, payment, bank account, whop, stripe
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

A payout is the last step of a longer journey your money takes on Gitpay — this page explains that
step. If you haven't read [Claims](/docs/en/claims/) yet, start there: it covers how work you do turns
into money you can actually withdraw.

## Where this fits in the payment flow

```
claimed  →  funded  →  transfer credited  →  payout requested  →  money in your account
(Claims)     (issue/PR      (shows on your                              ↘
             paid)          Claims page)                       dispute or refund
                                                                 (see Disputes and refunds)
```

A payout is what turns a credited transfer — money already sitting in your Gitpay balance because a
bounty or payment request was paid — into money that actually lands in your bank account or Whop
account. Nothing about a payout changes *how much* you're owed; it's the withdrawal step, not the
earning step.

## How you get paid

Whenever a task you were assigned to is completed and its bounty is paid, or a payment request you
issued is paid, Gitpay credits a transfer to your account. You can see all of these on your
[Claims page](/docs/en/claims/). None of this requires any action from you — it happens automatically
as soon as the payer's charge goes through.

## Requesting a withdrawal

Once you have a balance, go to your **Payouts** page and request a withdrawal. What happens next
depends on how your account is connected:

- **Stripe** — your payout follows the payout schedule configured on your connected Stripe account.
- **Whop** — payouts can be requested on demand, once your Whop payout method is set up.

## Checking your balance

Your Payouts page always shows your current available balance before you withdraw, so you know exactly
how much is about to move.

## Setting up where the money goes

Before your first payout, you need to tell Gitpay where to send the money:

- If you're paid through Stripe, connect a bank account from your payout settings.
- If you're paid through Whop, follow [How to set up a payout account on Whop](/docs/en/whop-payout-setup/).

See [How our payment works](/docs/en/payments/) for more on fees and connecting a bank account.

## How long it takes

Card payments don't become available to withdraw the instant they're made — providers hold funds for a
short settlement period first (typically a few days) before they can be transferred out. Once a
transfer clears that settlement period, it's ready to include in your next payout.

## Troubleshooting a payout that hasn't arrived

If a payout seems stuck:

1. Check your payout method is still active in your payout settings (Stripe or Whop) — an expired or
   incomplete method is the most common cause.
2. Give it a few business days — bank transfers, in particular, aren't instant even after Gitpay
   initiates them.
3. Still nothing? Reach out to support with your payout's reference so we can look it up.

## Where to go next

- Not sure where a payout's balance came from? See [Claims](/docs/en/claims/).
- Balance lower than expected? A dispute or refund may have affected it — see
  [Disputes and refunds](/docs/en/disputes-and-refunds/).
