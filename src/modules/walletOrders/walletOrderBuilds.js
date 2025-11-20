const Promise = require('bluebird')
const Decimal = require('decimal.js')
const stripe = require('../shared/stripe/stripe')()
const WalletOrder = require('../../models').WalletOrder
const Wallet = require('../../models').Wallet
const User = require('../../models').User
const { createOrUpdateCustomer } = require('../util/customer')

module.exports = Promise.method(async function walletOrderBuilds(params) {
  const wallet =
    params.walletId &&
    (await Wallet.findOne({
      where: {
        id: params.walletId
      }
    }))

  const user =
    params.userId &&
    (await User.findOne({
      where: {
        id: params.userId
      }
    }))

  if (!user) {
    return new Error({ error: 'No valid User' })
  }

  if (!wallet) {
    return new Error({ error: 'No valid Wallet' })
  }

  const walletOrder = await WalletOrder.create(
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
    const invoice = await stripe.invoices.create({
      customer: userCustomer,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: {
        wallet_order_id: walletOrder.id
      }
    })

    const invoiceItem = await stripe.invoiceItems.create({
      customer: userCustomer,
      currency: 'usd',
      quantity: 1,
      unit_amount: Math.round(parseFloat(params.amount) * 100),
      invoice: invoice.id,
      metadata: {
        wallet_order_id: walletOrder.id
      }
    })

    const finalizeInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
    //console.log('finalized invoice', finalizeInvoice)

    const updatedWalletOrder = await WalletOrder.update(
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
})
