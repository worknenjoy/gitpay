---
layout: doc
lang: en
role: maintainer
title: How bounties are paid out
subtitle: What triggers the payment, who gets it, and what happens when nobody claims it
tags: maintainer, sponsor, bounties, payouts
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Bounties are paid automatically. Nobody presses a "release" button: the payment is triggered by the contributor submitting a solution that passes Gitpay's checks.

## What triggers the payment

All of these must be true:

1. The contributor is signed in to Gitpay with GitHub.
2. They authored the pull request.
3. The pull request is merged into the issue's repository.
4. The pull request references the issue.
5. The issue is closed on GitHub.

The contributor submits the pull request URL as a solution. If all checks pass, Gitpay assigns the issue to them (if it wasn't already) and transfers the bounty to their payout account.

**For maintainers, merging is the approval.** Review the pull request before merging it.

## What the contributor receives

92% of the paid bounty. Only paid amounts are transferred. For pledges marked **To pay later**, the sponsor receives a request to pay when the solution is accepted.

If the contributor's payout account isn't active, the transfer fails and they're asked to finish setting it up and send the solution again.

## Issue states

| State | When |
|---|---|
| **Created** | Imported, no bounty. |
| **Funded** | A sponsor paid a bounty. |
| **Claimed** | A solution was accepted and the transfer started. |
| **Completed** | The bounty was transferred. |
| **Closed** | Closed on Gitpay, for example refunded. |

## When a solution is merged but not claimed

If a merged pull request references a funded issue but its author never submits it:

1. On the 26th of each month, Gitpay emails the pull request author to remind them to claim the bounty.
2. After two reminders, on the next run Gitpay refunds the bounty to the sponsors.

## When nobody solves the issue

Contact [contact@gitpay.me](mailto:contact@gitpay.me) to get the bounty refunded, or use **Transfer Bounty** in **Payments** to move it to another issue. See [Refunds and disputes](/docs/en/disputes-and-refunds/).

## Next steps

- [Refunds and disputes](/docs/en/disputes-and-refunds/)
- [Submit a solution](/docs/en/pull-requests/)
