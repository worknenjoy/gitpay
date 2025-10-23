const stripe = require('../shared/stripe/stripe')();
const models = require('../../models');

module.exports = async function paymentRequestUpdate(paymentRequestParams) {
  const paymentRequest = await models.PaymentRequest.findByPk(paymentRequestParams.id);
  if (!paymentRequest) {
    throw new Error('Payment Request not found');
  }

  const paymentRequestUpdate = await paymentRequest.update(paymentRequestParams);
  
  if( !paymentRequestUpdate ) {
    throw new Error('Payment Request could not be updated');
  }
  stripe.paymentLinks.update(paymentRequestUpdate.payment_link_id, {
    active: paymentRequestUpdate.active
  });
  return paymentRequestUpdate;
};