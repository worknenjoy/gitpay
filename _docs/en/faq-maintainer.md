---
layout: doc
lang: en
role: maintainer
title: General questions
subtitle: Common questions from maintainers
tags: maintainer, faq
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

## How do I reduce back-and-forth on PRs?
Use a clear issue template with acceptance criteria, screenshots, and exact test steps.

Also:
- Ask contributors to open draft PRs early.
- Keep one source of truth for requirements (the issue).
- Separate must-fix feedback from nice-to-have suggestions.

## Do I need CI?
It’s strongly recommended. Even a basic test/lint pipeline makes reviews faster and acceptance criteria clearer.

At minimum, automate checks that protect your main branch (lint, tests, and build when relevant).

## What if the contribution is good but not quite complete?
Leave actionable feedback and (if possible) point to specific failing checks or missing behaviors.

If most of the scope is done, confirm whether the remaining work should be:
1. Completed in the same task before payment, or
2. Split into a follow-up issue with separate funding.

## Should I merge first or release payment first?
Prefer following a documented repository rule (for example, merge first, then release) and apply it consistently.

## How can I keep payout decisions fair?
Use the same acceptance checklist for every contributor, keep review notes public in the PR/issue, and base release decisions on agreed criteria rather than informal expectations.
