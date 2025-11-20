import InvoiceStatus from './invoice-status'

export default {
  title: 'Design Library/Atoms/Status/Payments/InvoiceStatus',
  component: InvoiceStatus,
}

export const Pending = {
  args: { status: 'pending' },
}
export const Draft = {
  args: { status: 'draft' },
}
export const Open = {
  args: { status: 'open' },
}
export const Paid = {
  args: { status: 'paid' },
}
export const Failed = {
  args: { status: 'failed' },
}
export const Uncollectible = {
  args: { status: 'uncollectible' },
}
export const Void = {
  args: { status: 'void' },
}
export const Refunded = {
  args: { status: 'refunded' },
}
export const Loading = {
  args: {
    status: 'pending',
    completed: false,
  },
}
