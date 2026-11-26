---
layout: doc
lang: en
title: What is Gitpay?
subtitle: The two ways money moves on Gitpay, who uses them, and what each costs
tags: getting-started, payments, payment-requests, bounties
redirect_from:
  - /docs/en/collections/
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Gitpay is a payment platform for work. It has two products:

| | Payment requests | Bounties |
|---|---|---|
| What it is | A payment link you send to a customer | Money attached to a GitHub (or Bitbucket) issue |
| Who gets paid | The person who created the link | The contributor whose pull request solves the issue |
| When they get paid | When the customer pays | When the solution is merged and the issue is closed |
| Who pays the fee | The seller (deducted from the payment) | The sponsor (added on top) and the contributor (deducted from the payout) |
| Start here | [Get started as a service provider](/docs/en/getting-started-service-provider/) | [Get started as a contributor](/docs/en/getting-started-contributor/) or [as a sponsor](/docs/en/getting-started-sponsor/) |

## Payment requests

A payment request is a link with a title, a description and an amount (fixed, or chosen by the customer). You send it to a customer in a message, email or DM. The customer pays by card on a secure checkout, and the money goes to your payout account, minus the processing fee and Gitpay's platform fee.

You don't need a website, a store or a GitHub repository. Payment requests work for any digital service: design, illustration and commissions, development, consulting, writing, editing, coaching.

Read [Request payment from a customer](/docs/en/service-provider/).

## Bounties

A bounty is money a sponsor puts on an issue. Anyone can see the issue on Gitpay, work on it, and send a pull request. When the pull request is merged and the issue is closed, the contributor sends the pull request URL to Gitpay as a solution and the bounty is paid out to them.

Sponsors can pay now (Gitpay holds the money until a solution is merged) or pledge to pay later (nothing is charged until a solution is accepted).

Read [Fund an issue](/docs/en/sponsor/) and [Work on a funded issue](/docs/en/contributor/).

## Roles

Your account can have one or more roles. Roles change what you see on your dashboard; they don't limit what you're allowed to do.

| Role | In the app | For |
|---|---|---|
| Service provider | Provider | Sending payment requests to customers |
| Contributor | Contributor | Solving funded issues |
| Sponsor | Funding | Funding issues |
| Maintainer | Maintainer | Importing issues from your projects and reviewing work |

Change your roles in **Account → Profile** (the "What types of users fit with you?" section).

## How money moves

Gitpay uses [Whop](https://whop.com) for checkout, identity verification and payouts. Accounts created before Whop may still use Stripe Connect or PayPal; see [Set up payouts](/docs/en/whop-payout-setup/).

**Payment request:** customer pays → the payment lands in your Whop balance (Gitpay's fee is split off in the same charge) → you request a payout to your bank, debit card or USDC wallet.

**Bounty:** sponsor pays → Gitpay holds the money → solution merged and issue closed → Gitpay transfers the bounty to the contributor's payout account → the contributor requests a payout.

## Fees at a glance

| | Fee |
|---|---|
| Payment request (created with Whop direct charge) | 5% of the amount charged, plus Whop's processing fee |
| Payment request (older links, Gitpay as merchant of record) | 8% of the amount after processing fees |
| Bounty, open source issue | 8% added for the sponsor; no fee on bounties of $5,000 or more |
| Bounty, private issue | 18% added for the sponsor |
| Bounty payout to the contributor | The contributor receives 92% of the bounty |

Full details: [How payments and fees work](/docs/en/payments/).

## Next steps

- [Get started as a service provider](/docs/en/getting-started-service-provider/)
- [Get started as a contributor](/docs/en/getting-started-contributor/)
- [Get started as a sponsor](/docs/en/getting-started-sponsor/)
- [Frequently asked questions](/docs/en/faq/)
