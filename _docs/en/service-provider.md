---
layout: doc
lang: en
role: service-provider
title: Request payment from a customer
subtitle: Every field and setting of a payment request, what the customer sees, and how to manage your links
tags: service-provider, payment-requests
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

A payment request is a reusable payment link. You create it in Gitpay, send it to a customer, and the customer pays by card. Your payout account must be active first; see [Get started as a service provider](/docs/en/getting-started-service-provider/).

## Create a payment request

Go to **Payment Requests → Payment links → Create Payment Request**.

### Basic info

| Field | What it does |
|---|---|
| **Title** | Shown to the customer on the checkout. Name the service, e.g. "Character illustration – full body". |
| **Description** | Shown to the customer. Describe what they're paying for. |
| **Amount** | The price in USD. Not used when **Custom Amount** is on. |

### Settings

| Setting | Default | What it does |
|---|---|---|
| **Custom Amount** | Off | The customer types the amount they pay. Use it when the price differs per customer, for tips, or for deposits. |
| **Deactivate after payment** | Off | The link stops accepting payments after the first payment. Use it for one-off jobs. |
| **Send e-mail notification with instructions on payment** | Off | After paying, the customer receives an email with the instructions you write (next steps, delivery details, how to contact you). |
| **List on profile** | Off | Shows the link on your public Gitpay profile, so anyone who visits it can pay. |
| **Direct charge to your connected account** | On (locked) | The payment is charged on your own Whop account and Gitpay's fee is split off in the same charge. See [How payments and fees work](/docs/en/payments/). |
| **Active** | On | When off, the link can't be paid. |

**Attach files** (deliver files automatically after payment) is shown as *Coming soon*.

### What happens when you save

Gitpay creates the product and checkout on Whop and gives you the payment link. The platform fee in effect at that moment (currently 5%) is saved on the link and applies to every payment it receives, even if Gitpay's fee changes later.

## What the customer sees

- **Fixed amount:** the link opens a secure Whop checkout with your title, description and price. The customer pays by card.
- **Custom amount:** the link opens a Gitpay page where the customer enters the amount, then pays in a checkout embedded on the same page.

The customer doesn't need a Gitpay account.

After paying, the customer receives your instructions email if you turned it on.

## After a payment

You receive an email with the amount and the customer's name and email. In **Payment Requests → Payments** you can open each payment to see:

- **Customer paid**: the gross amount;
- **Processing fee**: Whop's fee for processing the payment;
- **Platform fee (5%)**: Gitpay's fee;
- **Net amount**: what you receive. It shows **Pending** until Whop reports the final amount.

The same view has the payment status (completed, failed or refunded) and its activity.

## Manage your links

From **Payment links**, use **Actions** on any link to:

- edit the **title** and **description**;
- turn **Active** on or off, for example if a link was shared with the wrong person;
- change the other settings, such as **List on profile** or the instructions email.

You can't change the amount or switch between fixed and custom amount on an existing link. Create a new link, and deactivate the old one.

## Request payment for a pull request

If the work is a pull request on GitHub, you can import it instead of filling in the form, and post the payment link as a comment on the pull request. See [Payment requests for pull requests](/docs/en/delivering-work/).

## Good practice

- Send the link privately to the person who pays. A public link can be paid by anyone.
- Agree on the price, scope and refund policy in writing before sending the link.
- Keep proof of delivery (the conversation, the delivered files) until the payment can no longer be disputed.
- Use **Deactivate after payment** for one-off jobs, so a link can't be paid twice by mistake.

## Next steps

- [How payments and fees work](/docs/en/payments/)
- [Refunds and disputes](/docs/en/disputes-and-refunds/)
- [Payouts](/docs/en/payouts/)
