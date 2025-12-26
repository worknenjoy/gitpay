import Models from '../../../../models'

const models = Models as any

export async function transferCreatedPaymentRequest(event: any, req: any, res: any) {
  const metadata = event?.data?.object?.metadata || {}
  const { payment_request_id: paymentRequestId, user_id: userId } = metadata

  if (!paymentRequestId) {
    return res.status(200).json(event)
  }

  try {
    await models.PaymentRequestTransfer.create({
      transfer_id: event.data.object.id,
      paymentRequestId: paymentRequestId,
      userId: userId,
      value: event.data.object.amount / 100,
      status: 'created',
      transfer_method: 'stripe'
    })
    return res.status(200).json(event)
  } catch (error) {
    console.error('Error creating payment request transfer:', error)
    return res.status(200).json(event)
  }
}
