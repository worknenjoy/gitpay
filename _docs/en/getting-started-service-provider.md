---
layout: doc
lang: en
role: service-provider
title: Get started as a service provider
subtitle: From a new account to your first paid payment request
tags: service-provider, payment-requests, getting-started
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

This page takes you from signing up to receiving your first payment. It takes about 15 minutes, most of it spent on identity verification with Whop.

## 1. Create your account

Sign up at [gitpay.me](https://gitpay.me) with your email and a password, or with GitHub or Bitbucket. If you sign up with email, open the verification link Gitpay sends you before continuing.

You don't need GitHub to use payment requests. You only need it to [import a pull request](/docs/en/delivering-work/) as a payment request.

## 2. Choose the Provider role

Go to **Account → Profile** (the "What types of users fit with you?" section), select **Provider** ("You provide a service and need to request payments") and save. Your dashboard now shows your payment links, revenue and claims.

## 3. Set up payouts

You can't create a payment request until your payout account is active. Gitpay creates the checkout under your own payout account, so it needs to exist first.

1. Open **Payout settings** and choose the **Whop** tab.
2. Choose your country. This sets your payout currency.
3. Select **Set up on Whop** and complete identity verification and a payout method (bank transfer, debit card or USDC) on Whop.
4. Come back to Gitpay. The status shows **PAYOUTS ACTIVE** once Whop has approved the account and a payout method is on file.

Details and troubleshooting: [Set up payouts](/docs/en/whop-payout-setup/).

## 4. Create your first payment request

1. In the sidebar, go to **Payment Requests → Payment links** and select **Create Payment Request**.
2. Enter a title, a description and an amount in USD, or turn on **Custom Amount** to let the customer choose.
3. Select **Create Payment Request**. Gitpay generates a payment link.

All fields and settings are explained in [Request payment from a customer](/docs/en/service-provider/).

## 5. Send the link and get paid

Copy the payment link and send it to your customer however you normally talk to them. When they pay:

- you get an email with the amount and the customer's details;
- the payment appears under **Payment Requests → Payments**, with the fees and your net amount;
- the money lands in your Whop balance. Card payments are usually **pending** for 1–4 days before they become **available**.

Then request a payout: [Payouts](/docs/en/payouts/).

## Before you start: things to agree with your customer

Gitpay processes the payment; it doesn't know what you agreed to deliver. Agree on the price, the deliverable and your refund policy in writing before you send the link. If a customer disputes a charge, that written agreement and proof of delivery are your evidence. See [Refunds and disputes](/docs/en/disputes-and-refunds/).

## Next steps

- [Request payment from a customer](/docs/en/service-provider/)
- [How payments and fees work](/docs/en/payments/)
- [Payouts](/docs/en/payouts/)
