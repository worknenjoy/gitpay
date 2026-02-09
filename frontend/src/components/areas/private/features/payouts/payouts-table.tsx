import React from 'react'
import { FormattedMessage } from 'react-intl'
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
    status: { sortable: true, numeric: false, dataBaseKey: 'status', label: <FormattedMessage id="payouts.table.status" defaultMessage="Status" /> },
    method: { sortable: true, numeric: false, dataBaseKey: 'method', label: <FormattedMessage id="payouts.table.transferMethod" defaultMessage="Transfer Method" /> },
    amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: <FormattedMessage id="payouts.table.amount" defaultMessage="Amount" /> },
    arrival_date: {
      sortable: true,
      numeric: false,
      dataBaseKey: 'arrival_date',
      label: <FormattedMessage id="payouts.table.arrivalDate" defaultMessage="Arrival Date" />
    },
    reference_number: {
      sortable: true,
      numeric: false,
      dataBaseKey: 'reference_number',
      label: <FormattedMessage id="payouts.table.referenceNumber" defaultMessage="Reference Number" />
    },
    createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: <FormattedMessage id="payouts.table.createdAt" defaultMessage="Created at" /> }
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
    arrival_date: (item: any) =>
      item.arrival_date ? <CreatedField createdAt={item.arrival_date * 1000} /> : <span>—</span>,
    reference_number: (item: any) => <span>{item.reference_number || '—'}</span>,
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
