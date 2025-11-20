const stripe = require('../shared/stripe/stripe')()
const models = require('../../models')
const PaymentRequestMail = require('../mail/paymentRequest')

module.exports = async function paymentRequestBuilds(paymentRequestParams) {
  paymentRequestParams.currency = paymentRequestParams.currency || 'usd'
  const { id, userId, title, description, amount, currency, custom_amount } = paymentRequestParams
  const product = await stripe.products.create({
    name: title,
    description: description,
    metadata: {
      payment_request_id: id || null,
      user_id: userId || null
    }
  })

  const finalAmount = amount ? amount * 100 : 0
  const finalPriceData = custom_amount
    ? {
        custom_unit_amount: {
          enabled: true
        }
      }
    : { unit_amount: finalAmount }

  const price = await stripe.prices.create({
    ...finalPriceData,
    currency: currency,
    product: product.id,
    metadata: {
      payment_request_id: id || null,
      user_id: userId || null
    }
  })

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1
      }
    ]
  })

  const createPaymentRequest = await models.PaymentRequest.create({
    ...paymentRequestParams,
    payment_link_id: paymentLink.id,
    payment_url: paymentLink.url,
    currency: currency,
    amount: amount,
    custom_amount: custom_amount || false,
    title: title,
    description: description
  })

  const updatePaymentLink = await stripe.paymentLinks.update(paymentLink.id, {
    metadata: {
      payment_request_id: createPaymentRequest.id,
      user_id: createPaymentRequest.userId
    }
  })

  const paymentRequest = await models.PaymentRequest.findByPk(createPaymentRequest.id, {
    include: [
      {
        model: models.User
      }
    ]
  })

  if (createPaymentRequest?.id) {
    await PaymentRequestMail.paymentRequestInitiated(paymentRequest.User, paymentRequest)
  }

  return createPaymentRequest
}
