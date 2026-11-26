---
layout: doc
lang: en
role: service-provider
title: Payment requests for pull requests
subtitle: Turn a merged pull request into a payment link and post it on GitHub
tags: service-provider, payment-requests, pull-requests, github
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

If you contributed to a project and want to ask for payment, or let people support the work, you can import the pull request into Gitpay. Gitpay creates a payment request linked to it and can post the payment link as a comment on the pull request, written as you.

This works for any merged pull request you authored on GitHub, whether or not the issue has a bounty. For issues that do have a bounty, send a solution instead; see [Submit a solution](/docs/en/pull-requests/).

## Requirements

- Your Gitpay account is connected to GitHub.
- You opened the pull request with that GitHub account.
- The pull request is **merged**. Open or closed-without-merge pull requests can't be imported.
- Your payout account is active ([Set up payouts](/docs/en/whop-payout-setup/)).

## Import a pull request

1. Select **Import pull request** in the top bar.
2. Paste the pull request URL, or pick it from **My pull requests** if GitHub is connected.
3. Choose the amount:
   - **Fixed amount**: you set the price and the payer pays that amount.
   - **Custom amount**: the payer chooses how much to pay, in USD.
4. Review the payment request. You can see a preview of the comment before anything is posted.
5. Choose **Create and post** to create the link and post the comment, or **Create** to only create the link.

The payment request appears in **Payment Requests → Payment links** like any other, with the pull request linked to it. Fees and payouts are the same as for any payment request.

## The comment on the pull request

The comment is posted from your own GitHub account, not from a Gitpay bot. It says the payment is optional and includes the price (or "any amount is welcome" for custom amounts) and a **Pay here** link.

To post it, Gitpay needs permission to comment as you on public repositories. If you haven't granted it yet, Gitpay sends you to GitHub to approve it first.

If you chose **Create** only, you can post the comment later from the same dialog with **Post in pull request**.

## Errors

| Message | What to do |
|---|---|
| Connect your GitHub account before importing a pull request | Sign in with GitHub, or connect GitHub to your account. |
| This pull request wasn't opened by your connected GitHub account | You can only import your own pull requests. |
| Only merged pull requests can be imported | Wait until the pull request is merged. |
| We couldn't find that pull request | Check the URL. It should look like `https://github.com/owner/repo/pull/123`. |

## Next steps

- [Request payment from a customer](/docs/en/service-provider/)
- [How payments and fees work](/docs/en/payments/)
