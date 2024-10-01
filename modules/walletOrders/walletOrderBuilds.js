
const Promise = require('bluebird')
const Decimal = require('decimal.js')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const WalletOrder = require('../../models').WalletOrder
const Wallet = require('../../models').Wallet
const User = require('../../models').User


module.exports = Promise.method(async function walletOrderBuilds(params) {
  const user = params.userId && await User.findOne({
    where: {
      id: params.userId
    }
  })

  if (!user) {
    return { error: 'No valid user' }
  }

  const walletOrder = await WalletOrder.create({
    ...params,
    status: 'pending',
    userId: user.id,
  })
  try {
    const invoice = await stripe.invoices.create({
      customer: user.customer_id,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: {
        'wallet_order_id': walletOrder.id
      },
    })
    //console.log('invoice', invoice)
  

    const invoiceItem = await stripe.invoiceItems.create({
      customer: user.customer_id,
      currency: 'usd',
      quantity: 1,
      unit_amount: (parseInt(params.amount) * 100).toFixed(0),
      invoice: invoice.id,
      metadata: {
        'wallet_order_id': walletOrder.id
      },
    })

    const finalizeInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
    //console.log('finalized invoice', finalizeInvoice)

    const updatedWalletOrder = await WalletOrder.update({
      source_id: invoiceItem.id,
      source_type: 'invoice-item',
      status: invoice.status
    }, {
      where: {
        id: walletOrder.id
      },
      returning: true
    })

    return updatedWalletOrder[1][0]
  } catch(e) {
    console.log('error on wallet order builds', e)
  }
  
})