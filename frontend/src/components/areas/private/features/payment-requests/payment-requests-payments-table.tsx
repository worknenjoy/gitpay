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
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' },
  actions: { sortable: false, numeric: false, label: 'Actions' }
}
