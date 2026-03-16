# Accounting Statements (Year)

Generates (for a given year):

- Income Statement / P&L
- Balance Sheet (as-of year end)
- General Ledger (CSV)

This report is **Stripe + DB based**, and follows the same reconciliation logic used by the existing `balance-summary` scripts:

- **Stripe cash** comes from Stripe `balanceTransactions` (back-calculated from the current Stripe balance).
- **Wallet** is computed from DB `WalletOrder` (adds) and `Order` (wallet spends).
- **Pending task liabilities** are computed from DB `Task` + `History`.

## Run

```bash
# Example
npm run reports:accounting_statements -- --year=2025

# Or
YEAR=2025 npm run reports:accounting_statements
```

## Output

Writes files to `tmp/reports/`:

- `accounting_<year>_pnl.json`
- `accounting_<year>_balance_sheet.json`
- `accounting_<year>_general_ledger.csv`

## External data (bank, expenses)

If you need to include items that Gitpay/Stripe doesn’t know about yet (bank balances, SaaS costs, contractors, etc), edit the `externalData` object in:

- `src/scripts/reports/accounting-statements/accounting_statements.ts`

Keep it simple: add entries to `externalData.expenses` (and/or `externalData.otherIncome`) and they will be included in the year totals and the exported GL.
