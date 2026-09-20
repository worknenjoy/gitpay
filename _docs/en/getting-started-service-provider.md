---
layout: doc
lang: en
role: service-provider
title: Getting started as a service provider
subtitle: Deliver client work and collect payment using Git workflow
tags: service-provider, getting-started
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

## What this guide covers
This page is for people delivering paid work (services) where the repository workflow is used to validate delivery.

Use this guide when you need traceable delivery evidence before collecting payment (for example: development tasks, design revisions, content updates, or technical consulting artifacts).

## Typical delivery flow
1. Agree on scope and acceptance criteria.
2. Deliver work in small PRs when possible.
3. Use review + CI to validate.
4. Mark delivery accepted when criteria are met.
5. Trigger payment based on acceptance.

## Define delivery terms before starting
Align with the customer on:
- Deliverables and exclusions.
- Milestones and deadlines.
- Number of revision rounds included.
- Approval owner (who signs off).
- Payment trigger (per milestone or full acceptance).

## Build trust with transparent progress
- Share short updates at agreed checkpoints.
- Link commits/PRs to each milestone.
- Flag risks early (scope creep, blocked dependencies, timeline shifts).
- Keep all approval and scope decisions documented.

## Pre-delivery checklist
1. Confirm all acceptance criteria are covered.
2. Ensure requested assets/documents are attached.
3. Verify checks and tests relevant to the scope.
4. Prepare a concise summary of what was delivered.
5. Confirm customer review window and next action.

## Next steps
- Read [Delivering work](/docs/en/delivering-work)
- Review [Pull Requests](/docs/en/pull-requests)

## Use a Payment Request after delivery
For direct customer work, Gitpay's documented path is a Payment Request. Agree on the work and price, deliver it, and create a request with a clear description and amount. Send the payment link to the customer, then follow the resulting payment and payout in your account. A GitHub Pull Request can be useful evidence, but is not required for work delivered outside a repository.

## Example: a completed milestone
A designer shares the agreed files and receives approval for a milestone. They create a Payment Request describing that milestone and send its link to the client. The client reviews and pays; the designer tracks the transfer in [Claims](/docs/en/claims/) and configures [Payouts](/docs/en/payouts/).

Continue with [Charge customers](/docs/en/service-provider/) for the request flow and [Disputes and refunds](/docs/en/disputes-and-refunds/) for later payment issues.
