import { Transaction } from 'sequelize'
import Models from '../../../models'
import {
  createPaymentRequestStripeResources,
  deactivatePaymentRequestStripeResources,
  updatePaymentRequestPaymentLinkMetadata
} from '../../../provider/stripe/payment-request'

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
  const currency = paymentRequestParams.currency ?? 'usd'

  const run = async (transaction: Transaction) => {
    const resources: any = {}

    try {
      const createdResources = await createPaymentRequestStripeResources({
        title: paymentRequestParams.title,
        description: paymentRequestParams.description,
        currency,
        amount: paymentRequestParams.amount,
        custom_amount: paymentRequestParams.custom_amount,
        metadata: {
          payment_request_id: paymentRequestParams.id ?? null,
          user_id: paymentRequestParams.userId ?? null
        }
      })

      resources.productId = createdResources.productId
      resources.priceId = createdResources.priceId
      resources.paymentLinkId = createdResources.paymentLinkId
      resources.paymentUrl = createdResources.paymentUrl

      const createPaymentRequest = await models.PaymentRequest.create(
        {
          ...paymentRequestParams,
          payment_link_id: createdResources.paymentLinkId,
          payment_url: createdResources.paymentUrl,
          currency,
          amount: paymentRequestParams.amount,
          custom_amount: paymentRequestParams.custom_amount ?? false,
          send_instructions_email: paymentRequestParams.send_instructions_email ?? false,
          instructions_content: paymentRequestParams.instructions_content ?? null,
          title: paymentRequestParams.title,
          description: paymentRequestParams.description
        },
        { transaction }
      )

      await updatePaymentRequestPaymentLinkMetadata(createdResources.paymentLinkId, {
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
