import models from '../../models'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'

const currentModels = models as any

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

  const providerName = walletOrder.provider || getDefaultPaymentProviderName()
  const invoice = await getPaymentProvider(providerName).retrieveInvoice(walletOrder.source)

  return {
    ...walletOrder.dataValues,
    invoice
  }
}
