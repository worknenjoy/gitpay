import PayoutStatusField from './payout-status-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Payouts/PayoutStatusField',
  component: PayoutStatusField
}

export const Pending = {
  args: {
    status: 'pending'
  }
}

export const Created = {
  args: {
    status: 'created'
  }
}

export const InTransit = {
  args: {
    status: 'in_transit'
  }
}

export const Failed = {
  args: {
    status: 'failed'
  }
}

export const Canceled = {
  args: {
    status: 'canceled'
  }
}

export const Paid = {
  args: {
    status: 'paid'
  }
}

export const Unknown = {
  args: {
    status: 'unknown'
  }
}

export const Loading = {
  args: {
    status: 'pending',
    completed: false
  }
}
