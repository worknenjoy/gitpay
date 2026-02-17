import {
  createPaymentRequest,
  type PaymentRequestCreateParams
} from '../../mutations/payment-request/payment-request'
import { findPaymentRequest } from '../../queries/payment-request/payment-request'
import PaymentRequestMail from '../../mail/paymentRequest'

export async function paymentRequestBuilds(
  paymentRequestParams: PaymentRequestCreateParams
): Promise<any> {
  const created = await createPaymentRequest(paymentRequestParams)

  if (created?.id) {
    const paymentRequest = await findPaymentRequest(created.id)
    if (paymentRequest?.User) {
      await PaymentRequestMail.paymentRequestInitiated(paymentRequest.User, paymentRequest)
    }
  }

  return created
}
