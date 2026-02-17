import { Stripe } from 'stripe'

import { getStripeClient } from '../client'

export const createTransfer = async (params: Stripe.TransferCreateParams) => {
  const stripe = getStripeClient()
  return stripe.transfers.create(params)
}
