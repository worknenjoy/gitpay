import PaymentRequestStatusField from './payment-request-status-field'

const meta = {
  title: 'Design Library/Molecules/Tables/Fields/PaymentRequest/PaymentRequestStatusField',
  component: PaymentRequestStatusField,
  args: {
    status: 'open'
  }
}

export const Open = {
  args: {
    status: 'open'
  }
}

export const Paid = {
  args: {
    status: 'paid'
  }
}
