const Stripe = require('stripe')
const models = require('../../models')

module.exports = async function paymentRequestList(paymentRequestParams) {
  const paymentRequestList = await models.PaymentRequest.findAll({
    where: {
      userId: paymentRequestParams.userId,
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: models.User,
      },
    ],
  })
  return paymentRequestList
}
