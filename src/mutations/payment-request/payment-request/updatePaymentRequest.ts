import { Transaction } from 'sequelize'
import Models from '../../../models'
import { findPaymentRequestById } from '../../../queries/payment-request/payment-request'
import { getPaymentProvider } from '../../../providers'

const models = Models as any

type PaymentRequestUpdateParams = {
  id: number | string
  title?: string
  description?: string
  active?: boolean
  [key: string]: any
}

/**
 * Update a payment request in the DB and sync title/description/active to the
 * provider that owns the checkout resource (Stripe Payment Link or Whop Plan).
 * Uses PaymentRequests.provider — not the global PAYMENT_PROVIDER env.
 */
export async function updatePaymentRequest(
  paymentRequestParams: PaymentRequestUpdateParams,
  tx?: Transaction
): Promise<any> {
  const run = async (transaction: Transaction) => {
    const paymentRequest = await findPaymentRequestById(paymentRequestParams.id, { transaction })
    if (!paymentRequest) {
      throw new Error('Payment Request not found')
    }

    const previousActive = !!paymentRequest.active
    const previousTitle = paymentRequest.title
    const previousDescription = paymentRequest.description

    const paymentLinkId: string | undefined = paymentRequest.payment_link_id
    if (!paymentLinkId) {
      throw new Error('Payment Request missing payment_link_id')
    }

    const paymentProvider = getPaymentProvider(paymentRequest.provider || undefined)

    // Only pass mutable domain fields to the DB update (ignore provider, ids, etc.)
    const { id: _id, ...updateFields } = paymentRequestParams

    const paymentRequestUpdated = await paymentRequest.update(updateFields, {
      transaction
    })

    if (!paymentRequestUpdated) {
      throw new Error('Payment Request could not be updated')
    }

    const detailsChanged =
      typeof paymentRequestParams.active === 'boolean' ||
      paymentRequestParams.title !== undefined ||
      paymentRequestParams.description !== undefined

    if (!detailsChanged) {
      return paymentRequestUpdated
    }

    try {
      await paymentProvider.updatePaymentRequestDetails({
        paymentLinkId,
        active:
          typeof paymentRequestParams.active === 'boolean'
            ? !!paymentRequestUpdated.active
            : undefined,
        title:
          paymentRequestParams.title !== undefined
            ? paymentRequestUpdated.title
            : undefined,
        description:
          paymentRequestParams.description !== undefined
            ? paymentRequestUpdated.description ?? null
            : undefined
      })
    } catch (error) {
      // Best-effort provider rollback; DB rolls back via transaction throw
      try {
        await paymentProvider.updatePaymentRequestDetails({
          paymentLinkId,
          active: previousActive,
          title: previousTitle,
          description: previousDescription ?? null
        })
      } catch {
        // swallow rollback errors
      }
      throw error
    }

    return paymentRequestUpdated
  }

  if (tx) {
    return run(tx)
  }

  return models.sequelize.transaction(async (transaction: Transaction) => run(transaction))
}
