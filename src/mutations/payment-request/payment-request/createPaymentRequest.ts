import { Transaction } from 'sequelize'
import Models from '../../../models'
import {
  createPaymentRequestStripeResources,
  deactivatePaymentRequestStripeResources,
  updatePaymentRequestPaymentLinkMetadata
} from '../../provider/stripe/payment-request'
import { sanitizePaymentRequestInstructionsContent } from '../../../utils/sanitize/paymentRequestInstructions'

const models = Models as any

export type PaymentRequestCreateParams = {
  id?: number | string
  userId?: number | string
  title: string
  description?: string
  amount?: number
  currency?: string
  custom_amount?: boolean
  send_instructions_email?: boolean
  instructions_content?: string
}

export async function createPaymentRequest(
  paymentRequestParams: PaymentRequestCreateParams,
  tx?: Transaction
): Promise<any> {
  const {
    id,
    userId,
    title,
    description,
    amount,
    currency: currencyParam,
    custom_amount,
    send_instructions_email,
    instructions_content
  } = paymentRequestParams

  const currency = currencyParam ?? 'usd'

  const sanitizedInstructionsContent = sanitizePaymentRequestInstructionsContent(
    instructions_content,
    {
      lengthMode: 'throw'
    }
  )

  const run = async (transaction: Transaction) => {
    const resources: any = {}

    try {
      const createdResources = await createPaymentRequestStripeResources({
        title,
        description,
        currency,
        amount,
        custom_amount,
        metadata: {
          payment_request_id: id ?? null,
          user_id: userId ?? null
        }
      })

      const { productId, priceId, paymentLinkId, paymentUrl } = createdResources

      resources.productId = productId
      resources.priceId = priceId
      resources.paymentLinkId = paymentLinkId
      resources.paymentUrl = paymentUrl

      const createPaymentRequest = await models.PaymentRequest.create(
        {
          ...paymentRequestParams,
          payment_link_id: paymentLinkId,
          payment_url: paymentUrl,
          currency,
          amount,
          custom_amount: custom_amount ?? false,
          send_instructions_email: send_instructions_email ?? false,
          instructions_content: sanitizedInstructionsContent,
          title,
          description
        },
        { transaction }
      )

      await updatePaymentRequestPaymentLinkMetadata(paymentLinkId, {
        payment_request_id: createPaymentRequest.id,
        user_id: createPaymentRequest.userId
      })

      return createPaymentRequest
    } catch (error) {
      await deactivatePaymentRequestStripeResources(resources)
      throw error
    }
  }

  if (tx) {
    return run(tx)
  }

  return models.sequelize.transaction(async (transaction: Transaction) => run(transaction))
}
