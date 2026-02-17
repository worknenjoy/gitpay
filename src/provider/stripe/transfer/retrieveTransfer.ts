import { getStripeClient } from '../client'

export const retrieveTransfer = async (transferId: string) => {
  const stripe = getStripeClient()
  return stripe.transfers.retrieve(transferId)
}
