import TransferStatusField from './transfer-status-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Transfers/TransferStatusField',
  component: TransferStatusField
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

export const Reversed = {
  args: {
    status: 'reversed'
  }
}

export const Completed = {
  args: {
    status: 'completed'
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
