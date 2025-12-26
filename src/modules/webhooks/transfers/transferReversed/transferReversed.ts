import createStripe from '../../../shared/stripe/stripe'
import { transferReversedPaymentRequest } from './transferReversedPaymentRequest'
import { transferReversedIssue } from './transferReversedIssue'

const stripe = createStripe()

export async function transferReversed(event: any, req: any, res: any) {
  // First try to handle payment request related reversal
  const handledPaymentRequest = await transferReversedPaymentRequest(event, req, res)
  if (handledPaymentRequest) return

  // Fallback to issue/task related reversal
  return transferReversedIssue(event, req, res)
}
