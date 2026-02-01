import Models from '../../models'
import Stripe from '../../client/payment/stripe'

const models = Models as any
const stripe = Stripe()

export default async function invoicePaid(event: any, req: any, res: any) {
  try {
    const walletOrderUpdate = await models.WalletOrder.update(
      {
        status: event.data.object.status
      },
      {
        where: {
          source: event.data.object.id
        }
      }
    )
    return res.status(200).json(event)
  } catch (error) {
    console.log('error', error)
    return res.status(200).json(event)
  }
}
