import PaymentStatus from './payment-status'

export default {
  title: 'Design Library/Atoms/Status/Payments/PaymentStatus',
  component: PaymentStatus,
}

export const Open = {
  args: {
    status: 'open',
  },
}

export const Pending = {
  args: {
    status: 'pending',
  },
}

export const Succeeded = {
  args: {
    status: 'succeeded',
  },
}

export const Failed = {
  args: {
    status: 'failed',
  },
}

export const Expired = {
  args: {
    status: 'expired',
  },
}

export const Canceled = {
  args: {
    status: 'canceled',
  },
}

export const Refunded = {
  args: {
    status: 'refunded',
  },
}

export const Unknown = {
  args: {
    status: 'unknown',
  },
}

export const Loading = {
  args: {
    status: 'pending',
    completed: false,
  },
}
