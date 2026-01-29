import Models from '../../models'
import createStripe from '../shared/stripe/stripe'
import PaymentRequestMail from '../mail/paymentRequest'

const db = Models as any

type PaymentRequestParams = {
  id?: number | string
  userId?: number | string
  title: string
  description?: string
  amount?: number
  currency?: string
  custom_amount?: boolean
}

const stripe = createStripe()

export async function paymentRequestBuilds(paymentRequestParams: PaymentRequestParams): Promise<any> {
  const currency = paymentRequestParams.currency ?? 'usd'
  const { id, userId, title, description, amount, custom_amount } = paymentRequestParams

  const product = await stripe.products.create({
    name: title,
    description,
    metadata: {
      payment_request_id: id ?? null,
      user_id: userId ?? null
    }
  })

  const finalAmount = amount ? Math.round(amount * 100) : 0
  const finalPriceData = custom_amount
    ? { custom_unit_amount: { enabled: true } }
    : { unit_amount: finalAmount }

  const price = await stripe.prices.create({
    ...finalPriceData,
    currency,
    product: product.id,
    metadata: {
      payment_request_id: id ?? null,
      user_id: userId ?? null
    }
  })

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }]
  })

  const createPaymentRequest = await db.PaymentRequest.create({
    ...paymentRequestParams,
    payment_link_id: paymentLink.id,
    payment_url: paymentLink.url,
    currency,
    amount,
    custom_amount: custom_amount ?? false,
    title,
    description
  })

  await stripe.paymentLinks.update(paymentLink.id, {
    metadata: {
      payment_request_id: createPaymentRequest.id,
      user_id: createPaymentRequest.userId
    }
  })

  const paymentRequest = await db.PaymentRequest.findByPk(createPaymentRequest.id, {
    include: [{ model: db.User }]
  })

  if (createPaymentRequest?.id) {
    await PaymentRequestMail.paymentRequestInitiated(paymentRequest.User, paymentRequest)
  }

  return createPaymentRequest
}
