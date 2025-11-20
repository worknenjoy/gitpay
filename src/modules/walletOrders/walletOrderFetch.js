const Promise = require('bluebird')
const Decimal = require('decimal.js')
const stripe = require('../shared/stripe/stripe')()
const WalletOrder = require('../../models').WalletOrder

module.exports = Promise.method(async function walletOrderFetch(params) {
  const walletOrder = await WalletOrder.findOne({
    where: {
      id: params.id,
    },
  })

  if (!walletOrder) {
    return { error: 'No valid wallet order' }
  }

  const invoice = await stripe.invoices.retrieve(walletOrder.source)

  return {
    ...walletOrder.dataValues,
    invoice: invoice,
  }
})
