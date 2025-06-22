/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const models = require('../../../../models/index.js');

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
            model: models.User,
            as: 'user',
            attributes: ['id', 'email', 'account_id']
          },
        ]
      });
      
      if (!paymentRequest) {
        return res.status(404).json({ error: 'Payment request not found' });
      }

      const { amount, currency, user = {} } = paymentRequest;
      const { account_id } = user;

      const paymentRequestUpdate = await paymentRequest.update({
        status: 'paid',
      });
      
      if (!paymentRequestUpdate) {
        return res.status(500).json({ error: 'Failed to update payment request' });
      }

      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100 * 0.92), // Convert to cents and round
        currency: currency,
        destination: account_id,
        description: `Payment for request ${paymentRequest.id}`,
        metadata: {
          payment_request_id: paymentRequest.id,
          user_id: paymentRequest.user.id,
        }
      });

      if (!transfer) {
        return res.status(500).json({ error: 'Failed to create transfer' });
      }
    }
    return res.json(req.body);
  } catch (error) {
    console.error('Error processing checkout session completed:', error);
    return res.status(500).json({ error: error.message });
  }
}