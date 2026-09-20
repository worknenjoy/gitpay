---
layout: doc
lang: en
role: contributor
title: Delivering work with Pull Requests
subtitle: Link a project contribution to review, acceptance, and payment
author:
tags:
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

A Pull Request (PR) gives a project a reviewable record of a contribution. It shows the change, discussion, and checks. For funded Gitpay tasks, link the PR to the issue so the maintainer can review the work against the agreed scope.

## Before opening a PR
Read the repository's contribution instructions and the issue's acceptance criteria. Confirm assignment for a funded task. Create a branch or fork as the project requests, make a focused change, and run the relevant checks.

## What to include
- A short explanation of the problem and the solution.
- The issue or Gitpay task link.
- Tests run and their results; screenshots for visual changes.
- Any limitation, migration step, or follow-up work.
- A clear question when you need a maintainer decision.

## Review and acceptance
A reviewer may request revisions. Update the branch and explain how each blocking comment was addressed. Passing CI helps review but does not replace the maintainer's acceptance decision. Merge behavior depends on the repository's rules; link an issue without assuming GitHub will always close it automatically.

## Payment connection
The PR demonstrates delivery, while the project confirms acceptance and releases the relevant bounty or payment. Keep the payment agreement visible before extra work begins. See [Work on an issue](/docs/en/contributor/), [Validating work](/docs/en/validating-work/), and [Releasing bounties](/docs/en/releasing-bounties/).

For a service delivered directly to a client, a PR can be evidence, but a [Payment Request](/docs/en/service-provider/) does not require one.
