/* eslint-disable no-console */
import PaymentRequestMail from '../../mail/paymentRequest'
import { calculateAmountWithPercent } from '../../utils'

import { processCheckoutSessionCompleted } from '../../mutations/payment-request/checkout-session/processCheckoutSessionCompleted'

type CheckoutSession = {
  payment_status?: string
}

/**
 * Generic Payment Request payment processor.
 * This service is intentionally unaware of webhook HTTP/event wrappers.
 */
export async function processPaymentRequestPaymentFromCheckoutSession(session: any): Promise<void> {
  const paymentStatus = (session as CheckoutSession | null)?.payment_status

  // Keep legacy behavior: only act on successful payments.
  if (paymentStatus !== 'paid') {
    return
  }

  const result = await processCheckoutSessionCompleted(session)

  const { user, paymentRequestPayment, paymentRequest } = result

  try {
    await PaymentRequestMail.paymentMadeForPaymentRequest(user, paymentRequestPayment)
  } catch (error) {
    console.error('Error sending payment made email:', error)
  }

  if (paymentRequest?.send_instructions_email && paymentRequest?.instructions_content) {
    try {
      await PaymentRequestMail.sendConfirmationWithInstructions(paymentRequestPayment)
    } catch (error) {
      console.error('Error sending customer confirmation email with instructions:', error)
    }
  }

  if (result.transferCreated) {
    try {
      await PaymentRequestMail.transferInitiatedForPaymentRequest(
        user,
        paymentRequest,
        result.originalAmountDecimal,
        result.transferAmountDecimal,
        result.balanceTransactionForEmail
          ? {
              extraFee: calculateAmountWithPercent(
                result.balanceTransactionForEmail.amount,
                0,
                'centavos',
                result.currency
              ).decimal,
              total: calculateAmountWithPercent(
                result.resultingBalanceCents,
                0,
                'centavos',
                result.currency
              ).decimal
            }
          : null
      )
    } catch (error) {
      console.error('Error sending transfer initiated email:', error)
    }
  }

  if (result.updatedBalanceTransactionForEmail) {
    PaymentRequestMail.newBalanceTransactionForPaymentRequest(
      user,
      paymentRequestPayment,
      result.updatedBalanceTransactionForEmail
    ).catch((mailError: any) => {
      console.error(
        `Failed to send email for Payment Request Balance Transaction: ${result.updatedBalanceTransactionForEmail.id}`,
        mailError
      )
    })
  }
}
