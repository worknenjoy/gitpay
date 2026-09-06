export const PaymentRequestPaymentStatus = {
  CANCELED: 'canceled',
  FAILED: 'failed',
  NO_PAYMENT_REQUIRED: 'no_payment_required',
  PAID: 'paid',
  PROCESSING: 'processing',
  REFUNDED: 'refunded',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CAPTURE: 'requires_capture',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  SUCCEEDED: 'succeeded'
} as const

export type PaymentRequestPaymentStatusValue =
  (typeof PaymentRequestPaymentStatus)[keyof typeof PaymentRequestPaymentStatus]

export type PaymentRequestPayment = {
  id: number
  amount: string | number
  createdAt: string | Date
  status: PaymentRequestPaymentStatusValue
  PaymentRequest?: {
    title?: string
  }
  PaymentRequestCustomer?: {
    email?: string
  }
}
