import { paymentRequestPaymentList } from '../../modules/paymentRequestPayments'

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
