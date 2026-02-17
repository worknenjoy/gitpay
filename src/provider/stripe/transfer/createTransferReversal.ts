import { Stripe } from 'stripe'

import { getStripeClient } from '../client'

export const createTransferReversal = async (
  transferId: string,
  params: Stripe.TransferCreateReversalParams = {}
) => {
  const stripe = getStripeClient()
  return stripe.transfers.createReversal(transferId, params)
}
