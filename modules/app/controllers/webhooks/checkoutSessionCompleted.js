/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const models = require('../../../../models/index.js');
const TransferMail = require('../../../mail/transfer.js');

module.exports = async function checkoutSessionCompleted(event, req, res) {
  try {
    const session = event.data.object;
    const { payment_link, payment_status } = session;
    console.log('Checkout session completed:', session);
    if (payment_status === 'paid') {
      const paymentRequest = await models.PaymentRequest.findOne({
        where: {
          payment_link_id: payment_link
        },
        include: [
          {
            model: models.User,
            attributes: ['id', 'email', 'account_id']
          }
        ]
      });
      console.log('Payment Request:', paymentRequest);
      if (!paymentRequest) {
        return res.status(404).json({ error: 'Payment request not found' });
      }
      console.log('Payment Request found:', paymentRequest.id);

      const { amount, currency, User: user = {} } = paymentRequest;
      const { account_id } = user;

      console.log('User account ID:', account_id);

      const paymentRequestUpdate = await paymentRequest.update({
        status: 'paid',
        active: false
      });

      console.log('Payment Request updated:', paymentRequestUpdate);
      
      if (!paymentRequestUpdate) {
        return res.status(500).json({ error: 'Failed to update payment request' });
      }

      console.log('Payment Request Link ID:', payment_link);

      const paymentRequestLinkUpdate = await stripe.paymentLinks.update(payment_link, {
        active: false
      });

      console.log('Payment Request Link updated:', paymentRequestLinkUpdate);

      if (!paymentRequestLinkUpdate) {
        return res.status(500).json({ error: 'Failed to update payment link' });
      }

      console.log('Payment Request amount:', amount);

      const transfer_amount = Math.round(amount * 100 * 0.92); // Convert to cents and round

      const transfer = await stripe.transfers.create({
        amount: transfer_amount, // Convert to cents and round
        currency: currency,
        destination: account_id,
        description: `Payment for service using Payment Request id: ${paymentRequest.id}`,
        metadata: {
          payment_request_id: paymentRequest.id,
          user_id: paymentRequest.User.id
        }
      });

      console.log('Transfer created:', transfer);
      
      if (!transfer) {
        return res.status(500).json({ error: 'Failed to create transfer' });
      }

      console.log('Transfer ID:', transfer.id);

      TransferMail.paymentRequestInitiated(
        user,
        paymentRequest,
        transfer_amount
      )

      console.log('Transfer email sent to user:', user.email);

      const paymentRequestTransferUpdate = await paymentRequest.update({
        transfer_status: 'initiated',
        transfer_id: transfer.id
      });

      console.log('Payment Request transfer status updated:', paymentRequestTransferUpdate);

      if (!paymentRequestTransferUpdate) {
        return res.status(500).json({ error: 'Failed to update payment request transfer status' });
      }

      console.log('Payment Request transfer ID:', paymentRequestTransferUpdate.transfer_id);
      
    }
    return res.json(req.body);
  } catch (error) {
    console.error('Error processing checkout session completed:', error);
    return res.status(500).json({ error: error.message });
  }
}