import models from '../../models'

const currentModels = models as any

type WalletUpdateParams = {
  userId: number
  id: number
  name: string
}

export async function walletUpdate(params: WalletUpdateParams) {
  const { name, id } = params
  const wallet = await currentModels.Wallet.update(
    {
      name: name
    },
    {
      where: {
        id,
        userId: params.userId
      },
      returning: true
    }
  )

  if (!wallet[1].length) {
    throw new Error('wallet.not_found')
  }

  return wallet[1][0].dataValues
}
