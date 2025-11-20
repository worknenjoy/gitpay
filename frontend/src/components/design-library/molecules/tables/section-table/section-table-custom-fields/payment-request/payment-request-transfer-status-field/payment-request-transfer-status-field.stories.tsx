import PaymentRequestStatusField from './payment-request-transfer-status-field'

const meta = {
  title: 'Design Library/Molecules/Tables/Fields/PaymentRequest/PaymentRequestStatusField',
  component: PaymentRequestStatusField,
  args: {
    status: 'pending_payment'
  }
}

export const Pending = {
  args: {
    status: 'pending_payment'
  }
}

export const Initiated = {
  args: {
    status: 'initiated'
  }
}

export const Completed = {
  args: {
    status: 'completed'
  }
}

export const Error = {
  args: {
    status: 'error'
  }
}
