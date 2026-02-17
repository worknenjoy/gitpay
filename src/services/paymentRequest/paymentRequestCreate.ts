import {
  createPaymentRequest,
  type PaymentRequestCreateParams
} from '../../mutations/payment-request/payment-request'

export type { PaymentRequestCreateParams }

export async function paymentRequestCreate(
  paymentRequestParams: PaymentRequestCreateParams
): Promise<any> {
  return createPaymentRequest(paymentRequestParams)
}
