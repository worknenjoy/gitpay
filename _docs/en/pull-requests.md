---
layout: doc
lang: en
role: contributor
title: Submit a solution
subtitle: The five checks a pull request must pass for the bounty to be paid
tags: contributor, bounties, pull-requests, solutions
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

When your pull request solves a funded issue, you submit it to Gitpay as a **solution**. Gitpay checks it on GitHub. If all checks pass, the bounty is transferred to you automatically.

## Send a solution

1. Open the issue on Gitpay and select **Send solution**.
2. Paste the pull request URL, or pick it from **My pull requests** if you're connected to GitHub.
3. Gitpay runs the checks and shows the result of each one.
4. Select **Send Solution**.

You can send the solution before the pull request is merged. It then shows **Waiting for merge**, and you can use **Edit Solution** to run the checks again once it's merged.

## The checks

| Check | How to pass it |
|---|---|
| **You're connected to GitHub** | Sign in to Gitpay with GitHub. |
| **You're the author of this pull request on GitHub** | Submit a pull request you opened, from the GitHub account you signed in with. |
| **The pull request was merged** | The pull request must be merged (not just closed) into the **same repository** as the issue. |
| **The issue is referenced in the pull request** | Mention the issue in the pull request description, e.g. `Fixes #123` or the full issue URL. |
| **The issue is closed on GitHub** | The issue must be closed. Using `Fixes #123` in the description closes it automatically on merge. |

Gitpay also shows whether **the bounty is available**. If there's no bounty yet, you can still send the solution and request payment from the maintainer.

## Payout status

| Status | Meaning |
|---|---|
| **Ready to pay** | All checks pass. The bounty is transferred. |
| **Waiting for merge** | The pull request isn't merged yet. Payment releases on merge. |
| **Not eligible** | One or more checks fail. |

When the bounty is transferred, you receive 92% of the paid bounty in your payout account, and a claim appears in **Receive Payments → My Claims**. See [Claims](/docs/en/claims/).

## If the transfer fails

- **"Your account needs to be updated to receive payments"**: your payout account isn't active. Finish [setting up payouts](/docs/en/whop-payout-setup/), then edit and resend the solution.
- A check you expected to pass fails: compare the pull request with the table above. The most common causes are a pull request to a fork instead of the original repository, and a description that doesn't reference the issue.

## If you forget to submit

If your pull request was merged but you never submitted it, Gitpay emails you on the 26th of each month as a reminder. After two reminders, the bounty is refunded to the sponsors. Submit as soon as your pull request is merged.

## Next steps

- [Claims](/docs/en/claims/)
- [Payouts](/docs/en/payouts/)
- [Git workflow](/docs/en/git-workflow/)
