---
layout: doc
lang: en
role: maintainer
title: Releasing bounties
subtitle: When and how to release payment after acceptance
tags: maintainer, payments
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

## When to release
Release the bounty/payment after the work is accepted according to your repository workflow (typically after merge, or after explicit approval).

Use one clear rule per repository (for example: "release after merge to default branch") so contributors know exactly when payout is triggered.

## What to confirm before releasing
- The PR matches the agreed scope
- Validation steps passed (CI + any manual verification)
- The deliverable is usable in the target environment
- Any blocker feedback has been resolved and acknowledged
- Required documentation or migration notes are present

## Suggested release flow
1. Post an acceptance comment summarizing what was validated.
2. Confirm payout amount and recipient.
3. Trigger release using the agreed project workflow.
4. Share release confirmation in the issue/PR thread.

## If scope changed during delivery
- Compare final delivery with the latest approved scope.
- If extra work was added, confirm whether it is included in the current bounty.
- If some scope moved out, clarify what remains for a follow-up task.

## Communicate clearly
If you cannot accept the work, explain what is missing and what would be required to accept it.

Keep messages specific and actionable so contributors can resolve issues without guesswork.

## Example handoff
For an issue with a funded bug fix, record that the linked Pull Request meets the listed acceptance criteria. Confirm the assigned contributor and funded amount in Gitpay, then use the task's release action and tell the contributor where to track the transfer in [Claims](/docs/en/claims/). The transfer becoming available for [payout](/docs/en/payouts/) is a later step.

## If the task was not funded in advance
A project may decide to pay for an accepted contribution that began through ordinary collaboration. Agree on the payment route and amount with the contributor; do not describe this as an automatic bounty release. See [What is Gitpay?](/docs/en/getting-started/) for the distinction.
