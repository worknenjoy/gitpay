import models from '../../models'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'

const currentModels = models as any

type WalletOrderFetchParams = {
  id: number
  userId?: number
}

export async function walletOrderFetch(params: WalletOrderFetchParams) {
  const walletOrder = await currentModels.WalletOrder.findOne({
    where: {
      id: params.id
    },
    include: [currentModels.Wallet]
  })

  if (!walletOrder) {
    const err: any = new Error('No valid wallet order')
    err.status = 404
    throw err
  }

  let wallet = walletOrder.Wallet
  if (!wallet && walletOrder.walletId) {
    wallet = await currentModels.Wallet.findOne({
      where: {
        id: walletOrder.walletId
      }
    })
  }

  if (params.userId && wallet && Number(wallet.userId) !== Number(params.userId)) {
    const err: any = new Error('Unauthorized')
    err.status = 403
    throw err
  }

  const providerName = walletOrder.provider || getDefaultPaymentProviderName()
  const invoice = await getPaymentProvider(providerName).retrieveInvoice(walletOrder.source)

  return {
    ...walletOrder.dataValues,
    invoice
  }
}
