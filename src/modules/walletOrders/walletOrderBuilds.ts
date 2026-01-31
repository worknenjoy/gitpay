import stripe from '../../shared/stripe/stripe'
import models from '../../models'
import { createOrUpdateCustomer } from '../util/customer'

const currentModels = models as any
const stripeInstance = stripe()

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
    if (!userCustomer) {
      const costumer = await createOrUpdateCustomer(user)
      userCustomer = costumer.id
    }
    const invoice = await stripeInstance.invoices.create({
      customer: userCustomer,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: {
        wallet_order_id: walletOrder.id
      }
    })

    const invoiceItem = await stripeInstance.invoiceItems.create({
      customer: userCustomer,
      currency: 'usd',
      quantity: 1,
      unit_amount: Math.round(parseFloat(params.amount as string) * 100),
      invoice: invoice.id,
      metadata: {
        wallet_order_id: walletOrder.id
      }
    })

    const finalizeInvoice = await stripeInstance.invoices.finalizeInvoice(invoice.id)
    //console.log('finalized invoice', finalizeInvoice)

    const updatedWalletOrder = await currentModels.WalletOrder.update(
      {
        source_id: invoiceItem.id,
        source_type: 'invoice-item',
        source: invoice.id,
        status: finalizeInvoice.status || invoice.status
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
