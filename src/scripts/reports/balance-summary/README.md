# 📊 Monthly Financial Reconciliation Explained

This document explains the meaning and accounting logic behind the generated
**Monthly Earnings (Net) & Balances** table.

The goal of this report is to **separate cash movements from economic reality**,
so Stripe balance changes are never confused with profit or loss.

---

## 🧠 What this table represents

This table is a **monthly balance-sheet reconciliation** that tracks:

- real cash held in Stripe
- internal allocations (wallet balances)
- outstanding obligations (task liabilities)
- true economic profit or loss

It allows Stripe activity to be fully reconciled **without treating Stripe balance changes as earnings**.

---

## 🔑 Core accounting identity

At the end of **any month**, the following must hold:

Net position
= Stripe cash
− Wallet
− Task liabilities


Month over month:

Net change = Δ Net position


If this identity breaks, there is an accounting error.

---

## 📅 Column definitions

### Month
Accounting period for the row.

---

### Net change
**True net profit or loss for the month.**

This reflects the actual economic result after:
- platform revenue
- Stripe fees
- contributor payouts
- refunds / chargebacks
- changes in outstanding obligations

Positive → Gitpay gained value  
Negative → Gitpay lost value

This is the number that corresponds to **net income**.

---

### Net pos.
**Cumulative financial position** over time.

It is the running total of `Net change`.

It can also always be recomputed as:


---

### Stripe cash
**Actual cash held in Stripe at month end.**

Includes:
- customer payments
- refunds
- payouts
- Stripe fees
- internal transfers (e.g. wallet funding)

⚠️ Stripe cash is **not profit**.

---

### Wallet
**Funds reserved internally for users (custodial balances).**

- Still physically in Stripe
- Economically belongs to users
- Not available to Gitpay

Wallet balances reduce Gitpay’s net position.

Introduced starting **2024-10**.

---

### Task liab.
**Outstanding obligations for completed or accepted work.**

Represents:
- unpaid bounties
- unpaid tasks
- unpaid payment requests

These are:
- already earned by contributors
- not yet paid out

Accounting-wise, this is a **liability**.

---

### New liab.
**New obligations created during the month.**

Examples:
- new bounties created
- new tasks accepted
- new payment requests approved

This increases `Task liab.` but does not necessarily move cash yet.

---

### Stripe Δ
**Net Stripe balance movement during the month.**

Includes *all* Stripe activity:
- revenue
- refunds
- payouts
- fees
- wallet funding and releases

Because of this:

> Stripe Δ ≠ Net change

and should never be interpreted as profit.

---

## 🔍 How reconciliation works

Stripe only tracks **cash**.

This report adds:
- liabilities (Task liab.)
- internal allocations (Wallet)

to recover the **true economic position**.

Large Stripe inflows can occur with **negative Net change** if:
- wallet balances increase
- new obligations are created
- cash is internally reallocated

---

## ✅ Key takeaway

- **Net change** = true monthly profit / loss
- **Net pos.** = company value over time
- **Stripe cash** = liquidity, not earnings
- **Wallet + Task liab.** = money Gitpay does not own

This separation ensures:
- accurate reporting
- Stripe reconciliation
- investor-ready financials
- zero ambiguity about “missing money”

---
