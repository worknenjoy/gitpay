import models from '../../models'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'

const currentModels = models as any

type WalletOrderFetchParams = {
  id: number
  userId?: number
}

export async function walletOrderFetch(params: WalletOrderFetchParams) {
  const include: any = []
  if (params.userId) {
    include.push({
      model: currentModels.Wallet,
      where: { userId: params.userId },
      required: true
    })
  }

  const walletOrder = await currentModels.WalletOrder.findOne({
    where: {
      id: params.id
    },
    include: include.length > 0 ? include : undefined
  })

  if (!walletOrder) {
    return { error: 'No valid wallet order' }
  }

  const providerName = walletOrder.provider || getDefaultPaymentProviderName()
  const invoice = await getPaymentProvider(providerName).retrieveInvoice(walletOrder.source)

  return {
    ...walletOrder.dataValues,
    invoice
  }
}
