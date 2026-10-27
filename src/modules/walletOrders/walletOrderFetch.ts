import models from '../../models'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'

const currentModels = models as any

type WalletOrderFetchParams = {
  id: number
  userId: number
}

export async function walletOrderFetch(params: WalletOrderFetchParams) {
  const walletOrder = await currentModels.WalletOrder.findOne({
    where: {
      id: params.id
    },
    include: {
      association: 'Wallet',
      required: true,
      where: { userId: params.userId }
    }
  })

  if (!walletOrder) {
    return false
  }

  const providerName = walletOrder.provider || getDefaultPaymentProviderName()
  const invoice = await getPaymentProvider(providerName).retrieveInvoice(walletOrder.source)

  const walletOrderValues = { ...walletOrder.dataValues }
  delete walletOrderValues.Wallet

  return {
    ...walletOrderValues,
    invoice
  }
}
