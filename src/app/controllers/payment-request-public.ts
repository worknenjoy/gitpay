import { findPaymentRequestById } from '../../queries/payment-request/payment-request'
import { WhopPaymentProvider } from '../../providers/whop/WhopPaymentProvider'

export const getPublicPaymentRequest = async function getPublicPaymentRequest(req: any, res: any) {
  try {
    const paymentRequest = await findPaymentRequestById(req.params.id)
    if (!paymentRequest) {
      return res.status(404).send({ message: 'Payment request not found' })
    }

    return res.status(200).send({
      title: paymentRequest.title,
      description: paymentRequest.description,
      currency: paymentRequest.currency,
      provider: paymentRequest.provider,
      custom_amount: paymentRequest.custom_amount,
      active: paymentRequest.active
    })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('getPublicPaymentRequest error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const createWhopCheckout = async function createWhopCheckout(req: any, res: any) {
  try {
    const paymentRequest = await findPaymentRequestById(req.params.id)
    if (!paymentRequest) {
      return res.status(404).send({ message: 'Payment request not found' })
    }
    if (paymentRequest.provider !== 'whop' || !paymentRequest.custom_amount) {
      return res
        .status(400)
        .send({ message: 'This payment request does not accept a custom amount checkout' })
    }
    if (!paymentRequest.active) {
      return res.status(410).send({ message: 'This payment link is no longer active' })
    }

    const amount = Number(req.body?.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).send({ message: 'A valid positive amount is required' })
    }

    const provider = WhopPaymentProvider.getInstance()
    const { sessionId, purchaseUrl } = await provider.createCheckoutForAmount(
      {
        productId: paymentRequest.payment_link_id,
        title: paymentRequest.title,
        description: paymentRequest.description,
        currency: paymentRequest.currency,
        metadata: {
          payment_request_id: paymentRequest.id,
          user_id: paymentRequest.userId,
          purpose: 'payment_request'
        }
      },
      amount
    )

    return res.status(201).send({ sessionId, purchaseUrl })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('createWhopCheckout error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
