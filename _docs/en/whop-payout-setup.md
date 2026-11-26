---
layout: doc
lang: en
title: Set up payouts
subtitle: Connect a Whop payout account so you can receive payments and bounties
tags: payouts, whop, account, verification
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

To receive money on Gitpay, from payment requests or bounties, you need an active payout account. Gitpay uses Whop for this. Whop verifies your identity, handles tax forms, and sends money to your bank account, debit card or USDC wallet. Gitpay never stores your bank details.

## Set up your Whop payout account

1. Open **Payout settings** and choose the **Whop** tab.
2. **Choose your country** and continue. Your country sets your payout currency, and Gitpay creates a Whop account for you under the Gitpay platform, using your name and email.
   - If a Whop account already exists for your verified email, Gitpay asks whether to link it instead.
3. Select **Set up on Whop**. You're taken to Whop to:
   - verify your identity (legal name and documents);
   - add a payout method: bank transfer, debit card or USDC.
4. When you finish, Whop sends you back to Gitpay with "Account verification submitted".

Whop supports payouts to more than 100 countries in more than 30 currencies.

## Account status

The **Payout settings** page shows your status:

| Status | Meaning | What to do |
|---|---|---|
| **PAYOUTS ACTIVE** | Verified and a payout method is on file. You can create payment requests and receive bounties. | Nothing. |
| **VERIFICATION REQUIRED** | Whop still needs information from you. | Select **Complete verification** and finish the steps on Whop. |
| **PENDING** | You submitted everything and Whop is reviewing it. | Wait, or select **Check status on Whop**. |
| **REJECTED** | Whop flagged an issue with the account. | Select **Resolve on Whop**. |

Your account counts as active only when **both** are true: Whop has approved it for payouts, and it has at least one payout method. Verification alone isn't enough.

If your verification link expires, open **Payout settings** again and continue. What you already submitted is kept.

## What you can see in Gitpay

- **Account holder**: your connected Whop company, its ID, country and currency, and its balances:
  - **Available**: can be paid out now;
  - **Pending**: still settling (card payments usually take 1–4 days);
  - **Reserve**: held by Whop.
- **Bank account**: a link to manage your payout method on Whop. Bank details are only stored on Whop.
- **Disputes / refunds**: chargebacks and refunds Whop reports for your account.

To change your payout method, schedule or identity details, select **Manage on Whop**.

## Disconnect

**Disconnect Whop account** removes the link between Gitpay and your Whop company. Whop keeps your bank and identity data. You can reconnect later by choosing a country again.

## Stripe and PayPal (older accounts)

Before Whop, Gitpay paid out through Stripe Connect and PayPal.

- **Stripe:** you can no longer create a new Stripe payout account. Existing Stripe accounts keep paying out on their schedule until they're moved to Whop; support will contact you about the move.
- **PayPal:** being discontinued, and can no longer be added. Use Whop, which covers the same countries.

## Next steps

- [Payouts](/docs/en/payouts/)
- [How payments and fees work](/docs/en/payments/)
