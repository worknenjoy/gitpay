/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const stripe = require('../shared/stripe/stripe')()
const models = require('../../models')
const { handleAmount } = require('../util/handle-amount/handle-amount')
const PaymentRequestMail = require('../mail/paymentRequest');

module.exports = async function checkoutSessionCompleted(event, req, res) {
  try {
    const session = event.data.object;
    const { payment_link, payment_status } = session;
    if (payment_status === 'paid') {
      const paymentRequest = await models.PaymentRequest.findOne({
        where: {
          payment_link_id: payment_link
        },
        include: [
          {
            model: models.User
          }
        ]
      });

      if (!paymentRequest) {
        return res.status(404).json({ error: 'Payment request not found' });
      }

      const { amount, currency, deactivate_after_payment, User: user = {} } = paymentRequest;
      const { account_id } = user;

      const paymentRequestUpdate = await paymentRequest.update({
        status: 'paid',
        active: deactivate_after_payment ? false : true
      });

      if (!paymentRequestUpdate) {
        return res.status(500).json({ error: 'Failed to update payment request' });
      }

      if (deactivate_after_payment) {
        const paymentRequestLinkUpdate = await stripe.paymentLinks.update(payment_link, {
          active: false
        });

        if (!paymentRequestLinkUpdate) {
          return res.status(500).json({ error: 'Failed to update payment link' });
        }
      }
      const amountAfterFee = handleAmount(paymentRequest.amount, 8, 'decimal');
      const transfer_amount = amountAfterFee.decimal;
      const transfer_amount_cents = amountAfterFee.centavos;

      const transfer = await stripe.transfers.create({
        amount: transfer_amount_cents,
        currency: currency,
        destination: account_id,
        description: `Payment for service using Payment Request id: ${paymentRequest.id}`,
        metadata: {
          payment_request_id: paymentRequest.id,
          user_id: paymentRequest.User.id
        }
      });
      
      if (!transfer) {
        return res.status(500).json({ error: 'Failed to create transfer' });
      }
      await PaymentRequestMail.transferInitiatedForPaymentRequest(
        user,
        paymentRequest,
        transfer_amount
      );

      const paymentRequestTransferUpdate = await paymentRequest.update({
        transfer_status: 'initiated',
        transfer_id: transfer.id
      });

      if (!paymentRequestTransferUpdate) {
        return res.status(500).json({ error: 'Failed to update payment request transfer status' });
      }
      
    }
    return res.json(req.body);
  } catch (error) {
    console.error('Error processing checkout session completed:', error);
    return res.status(500).json({ error: error.message });
  }
}