import { Transaction } from 'sequelize'
import Models from '../../../models'
import { findPaymentRequestById } from '../../../queries/payment-request/payment-request'
import { listPaymentLinkLineItems } from '../../../queries/provider/stripe/payment-link'
import {
  updatePaymentRequestPaymentLinkActive,
  updatePaymentRequestProductDetails
} from '../../provider/stripe/payment-request'

const models = Models as any

type PaymentRequestUpdateParams = {
  id: number | string
  title?: string
  description?: string
  active?: boolean
  [key: string]: any
}

function getStripeProductIdFromLineItem(lineItem: any): string | null {
  const product = lineItem?.price?.product
  if (!product) return null
  if (typeof product === 'string') return product
  if (typeof product === 'object' && product.id) return product.id
  return null
}

export async function updatePaymentRequest(
  paymentRequestParams: PaymentRequestUpdateParams,
  tx?: Transaction
): Promise<any> {
  const run = async (transaction: Transaction) => {
    const paymentRequest = await findPaymentRequestById(paymentRequestParams.id, { transaction })
    if (!paymentRequest) {
      throw new Error('Payment Request not found')
    }

    // Save previous values for best-effort Stripe rollback if Stripe fails.
    // This matches what the DB will contain if the transaction rolls back.
    const previousActive = !!paymentRequest.active
    const previousTitle = paymentRequest.title
    const previousDescription = paymentRequest.description

    const paymentLinkId: string | undefined = paymentRequest.payment_link_id
    if (!paymentLinkId) {
      throw new Error('Payment Request missing payment_link_id')
    }

    const paymentRequestUpdated = await paymentRequest.update(paymentRequestParams, {
      transaction
    })

    if (!paymentRequestUpdated) {
      throw new Error('Payment Request could not be updated')
    }

    const paymentLinkLineItems = await listPaymentLinkLineItems(paymentLinkId, 1)
    if (!paymentLinkLineItems || paymentLinkLineItems.data.length === 0) {
      throw new Error('No line items found for the Stripe Payment Link')
    }

    const productId = getStripeProductIdFromLineItem(paymentLinkLineItems.data[0])
    if (!productId) {
      throw new Error('Stripe Product not found for the Payment Link')
    }

    let paymentLinkActiveUpdated = false
    let productDetailsUpdated = false

    try {
      await updatePaymentRequestPaymentLinkActive(paymentLinkId, !!paymentRequestUpdated.active)
      paymentLinkActiveUpdated = true

      await updatePaymentRequestProductDetails(productId, {
        name: paymentRequestUpdated.title,
        description: paymentRequestUpdated.description ?? null
      })
      productDetailsUpdated = true
    } catch (error) {
      // Best-effort Stripe rollback; DB rollback is handled by Sequelize transaction throw.
      try {
        if (productDetailsUpdated) {
          await updatePaymentRequestProductDetails(productId, {
            name: previousTitle,
            description: previousDescription ?? null
          })
        }
      } catch {
        // swallow
      }

      try {
        if (paymentLinkActiveUpdated) {
          await updatePaymentRequestPaymentLinkActive(paymentLinkId, previousActive)
        }
      } catch {
        // swallow
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
