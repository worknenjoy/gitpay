import { findTransferByIdForFetch } from './findTransferByIdForFetch'
import { retrieveTransfer } from '../provider/stripe/transfer'
import { PaypalConnect } from '../../client/provider/paypal'

export async function fetchTransfer(id: number) {
  if (!id) return

  const transfer = await findTransferByIdForFetch(id)
  if (!transfer) return

  if (transfer.paypal_payout_id) {
    try {
      const paypalTransfer = await PaypalConnect({
        method: 'GET',
        uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts/${transfer.paypal_payout_id}`
      })
      transfer.dataValues.paypalTransfer = paypalTransfer
    } catch (error) {
      console.error('Error fetching PayPal transfer:', error)
    }
  }

  if (transfer.transfer_id) {
    const stripeTransfer = await retrieveTransfer(transfer.transfer_id)
    if (stripeTransfer) {
      transfer.dataValues.stripeTransfer = stripeTransfer
    }
  }

  return transfer
}
