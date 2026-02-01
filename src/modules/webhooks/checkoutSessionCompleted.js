/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const stripe = require('../../client/payment/stripe').default()
const models = require('../../models')
const { handleAmount } = require('../util/handle-amount/handle-amount')
const PaymentRequestMail = require('../mail/paymentRequest')

module.exports = async function checkoutSessionCompleted(event, req, res) {
  try {
    const session = event.data.object
    const { payment_link, payment_status, amount_total, payment_intent, customer_details } = session
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
      })

      if (!paymentRequest) {
        return res.status(404).json({ error: 'Payment request not found' })
      }

      const {
        amount,
        custom_amount,
        currency,
        deactivate_after_payment,
        User: user = {}
      } = paymentRequest
      const { account_id } = user

      const paymentRequestUpdate = await paymentRequest.update({
        status: 'paid',
        active: deactivate_after_payment ? false : true
      })

      if (!paymentRequestUpdate) {
        return res.status(500).json({ error: 'Failed to update payment request' })
      }

      if (deactivate_after_payment) {
        const paymentRequestLinkUpdate = await stripe.paymentLinks.update(payment_link, {
          active: false
        })

        if (!paymentRequestLinkUpdate) {
          return res.status(500).json({ error: 'Failed to update payment link' })
        }
      }
      const originalAmount = handleAmount(amount_total, 0, 'centavos', currency)
      const amountAfterFee = custom_amount
        ? handleAmount(amount_total, 8, 'centavos', currency)
        : handleAmount(amount, 8, 'decimal', currency)
      const transfer_amount = amountAfterFee.decimal
      const transfer_amount_cents = amountAfterFee.centavos

      const customer = await models.PaymentRequestCustomer.create({
        name: customer_details.name,
        email: customer_details.email,
        userId: paymentRequest.userId,
        sourceId: 'gcc_' + Math.random().toString(36).substring(2, 15) // Generating a random source ID
      })

      const paymentRequestPayment = await models.PaymentRequestPayment.create({
        paymentRequestId: paymentRequest.id,
        userId: paymentRequest.userId,
        amount: originalAmount.decimal,
        currency,
        source: payment_intent,
        status: payment_status,
        customerId: customer.id
      })

      await paymentRequestPayment.reload({
        include: [
          { model: models.PaymentRequest },
          { model: models.User },
          { model: models.PaymentRequestCustomer } // adjust alias if different
        ]
      })

      if (!paymentRequestPayment) {
        return res.status(500).json({ error: 'Failed to create payment request payment record' })
      }

      const paymentIntent = await stripe.paymentIntents.update(payment_intent, {
        metadata: {
          payment_request_payment_id: paymentRequestPayment.id,
          payment_request_id: paymentRequest.id,
          user_id: paymentRequest.userId
        }
      })

      if (!paymentIntent) {
        return res.status(500).json({ error: 'Failed to retrieve payment intent' })
      }

      try {
        await PaymentRequestMail.paymentMadeForPaymentRequest(user, paymentRequestPayment)
      } catch (error) {
        console.error('Error sending payment made email:', error)
      }

      const paymentRequestBalance = await models.PaymentRequestBalance.findOrCreate({
        where: {
          userId: paymentRequest.userId
        }
      })

      if (!paymentRequestBalance) {
        return res.status(500).json({ error: 'Failed to find or create payment request balance' })
      }

      const currentPaymentRequestBalance = paymentRequestBalance[0]
      const previousBalance = parseInt(currentPaymentRequestBalance.balance)
      const creditAmount = transfer_amount_cents
      const resultingBalance = creditAmount + previousBalance
      let paymentRequestBalanceTransaction
      if (resultingBalance <= 0) {
        paymentRequestBalanceTransaction = await models.PaymentRequestBalanceTransaction.create({
          paymentRequestBalanceId: currentPaymentRequestBalance.id,
          amount: creditAmount,
          type: 'CREDIT',
          reason: 'ADJUSTMENT',
          reason_details: 'payment_request_payment_applied',
          status: 'completed'
        })
      }
      if (resultingBalance > 0) {
        if (previousBalance < 0) {
          paymentRequestBalanceTransaction = await models.PaymentRequestBalanceTransaction.create({
            paymentRequestBalanceId: currentPaymentRequestBalance.id,
            amount: previousBalance * -1,
            type: 'CREDIT',
            reason: 'ADJUSTMENT',
            reason_details: 'payment_request_payment_applied',
            status: 'completed'
          })
        }
        const transfer = await stripe.transfers.create({
          amount: resultingBalance,
          currency: currency,
          destination: account_id,
          description: `Payment for service using Payment Request id: ${paymentRequest.id} and Payment Request Payment id: ${paymentRequestPayment.id}`,
          metadata: {
            user_id: paymentRequest.userId,
            payment_request_id: paymentRequest.id,
            payment_request_payment_id: paymentRequestPayment.id
          },
          transfer_group: `payment_request_payment_${paymentRequestPayment.id}`
        })

        if (!transfer) {
          return res.status(500).json({ error: 'Failed to create transfer' })
        }

        const paymentRequestTransferUpdate = await paymentRequest.update({
          transfer_status: 'initiated',
          transfer_id: transfer.id
        })

        if (!paymentRequestTransferUpdate) {
          return res.status(500).json({ error: 'Failed to update payment request transfer status' })
        }

        try {
          await PaymentRequestMail.transferInitiatedForPaymentRequest(
            user,
            paymentRequest,
            originalAmount.decimal,
            transfer_amount,
            paymentRequestBalanceTransaction
              ? {
                  extraFee: handleAmount(
                    paymentRequestBalanceTransaction.amount,
                    0,
                    'centavos',
                    currency
                  ).decimal,
                  total: handleAmount(resultingBalance, 0, 'centavos', currency).decimal
                }
              : null
          )
        } catch (error) {
          console.error('Error sending transfer initiated email:', error)
        }
      }
      if (previousBalance < 0) {
        const updatedBalanceTransaction = await models.PaymentRequestBalanceTransaction.findByPk(
          paymentRequestBalanceTransaction.id,
          { include: [models.PaymentRequestBalance] }
        )
        PaymentRequestMail.newBalanceTransactionForPaymentRequest(
          user,
          paymentRequestPayment,
          updatedBalanceTransaction
        ).catch((mailError) => {
          console.error(
            `Failed to send email for Payment Request Balance Transaction: ${updatedBalanceTransaction.id}`,
            mailError
          )
        })
      }
    }
    return res.json(req.body)
  } catch (error) {
    console.error('Error processing checkout session completed:', error)
    return res.status(500).json({ error: error.message })
  }
}
