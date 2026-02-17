import { Stripe } from 'stripe'

import { createTransfer as providerCreateTransfer } from '../../../../provider/stripe/transfer'

export const createTransfer = async (params: Stripe.TransferCreateParams) => {
  return providerCreateTransfer(params)
}
