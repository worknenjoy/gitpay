const stripe = require('../shared/stripe/stripe')()
const models = require('../../models');
const PaymentRequestMail = require('../mail/paymentRequest');

module.exports = async function paymentRequestBuilds(paymentRequestParams) {
  paymentRequestParams.currency = paymentRequestParams.currency || 'usd';
  const product = await stripe.products.create({
    name: paymentRequestParams.title,
    description: paymentRequestParams.description,
    metadata: {
      payment_request_id: paymentRequestParams.id || null,
      user_id: paymentRequestParams.userId || null
    }
  });

  const price = await stripe.prices.create({
    unit_amount: paymentRequestParams.amount * 100, // Stripe expects amount in cents
    currency: paymentRequestParams.currency,
    product: product.id,
    metadata: {
      payment_request_id: paymentRequestParams.id || null,
      user_id: paymentRequestParams.userId || null
    }
  });

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price: price.id,
      quantity: 1
    }]
  });

  const createPaymentRequest = await models.PaymentRequest.create({
    ...paymentRequestParams,
    payment_link_id: paymentLink.id,
    payment_url: paymentLink.url,
    currency: paymentRequestParams.currency,
    amount: paymentRequestParams.amount,
    title: paymentRequestParams.title,
    description: paymentRequestParams.description
  });
  
  const updatePaymentLink = await stripe.paymentLinks.update(paymentLink.id, {
    metadata: {
      payment_request_id: createPaymentRequest.id,
      user_id: createPaymentRequest.userId
    }
  });

  const paymentRequest = await models.PaymentRequest.findByPk(createPaymentRequest.id, {
    include: [
      {
        model: models.User
      }
    ]
  });

  if(createPaymentRequest?.id) {
    await PaymentRequestMail.paymentRequestInitiated(
      paymentRequest.User,
      paymentRequest
    );
  }

  return createPaymentRequest;
}
