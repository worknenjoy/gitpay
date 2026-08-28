---
layout: doc
lang: en
role: contributor
title: Claims — claiming tasks and tracking transfers
subtitle: How to claim a bounty task, and where to see the money you've received
tags: claims, bounty, assignment, transfers, payment requests
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

"Claim" means two different things on Gitpay, and this page covers both — because one leads directly
into the other: claiming a task is how you start earning a bounty, and the Claims page is where that
bounty shows up as money once it's paid.

## Where this fits in the payment flow

```
claimed  →  funded  →  transfer credited  →  payout requested  →  money in your account
(this page)  (issue/PR      (also this page,                    ↘
             paid)          the money side)                dispute or refund
                                                     (see Disputes and refunds)
```

Claiming a task is the very start of the chain: it's what turns "an open bounty anyone could work on"
into "work assigned to you." Once that work is delivered and paid, the same word describes the other
end of the chain too — the Claims page is where you "claim," in the everyday sense, the money you've
earned, before requesting a [payout](/docs/en/payouts/) to actually withdraw it.

## Claiming a task

To claim a task, request to be assigned to it from the task or issue page. This sends a request to the
task owner (or verifies you're already the assigned GitHub user), so Gitpay can confirm you're the
right person before the bounty is reserved for you.

## Waiting for approval

After you request a claim, Gitpay checks that you're actually assigned to the underlying GitHub issue
before confirming it. You'll get an email once your claim is approved.

## What happens if nobody claims a task

If a funded task sits unclaimed for a while, Gitpay periodically checks in and gives contributors a
chance to claim it. If it stays unclaimed for too long despite those reminders, the task is released
and the sponsor who funded it is refunded — so funded bounties don't sit in limbo forever.

## The Claims page

Once work is claimed and paid for, "claiming" takes on its other meaning: the **Claims** page in your
profile is where you see the money you've received. It has two tabs, matching the two ways Gitpay pays
contributors.

## Claims for bounties

Transfers you've received for bounty tasks you completed — the direct result of claiming and finishing
a task, as described above.

## Claims for payment requests

Transfers from payment requests you issued and that have since been paid.

## Activating your account to receive claims

If your Claims page is empty and asks you to activate your account, that's a one-time step: Gitpay
needs an active payout method on file before it can credit transfers to you. Head to your payout
settings to connect one.

## From claim to payout

A transfer showing on your Claims page is money that's yours, but it isn't in your bank account yet —
it's sitting in your Gitpay balance. To actually receive it, request a
[payout](/docs/en/payouts/). If a dispute or refund happens on the original payment afterward, it can
be debited back out of your balance — see [Disputes and refunds](/docs/en/disputes-and-refunds/) for
how that works.
