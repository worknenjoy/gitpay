import React from 'react'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'

export const paymentRequestMetadata = {
  active: {
    sortable: true,
    numeric: false,
    dataBaseKey: 'active',
    label: 'Is active?',
    width: 100
  },
  title: { sortable: true, numeric: false, dataBaseKey: 'title', label: 'Title' },
  description: { sortable: true, numeric: false, dataBaseKey: 'description', label: 'Description' },
  amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: 'Amount' },
  paymentLink: {
    sortable: true,
    numeric: false,
    dataBaseKey: 'payment_url',
    label: 'Payment Link'
  },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' },
  actions: { sortable: false, numeric: false, label: 'Actions' }
}

export const paymentRequestPaymentsMetadata = {
  status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
  paymentRequestTitle: {
    sortable: true,
    numeric: false,
    dataBaseKey: 'PaymentRequest',
    label: 'Payment Request'
  },
  //"transferStatus": { sortable: true, numeric: false, dataBaseKey: "transferStatus", label: 'Transfer Status' },
  customer: {
    sortable: true,
    numeric: true,
    dataBaseKey: 'PaymentRequestCustomer',
    label: 'Customer e-mail'
  },
  amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: 'Amount' },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' }
}

export const paymentRequestPaymentsCustomColumnRenderer = {
  status: (item: any) => <TextField title={item.status} />,
  paymentRequestTitle: (item: any) => <TextField title={item.PaymentRequest?.title} />,
  /*
  transferStatus: (item:any) => (
    <TextField title={item.transferStatus} />
  ),
  */
  customer: (item: any) => <TextField title={item.PaymentRequestCustomer?.email} />,
  amount: (item: any) => <AmountField value={item.amount} />,
  createdAt: (item: any) => <CreatedField createdAt={item.createdAt} />
}
