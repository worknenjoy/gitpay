import { updatePaymentRequest } from '../../mutations/payment-request/payment-request'

export async function paymentRequestUpdate(paymentRequestParams: any) {
  return updatePaymentRequest(paymentRequestParams)
}
