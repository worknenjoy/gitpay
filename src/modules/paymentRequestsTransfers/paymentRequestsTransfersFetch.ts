import stripe from '../../client/payment/stripe'
import models from '../../models'
import { PaypalConnect } from '../../client/provider/paypal'

const currentModels = models as any
const stripeInstance = stripe()

export async function transferFetch(id: number) {
  if (id) {
    const transfer = await currentModels.Transfer.findOne({
      where: { id },
      include: [
        currentModels.Task,
        {
          model: currentModels.User,
          as: 'User'
        },
        {
          model: currentModels.User,
          as: 'destination'
        }
      ]
    })
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
      const stripeTransfer = await stripeInstance.transfers.retrieve(transfer.transfer_id)
      if (stripeTransfer) {
        transfer.dataValues.stripeTransfer = stripeTransfer
      }
    }
    return transfer
  }
}
