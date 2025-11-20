const stripe = require('../shared/stripe/stripe')()
const Models = require('../../models')

const models = Models as any

module.exports = async function paymentRequestUpdate(paymentRequestParams: any) {
  const paymentRequest = await models.PaymentRequest.findByPk(paymentRequestParams.id)
  if (!paymentRequest) {
    throw new Error('Payment Request not found')
  }

  const paymentRequestUpdate = await paymentRequest.update(paymentRequestParams)

  if (!paymentRequestUpdate) {
    throw new Error('Payment Request could not be updated')
  }
  const stripePaymentLinkActiveUpdate = await stripe.paymentLinks.update(
    paymentRequestUpdate.payment_link_id,
    {
      active: paymentRequestUpdate.active,
    },
  )

  if (!stripePaymentLinkActiveUpdate) {
    throw new Error('Stripe Payment Link could not be updated')
  }

  const paymentLinkLineItems = await stripe.paymentLinks.listLineItems(
    paymentRequestUpdate.payment_link_id,
    { limit: 1 },
  )

  if (!paymentLinkLineItems || paymentLinkLineItems.data.length === 0) {
    throw new Error('No line items found for the Stripe Payment Link')
  }

  const productItemId = paymentLinkLineItems.data[0]?.price.product

  const stripeProductUpdate = await stripe.products.update(productItemId, {
    name: paymentRequestUpdate.title,
    description: paymentRequestUpdate.description,
  })

  if (!stripeProductUpdate) {
    throw new Error('Stripe Product could not be updated')
  }

  return paymentRequestUpdate
}
