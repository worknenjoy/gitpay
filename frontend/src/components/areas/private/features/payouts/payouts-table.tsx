import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import {
  convertStripeAmountByCurrency,
  currencyCodeToSymbol
} from 'design-library/molecules/cards/balance-card/balance-card'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import PayoutStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payouts/payout-status-field/payout-status-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'

const messages = defineMessages({
  status: {
    id: 'payouts.table.status',
    defaultMessage: 'Status'
  },
  transferMethod: {
    id: 'payouts.table.transferMethod',
    defaultMessage: 'Transfer Method'
  },
  amount: {
    id: 'payouts.table.amount',
    defaultMessage: 'Amount'
  },
  arrivalDate: {
    id: 'payouts.table.arrivalDate',
    defaultMessage: 'Arrival Date'
  },
  referenceNumber: {
    id: 'payouts.table.referenceNumber',
    defaultMessage: 'Reference Number'
  },
  createdAt: {
    id: 'payouts.table.createdAt',
    defaultMessage: 'Created at'
  }
})

const PayoutsTable = ({ payouts }) => {
  const intl = useIntl()
  
  const tableHeaderMetadata = {
    status: { sortable: true, numeric: false, dataBaseKey: 'status', label: intl.formatMessage(messages.status) },
    method: { sortable: true, numeric: false, dataBaseKey: 'method', label: intl.formatMessage(messages.transferMethod) },
    amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: intl.formatMessage(messages.amount) },
    arrival_date: {
      sortable: true,
      numeric: false,
      dataBaseKey: 'arrival_date',
      label: intl.formatMessage(messages.arrivalDate)
    },
    reference_number: {
      sortable: true,
      numeric: false,
      dataBaseKey: 'reference_number',
      label: intl.formatMessage(messages.referenceNumber)
    },
    createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: intl.formatMessage(messages.createdAt) }
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
