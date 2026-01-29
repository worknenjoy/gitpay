/* eslint-disable no-console */
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import { withDrawnDisputeForPaymentRequest } from '../../../../services/payments/disputes/disputeService'

export const chargeDisputeFundsWithdrawnWebhookHandler = async (event: any, req: any, res: any) => {
  const { data } = event || {}
  const { object } = data || {}
  const { id, payment_intent, amount, balance_transactions, reason, status, created } = object || {}

  try {
    await withDrawnDisputeForPaymentRequest({
      source_id: payment_intent,
      dispute_id: id,
      amount: amount,
      fee: balance_transactions[0].fee,
      reason,
      status,
      closedAt: new Date(created * 1000)
    })

    return res.json(req.body)
  } catch (error) {
    console.error(`Error handling charge.dispute.funds_withdrawn for Dispute ID: ${id}`, error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
