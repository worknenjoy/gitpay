import { Stripe } from 'stripe'

import { createTransferReversal as providerCreateTransferReversal } from '../../../../provider/stripe/transfer'

export const createTransferReversal = async (
  transferId: string,
  params: Stripe.TransferCreateReversalParams = {}
) => {
  return providerCreateTransferReversal(transferId, params)
}
