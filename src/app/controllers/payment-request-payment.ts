import {
  paymentRequestPaymentList,
  paymentRequestRefund
} from '../../modules/paymentRequestPayments'

export const listPaymentRequestPayments = async (req: any, res: any) => {
  const userId = req.user.id

  try {
    const payments = await paymentRequestPaymentList({ userId })
    res.status(200).json(payments)
  } catch (error: any) {
    console.error('Error retrieving payments:', error)
    res.status(500).json({ error: error.message })
  }
}

export const refundPaymentRequestPayment = async (req: any, res: any) => {
  const userId = req.user.id
  const paymentId = parseInt(req.params.id, 10)

  try {
    const refundedPayment = await paymentRequestRefund({ id: paymentId, userId })
    res.status(200).json(refundedPayment)
  } catch (error: any) {
    console.error('Error processing refund:', error)
    res.status(500).json({ error: error.message })
  }
}
