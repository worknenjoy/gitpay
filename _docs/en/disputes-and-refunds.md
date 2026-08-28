---
layout: doc
lang: en
role: sponsor
title: Disputes and refunds
subtitle: What happens to your balance when a payment request is disputed or refunded
tags: disputes, chargebacks, refunds, payment requests, fees
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

A dispute or refund can happen even after a [claim](/docs/en/claims/) has already been credited to you,
or after you've requested a [payout](/docs/en/payouts/). This page explains what that means for your
balance.

## Where this fits in the payment flow

```
claimed  →  funded  →  transfer credited  →  payout requested  →  money in your account
                             (Claims)                                     ↘
                                                                dispute or refund (this page)
                                                                  debits your balance
```

Claiming, funding, and payouts are the forward direction: money moving toward you. A dispute or refund
runs the other way — it reverses part of that chain by debiting money back out of your balance, even if
it had already been credited as a claim.

## What is a dispute?

A dispute (also called a chargeback) happens when the person who paid you contests the charge with
their bank or card network — for example, if they believe the charge was unauthorized. It's opened by
the payer's bank, not by Gitpay or the payer directly through Gitpay.

## What is a refund?

A refund is money sent back to the payer, either because you or Gitpay issued it, or because it was
issued directly on the payment provider's dashboard. Refunds from Gitpay's own interface are always for
the full amount — there's no partial-refund option in the product itself.

## How disputes affect your balance

When a dispute opens, the disputed amount is debited from your payment-request balance, along with
Gitpay's 8% platform fee and a provider fee. If the dispute is later resolved in your favor, the
disputed amount and the provider fee are credited back — but Gitpay's 8% fee is not refunded, so your
balance won't fully return to where it started even when you win.

## How refunds affect your balance

A refund is a lighter deduction than a dispute: only Gitpay's 8% fee is debited from your balance. The
payment provider absorbs the refunded amount itself, since it isn't money that was ever transferred out
to you as a payout.

## Extra fees on Whop (dispute alerts)

If you're paid through Whop, Whop can automatically refund a transaction under a certain amount as soon
as it detects an incoming dispute, before it becomes a formal chargeback. When this happens, Whop
charges a separate alert fee (currently around $29) regardless of the outcome, and Gitpay debits it from
your balance right away. You'll get an email as soon as this fires.

## Where to see this

Your **Payment Requests** page has a "Disputes and refunds" panel showing any amount currently owed
from disputes or refund fees against your payment requests.

## What to do if you disagree with a dispute

Disputes are opened and resolved through the payer's bank or card network, not inside Gitpay, so there's
no dispute-response flow within the product itself. If you believe a dispute is mistaken, reach out to
support with the payment's details — we can help point you in the right direction.
