import { paymentRequestBalanceList } from '../../modules/paymentRequestBalance'

export const listPaymentRequestBalances = async (req: any, res: any) => {
  const userId = req.user.id

  try {
    const balances = await paymentRequestBalanceList({ userId })
    res.status(200).json(balances)
  } catch (error: any) {
    console.error('Error retrieving balances:', error)
    res.status(500).json({ error: error.message })
  }
}
