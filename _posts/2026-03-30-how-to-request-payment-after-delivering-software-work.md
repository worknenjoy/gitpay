---
layout: post
title: How to Request Payment After Delivering Software Work
description: "A practical workflow for getting paid after delivering code: use a payment request or a funded issue instead of chasing an invoice, whether you work freelance or on open source."
meta_description: "A practical workflow for getting paid after delivering code: use a payment request or a funded issue instead of chasing an invoice, whether you work freelance or on open source."
lang: en
categories: [Payments, Freelancing, Developers, Open Source]
slug: how-to-request-payment-after-delivering-software-work
permalink: /how-to-request-payment-after-delivering-software-work/
seo_primary_keyword: how to request payment after delivering software work
seo_secondary_keywords:
  - payment request for developers
  - get paid for a pull request
  - freelance developer payment link
  - GitHub issue bounty payment
  - request payment from client
reading_time: 9 min
redirect_from:
  - /how-freelance-developers-request-payment-after-delivering-code/
  - /get-paid/freelance-developers/
  - /payment-request-for-freelance-developers/
  - /how-freelance-developers-get-paid/
  - /payment-link-for-freelance-developers/
---

## The problem: the work is done, and now you wait

You merged the PR. You deployed it. The feature works. And now you're in the part of the job nobody
talks about at meetups: waiting to get paid.

Sometimes the wait is a formal invoice sitting in an accounts-payable queue. Sometimes it's a GitHub
issue with a bounty attached and no clear next step once the pull request lands. Either way, the
gap between "the code is done" and "the money is in my account" is where most freelance developers
and open-source contributors lose time and patience.

This article walks through two related situations — because "software work" covers both:

1. You did **freelance or contract work** for a client and need to collect payment for a deliverable.
2. You did the work by **fixing a GitHub issue that had a bounty attached**, and need the bounty
   released after your pull request is merged.

Both end the same way: money moving from the person who wanted the work done to the person who did
it. The path there is different enough to cover separately.

## Payment request vs. invoice

A quick definition, since the two get used interchangeably and shouldn't be:

- An **invoice** is a formal billing document: it states what was provided, the amount owed, and
  payment terms, and is usually the record a client's finance team files for accounting or tax
  purposes.
- A **payment request** is an action, not a document: a link that lets the payer pay you online,
  right now, for a specific amount. It doesn't replace the accounting record a client's finance team
  might still need — it replaces the *friction* of getting from "work is done" to "money moved."

This isn't legal or tax advice — whether you also need to issue a formal invoice depends on your
business setup, your client's requirements, and your local rules. A payment request is about
removing the operational lag between delivery and payment; it doesn't decide your tax obligations
for you.

## Situation 1: freelance or contract delivery

### The usual failure mode

Most freelance payment delays follow the same pattern:

- You finish the work and hand it off.
- You send an invoice, or you're told to submit one to a portal.
- The invoice sits in a queue — waiting for approval, waiting for a monthly payment run, or waiting
  for someone in finance to notice it.
- You follow up. Maybe twice.

None of this is really about trust or amount. It's about the payment step requiring more effort than
paying for a SaaS subscription does.

### A concrete example

Say you're a freelance developer who just shipped a scoped piece of work: "Add Stripe checkout,
webhook handling, and receipt emails" for a client's app.

1. You merge the PR and deploy to production.
2. You write a short handoff message: what changed, where it's live, how to verify it.
3. In the **same message**, you include a payment request link for the agreed amount.

That third step is the one people skip, and it's the one that matters most. If the payment request
isn't in the same message as the handoff, payment becomes a separate task the client has to
remember to come back to — and "I'll deal with it later" is where invoices go to die.

### When to send the request

Two timing patterns work in practice:

- **Milestone-based** — right after a merged, deployed milestone.
- **Cycle-based** — at the end of an agreed period, e.g. "hours worked this week."

Don't send it before you can say "done" with confidence, and don't wait until the client has mentally
moved on to the next priority. The window is short.

### If the client still needs a formal invoice

Some clients' finance departments require one regardless of how they pay. That's fine — the payment
request is the "pay now" action; a formal invoice can still follow (or be attached) for their
records. You're not choosing one over the other; the payment request just stops the invoice from
being the *only* path to getting paid.

## Situation 2: getting paid for a bounty-funded GitHub issue

This is a different shape of the same problem, common on Gitpay and similar platforms.

### The workflow

1. A sponsor or maintainer [funds a GitHub issue](/docs/en/funding-issues/) with a bounty amount.
2. A contributor claims the task — this confirms they're the GitHub user assigned to work on it, so
   the bounty is reserved for them rather than up for grabs by anyone.
3. The contributor delivers the work as a **pull request**, following whatever review process the
   repository uses (tests, CI checks, maintainer review).
4. Once the maintainer accepts the PR — typically once it's merged — the bounty is released.
5. The payment shows up as a transfer to the contributor's account, which they then withdraw as a
   [payout](/docs/en/payouts/).

The pull request is doing the same job the "handoff message" did in the freelance example: it's the
concrete, reviewable artifact that acceptance is based on. No PR (or equivalent accepted deliverable),
no clear moment to release payment.

### Why "claim first" matters

Skipping the claim step and just opening a PR against an open bounty is a common mistake. Without an
explicit claim, you risk duplicating effort with someone else already working on it, or building
against a scope that shifted after you started. Claiming first is what gives you (and the maintainer)
a shared, agreed starting point.

### What happens if nobody delivers

Bounty-funded issues don't stay in limbo forever. If a task goes unclaimed for a long stretch, most
platforms — Gitpay included — periodically check in and eventually release the task back to be
claimed by someone else, refunding the sponsor if it's never delivered. Worth knowing if you're
sponsoring, not just if you're contributing.

## Payment links: the same idea packaged for reuse

A **payment link** is a payment request you can reuse — one URL, shared once (in a README, a project
page, or a recurring invoice message), rather than freshly generated per delivery. It fits recurring
work: a maintenance retainer, a support contract, or a "buy me a coffee"-style link for smaller,
informal contributions. For one-off deliverables, a fresh payment request tied to that specific
delivery is usually the clearer choice — the amount and description match exactly what was delivered.

## Where the money actually goes: payout basics

Getting a payment request or bounty paid doesn't put money directly in your bank account — it credits
a balance you then withdraw. On Gitpay, that withdrawal is called a [payout](/docs/en/payouts/), and
how it works depends on which payout method you have connected: a bank account through Stripe, an
account on [Whop](/docs/en/whop-payout-setup/), or a linked PayPal account. Card payments also don't
clear instantly — providers hold funds for a short settlement period (commonly a few days) before
they're available to withdraw. If you're delivering software work regularly, it's worth setting up
your payout method *before* you need your first payment, not after.

If a payment is later disputed or refunded, that can be debited back out of your balance even after
it was credited — see [disputes and refunds](/docs/en/disputes-and-refunds/) if that happens to you.

## Common mistakes

- **Sending the payment request separately from the handoff.** Bundle them. Separate messages create
  a second thing the client can forget or deprioritize.
- **Starting work before being assigned or claimed.** On a funded issue, this risks wasted work if
  someone else is already assigned, or if scope shifts after you started.
- **No clear "done" moment.** If acceptance criteria are vague, payment becomes negotiable indefinitely.
  Tie the request to something concrete: a merged PR, a deployed feature, an agreed milestone.
- **Not setting up a payout method in advance.** Discovering you have no active payout method the day
  you're supposed to get paid adds an avoidable delay.
- **Treating a payment link as identical to an invoice.** It removes payment friction; it doesn't
  necessarily satisfy a client's accounting or tax requirements. Ask if you're unsure.

## A short checklist for your next delivery

Whichever situation you're in, before you consider the work "done":

1. What was delivered — one to three bullet points.
2. Where it's live or how to verify it (staging/production link, test steps).
3. What's next for the other side, if anything.
4. The payment request, payment link, or (for a funded issue) the claim/PR link.

## Where this fits on Gitpay

Gitpay connects both situations described above to the same underlying flow: fund an issue or send a
payment request, deliver against it with a Pull Request or an explicit handoff, and get paid once
it's accepted.

- Sponsoring or funding work: [Funding issues](/docs/en/funding-issues/)
- Delivering and claiming a bounty: [Claims — claiming tasks and tracking transfers](/docs/en/claims/)
- Sending a payment request for service work: [How our payment works](/docs/en/payments/)
- Getting your money out: [How payouts work](/docs/en/payouts/)

If you want to try the workflow described here rather than just read about it, create a payment
request or fund your next issue on [Gitpay](https://gitpay.me).
