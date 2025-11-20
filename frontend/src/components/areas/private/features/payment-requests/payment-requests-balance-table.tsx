import React from 'react'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import { convertStripeAmountByCurrency } from 'design-library/molecules/cards/balance-card/balance-card'

export const paymentRequestBalancesMetadata = {
  reason: { sortable: true, numeric: false, dataBaseKey: 'reason', label: 'Reason' },
  type: { sortable: true, numeric: false, dataBaseKey: 'type', label: 'Type' },
  amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: 'Amount' },
  status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' },
}

export const paymentRequestBalancesCustomColumnRenderer = {
  reason: (item: any) => <TextField title={item?.reason} />,
  type: (item: any) => <TextField title={item?.type} />,
  amount: (item: any) => (
    <AmountField value={convertStripeAmountByCurrency(item?.amount, item?.currency)} />
  ),
  status: (item: any) => <TextField title={item?.status} />,
  createdAt: (item: any) => <CreatedField createdAt={item?.createdAt} />,
}
