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
