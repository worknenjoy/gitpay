const Stripe = require('stripe')
const models = require('../../models');

module.exports = async function paymentRequestBuilds(paymentRequestParams) {
  const paymentReqquestList = await models.PaymentRequest.findAll({
    where: {
      userId: paymentRequestParams.userId
    },
    order: [['createdAt', 'DESC']],
    include: [{
      model: models.User
    }]
  });
  return paymentReqquestList
};