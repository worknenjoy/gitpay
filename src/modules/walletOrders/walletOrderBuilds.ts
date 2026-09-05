import models from '../../models'
import { createOrUpdateCustomer } from '../../mutations/user/customer/createOrUpdateCustomer'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'

const currentModels = models as any

type WalletOrderBuildsParams = {
  walletId: number
  userId: number
  amount: string | number
  [key: string]: any
}

export async function walletOrderBuilds(params: WalletOrderBuildsParams) {
  const wallet =
    params.walletId &&
    (await currentModels.Wallet.findOne({
      where: {
        id: params.walletId
      }
    }))

  const user =
    params.userId &&
    (await currentModels.User.findOne({
      where: {
        id: params.userId
      }
    }))

  if (!user) {
    return new Error({ error: 'No valid User' } as any)
  }

  if (!wallet) {
    return new Error({ error: 'No valid Wallet' } as any)
  }

  const paymentProviderName = getDefaultPaymentProviderName()
  const paymentProvider = getPaymentProvider(paymentProviderName)

  const walletOrder = await currentModels.WalletOrder.create(
    {
      ...params,
      currency: 'usd',
      status: 'pending',
      paid: false
    },
    {
      hooks: true,
      individualHooks: true
    }
  )
  try {
    let userCustomer = user.customer_id
    if (paymentProvider.name === 'stripe' && !userCustomer) {
      const costumer = await createOrUpdateCustomer(user)
      userCustomer = costumer.id
    }

    const amount = parseFloat(String(params.amount))
    const invoice = await paymentProvider.createInvoice({
      purpose: 'wallet_topup',
      amount,
      currency: 'usd',
      customerEmail: user.email,
      customerName: user.name || user.username,
      customerId: userCustomer,
      dueDays: 30,
      description: `Wallet top-up for wallet ${wallet.id}`,
      metadata: {
        wallet_order_id: String(walletOrder.id),
        wallet_id: String(wallet.id),
        user_id: String(user.id),
        purpose: 'wallet_topup'
      }
    })

    const updatedWalletOrder = await currentModels.WalletOrder.update(
      {
        source_id: invoice.invoiceItemId || invoice.invoiceId,
        source_type: 'invoice-item',
        source: invoice.invoiceId,
        status: invoice.status || 'pending',
        provider: paymentProvider.name
      },
      {
        where: {
          id: walletOrder.id
        },
        returning: true
      }
    )

    return updatedWalletOrder[1][0]
  } catch (e) {
    console.log('error on wallet order builds', e)
  }
}
