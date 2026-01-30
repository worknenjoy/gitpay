import models from '../../../../models'

const currentModels = models as any

export async function transferReversedPaymentRequest(
  event: any,
  req: any,
  res: any
): Promise<boolean> {
  const transferId = event?.data?.object?.id
  const metadata = event?.data?.object?.metadata || {}
  const { payment_request_id: paymentRequestId, user_id: userId } = metadata

  if (!paymentRequestId) {
    return false
  }

  try {
    const paymentRequestTransfer = await currentModels.PaymentRequestTransfer.findOne({
      where: {
        transfer_id: transferId,
        paymentRequestId: paymentRequestId,
        userId: userId
      }
    })

    if (paymentRequestTransfer) {
      paymentRequestTransfer.status = 'reversed'
      await paymentRequestTransfer.save()
    }

    res.status(200).json(event)
    return true
  } catch (error) {
    console.error('Error updating payment request transfer to reversed:', error)
    res.status(200).json(event)
    return true
  }
}
