import { transferCreatedIssue } from './transferCreatedIssue'
import { transferCreatedPaymentRequest } from './transferCreatedPaymentRequest'

export async function transferCreated(event: any, req: any, res: any) {
  const metadata = event.data.object.metadata || {}
  const { payment_request_id: paymentRequestId, user_id: userId } = metadata

  if (paymentRequestId) {
    return transferCreatedPaymentRequest(event, req, res)
  }

  return transferCreatedIssue(event, req, res)
}
