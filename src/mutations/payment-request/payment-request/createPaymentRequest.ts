import { Transaction } from 'sequelize'
import Models from '../../../models'
import { getPaymentProvider } from '../../../providers'
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
  /** Optional override; defaults to PAYMENT_PROVIDER env */
  provider?: string
  listed_on_profile?: boolean
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
    instructions_content,
    provider: providerName,
    listed_on_profile
  } = paymentRequestParams

  const currency = currencyParam ?? 'usd'
  const paymentProvider = getPaymentProvider(providerName)

  const sanitizedInstructionsContent = sanitizePaymentRequestInstructionsContent(
    instructions_content,
    {
      lengthMode: 'throw'
    }
  )

  // Whop-only: every new payment request is a direct charge on the seller's connected
  // company, so Whop (not the platform) is merchant of record for disputes/refunds — see
  // docs/payments-providers.md. This isn't a client-supplied option: the create form's
  // toggle is locked, so the decision is made here unconditionally. Stripe is untouched.
  let connectedAccountId: string | undefined
  const directCharge = paymentProvider.name === 'whop'
  if (directCharge) {
    const user = await models.User.scope('withSensitive').findByPk(userId)
    connectedAccountId = user?.whop_account_id || undefined
    if (!connectedAccountId) {
      const err: any = new Error(
        'Connect your Whop account in Payout Settings before creating a payment request'
      )
      err.StatusCodeError = 422
      throw err
    }
  }

  const run = async (transaction: Transaction) => {
    const resources: any = {}

    try {
      const createdResources = await paymentProvider.createPaymentRequestResources({
        title,
        description,
        currency,
        amount,
        custom_amount,
        directCharge,
        connectedAccountId,
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
          provider: paymentProvider.name,
          direct_charge: directCharge,
          payment_link_id: paymentLinkId,
          payment_url: paymentUrl,
          currency,
          amount,
          custom_amount: custom_amount ?? false,
          send_instructions_email: send_instructions_email ?? false,
          instructions_content: sanitizedInstructionsContent,
          listed_on_profile: listed_on_profile ?? false,
          title,
          description
        },
        { transaction }
      )

      await paymentProvider.updatePaymentRequestPaymentLinkMetadata(paymentLinkId, {
        payment_request_id: createPaymentRequest.id,
        user_id: createPaymentRequest.userId
      })

      const finalized = await paymentProvider.finalizePaymentRequestResources({
        paymentLinkId,
        paymentRequestId: createPaymentRequest.id,
        custom_amount: custom_amount ?? false
      })

      if (finalized?.paymentUrl) {
        await createPaymentRequest.update({ payment_url: finalized.paymentUrl }, { transaction })
      }

      return createPaymentRequest
    } catch (error) {
      await paymentProvider.deactivatePaymentRequestResources(resources)
      throw error
    }
  }

  if (tx) {
    return run(tx)
  }

  return models.sequelize.transaction(async (transaction: Transaction) => run(transaction))
}
