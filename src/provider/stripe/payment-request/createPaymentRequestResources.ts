import { getStripeClient } from '../client'

export type StripePaymentRequestMetadata = {
  payment_request_id?: number | string | null
  user_id?: number | string | null
}

export type CreatePaymentRequestStripeResourcesParams = {
  title: string
  description?: string
  currency: string
  amount?: number
  custom_amount?: boolean
  metadata?: StripePaymentRequestMetadata
}

export type PaymentRequestStripeResources = {
  productId: string
  priceId: string
  paymentLinkId: string
  paymentUrl: string
}

export async function createPaymentRequestStripeResources(
  params: CreatePaymentRequestStripeResourcesParams
): Promise<PaymentRequestStripeResources> {
  const stripe = getStripeClient()

  const product = await stripe.products.create({
    name: params.title,
    description: params.description,
    metadata: {
      payment_request_id: params.metadata?.payment_request_id ?? null,
      user_id: params.metadata?.user_id ?? null
    }
  })

  const finalAmount = params.amount ? Math.round(params.amount * 100) : 0
  const finalPriceData = params.custom_amount
    ? { custom_unit_amount: { enabled: true } }
    : { unit_amount: finalAmount }

  const price = await stripe.prices.create({
    ...finalPriceData,
    currency: params.currency,
    product: product.id,
    metadata: {
      payment_request_id: params.metadata?.payment_request_id ?? null,
      user_id: params.metadata?.user_id ?? null
    }
  })

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }]
  })

  return {
    productId: product.id,
    priceId: price.id,
    paymentLinkId: paymentLink.id,
    paymentUrl: paymentLink.url
  }
}
