---
layout: doc
lang: en
title: Refunds and disputes
subtitle: How to refund a customer, what happens when a payment is disputed, and how bounty refunds work
tags: payments, refunds, disputes, chargebacks, payment-requests, bounties
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

A **refund** is money you (or Gitpay) return to a payer. A **dispute**, or chargeback, is when the payer asks their bank to reverse a card payment. Disputes cost more than refunds, so if a customer is unhappy, a refund is usually the better outcome for both sides.

## Refund a payment request payment

1. Go to **Payment Requests → Payments** and open the payment.
2. Select **Refund** and confirm.

The customer is refunded **the amount they paid, excluding fees**: the processing fee and Gitpay's platform fee aren't returned, because the payment processor doesn't return them either. In practice the customer gets back your net amount for that payment.

The customer receives a refund confirmation by email. The payment status changes to **Refunded**.

### Where the refund comes from

- **Direct charge payments** (all new payment requests): the refund is paid from your Whop balance. Nothing is recorded on your Gitpay payment request balance.
- **Older payment requests** (Gitpay as merchant of record): if you were already paid for the payment, the refunded amount is recovered from you. If you weren't paid yet, only the processing fee that can't be recovered is charged to you. These amounts appear in **Payment Requests → Disputes / refunds**.

## Disputes on payment requests

### Direct charge payments

Your Whop account is the merchant of record, so disputes are opened against your account and handled on Whop. Whop may charge dispute fees. Gitpay notifies you when Whop reports a dispute or an early dispute warning.

To respond, send Whop your evidence: the written agreement with the customer (price and scope), the delivered work, and your conversation with them.

### Older payment requests

Gitpay handles the dispute and charges the cost to your payment request balance:

```
disputed amount + platform fee (8%) + dispute fee ($15 on Whop, or Stripe's fee)
```

If the dispute is won, the amount is credited back. A negative balance is recovered from your next payments.

### Avoiding disputes

- Agree on the price, scope and refund policy in writing before you send the link.
- Send links privately to the person paying.
- Keep proof of delivery.
- Refund quickly when you can't deliver.

## Bounty refunds

| Situation | What happens |
|---|---|
| A solution was merged but nobody claimed the bounty | Gitpay emails the pull request author on the 26th of each month. After two reminders, the next run refunds the sponsors. |
| You funded the wrong issue | In **Payments**, use **Transfer Bounty** to move your payment to another issue. |
| Anything else (issue abandoned, closed without a solution) | Contact [contact@gitpay.me](mailto:contact@gitpay.me) with the issue link. |

Refunds go back to the original payment method, or to your wallet if you paid from a wallet. The fee added when you funded the bounty isn't refunded.

## Next steps

- [How payments and fees work](/docs/en/payments/)
- [Fund an issue](/docs/en/sponsor/)
