import React from 'react'
import {
  convertStripeAmountByCurrency,
  currencyCodeToSymbol
} from 'design-library/molecules/cards/balance-card/balance-card'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import PayoutStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payouts/payout-status-field/payout-status-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'

const PayoutsTable = ({ payouts }) => {
  const tableHeaderMetadata = {
    status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
    method: { sortable: true, numeric: false, dataBaseKey: 'method', label: 'Transfer Method' },
    amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: 'Amount' },
    createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' }
  }

  const customColumnRenderer = {
    status: (item: any) => <PayoutStatusField status={item.status} />,
    method: (item: any) => <span>{item.method || 'No method available'}</span>,
    amount: (item: any) => (
      <AmountField
        value={convertStripeAmountByCurrency(item.amount, item.currency)}
        currency={currencyCodeToSymbol(item.currency)}
      />
    ),
    createdAt: (item: any) => <CreatedField createdAt={item.createdAt} />
  }

  return (
    <SectionTable
      tableData={payouts}
      tableHeaderMetadata={tableHeaderMetadata}
      customColumnRenderer={customColumnRenderer}
    />
  )
}

export default PayoutsTable
