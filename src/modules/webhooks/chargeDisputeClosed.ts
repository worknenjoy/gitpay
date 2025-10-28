/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
import Stripe from '../shared/stripe/stripe'
import Models from '../../models'

const stripe = Stripe()
const models = (Models as any);

export const chargeDisputeClosedWebhookHandler = async (event: any, req: any, res: any) => {
  // Handle the charge.dispute.closed event
  const { id, object, data } = event;

  console.log(`Handling charge.dispute.closed for Dispute ID: ${data.object.id}`);

  try {
    const paymentRequestPayment = await models.PaymentRequestPayment.findOne({
      where: {
        source: data.object.payment_intent
      }
    });

    const userId = paymentRequestPayment.userId;

    const paymentRequestBalance = await models.PaymentRequestBalance.findOrCreate({
      where: {
        userId
      }
    });

    const paymentRequestBalanceTransactionForDisputeFee = await models.PaymentRequestBalanceTransaction.create({
      paymentRequestBalanceId: paymentRequestBalance[0].id,
      amount: data.object.balance_transactions[0].net,
      type: 'DEBIT',
      reason: 'DISPUTE'
    });

    return res.json(req.body);
  } catch (error) {
    console.error(`Error handling charge.dispute.closed for Dispute ID: ${data.object.id}`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
