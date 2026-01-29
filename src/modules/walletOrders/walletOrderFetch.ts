import Decimal from 'decimal.js'
import stripe from '../shared/stripe/stripe'
import models from '../../models'

const currentModels = models as any
const stripeInstance = stripe()

type WalletOrderFetchParams = {
  id: number
}

export async function walletOrderFetch(params: WalletOrderFetchParams) {
  const walletOrder = await currentModels.WalletOrder.findOne({
    where: {
      id: params.id
    }
  })

  if (!walletOrder) {
    return { error: 'No valid wallet order' }
  }

  const invoice = await stripeInstance.invoices.retrieve(walletOrder.source)

  return {
    ...walletOrder.dataValues,
    invoice: invoice
  }
}
