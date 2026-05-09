---
layout: doc
lang: en
role: maintainer
title: Validating work
subtitle: How to review, test, and accept deliverables consistently
tags: maintainer, validation, review
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

## Define “done” up front
In the issue description, include:
- Expected behavior and edge cases
- How to test (manual steps and/or automated tests)
- Any UX requirements (screenshots, copy, responsiveness)
- Non-functional constraints (performance, security, accessibility) when applicable
- Rollout or migration notes when changes affect existing users

## Use a repeatable review checklist
- Scope: matches what was agreed
- Quality: readable code, consistent patterns
- Safety: no obvious security or data handling issues
- Tests: added/updated where appropriate
- Docs: updated if behavior changed

## Validate evidence, not assumptions
- Reproduce key flows locally or in the target environment.
- Confirm screenshots/videos represent current code, not outdated revisions.
- Check that test instructions in the PR are runnable by another reviewer.
- Verify linked issues and PR descriptions are aligned with delivered behavior.

## Handle revision rounds efficiently
1. Group feedback by priority (blocking vs non-blocking).
2. Reference exact files/lines or failing checks.
3. Confirm when each blocking item is resolved.
4. Re-run critical validation steps after updates.

## Acceptance
Accept/merge when the agreed requirements are met and your validation steps pass.

If acceptance is blocked, provide a short list of remaining required changes so contributors can close the gap quickly.
