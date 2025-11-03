# Revenue Reports

Generates Stripe-based revenue reports by year, with clear separation of transfers, charges, payouts, and extra fees.

## Usage

- Run for a specific year:

  npm run reports:revenue -- --year=2024

- Defaults to YEAR=2018 if no `--year` or `YEAR` env var is provided.

## Outputs

Files are written to `tmp/reports/`:

- `revenue_<year>.csv` — Main report with columns:
  - Status, TransactionType, TransferId, ChargeId, ServiceType
  - Transfer Amount, Original Charge Amount, Stripe Fee
  - Transfer Date, Charge Date, Revenue
  - The last row contains totals for Transfer Amount, Original Charge Amount, Stripe Fee, and Revenue (USD only).

- `payouts_<year>.csv` — All payouts in the period with ID, status, currency, payout/arrival dates, and amount.
- `extra_fees_<year>.csv` — Balance transactions with non-zero fees in the period (fee, net, description) per currency.
- `summary_<year>.csv` — Summary metrics in USD (Gross Revenue, Payouts, Extra Fees, Net Revenue) and per-currency totals for non-USD payouts/fees.
- Optionally, a combined workbook `revenue_<year>.xlsx` is created if the `xlsx` package is available at runtime.

## Rules and Notes

- Transfers-first model: rows are built primarily from transfers in the selected year; charge-only rows for charges without a transfer_group are then added.
- Status:
  - `completed` for transfers and invoices/subscriptions.
  - `pending` for charges/payment_intent without transfers (Amount/Revenue shown as 0; Original Charge Amount still totaled).
- Revenue calculation (USD only):
  - `Revenue = Original Charge Amount − Stripe Fee − Transfer Amount`
  - Pending rows always have `Revenue = 0`.
- Currency handling:
  - All arithmetic in the main report is in USD cents. Non-USD values are left blank in amount/fee/revenue columns.
  - `summary_<year>.csv` includes per-currency totals for payouts and extra fees (no cross-currency netting).

## Implementation

- Entry point: `src/scripts/reports/revenue-reports/revenue_report.ts`
- Modular helpers in `lib/`:
  - `reportBuilder.ts` — Builds rows and totals for a given period.
  - `exporters.ts` — Writes CSVs and optional XLSX workbook.
  - `stripe.ts` — Stripe API helpers.
  - `finance.ts`, `format.ts`, `types.ts` — Business logic, formatting, and shared types.
