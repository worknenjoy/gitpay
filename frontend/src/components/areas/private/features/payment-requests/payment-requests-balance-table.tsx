import React from "react"
import TextField from "design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field"
import AmountField from "design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field"
import { formatCurrency } from "../../../../../utils/format-currency"

export const paymentRequestBalancesMetadata = {
  "reason": { sortable: true, numeric: false, dataBaseKey: "reason", label: 'Reason' },
  "amount": { sortable: true, numeric: true, dataBaseKey: "amount", label: 'Amount' }
}

export const paymentRequestBalancesCustomColumnRenderer = {
  reason: (item:any) => (
  <TextField title={item?.reason} />
  ),
  amount: (item:any) => (
    <AmountField value={formatCurrency(item?.amount)} />
  )
}