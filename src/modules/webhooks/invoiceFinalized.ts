import Models from '../../models'
import WalletMail from '../../mail/wallet'
import Stripe from '../../client/payment/stripe'

const models = Models as any
const stripe = Stripe()

export default async function invoiceFinalized(event: any, req: any, res: any) {
  try {
    const invoice = event.data.object
    const invoiceId = invoice.id
    const walletOrder = await models.WalletOrder.findOne({
      where: {
        source: invoiceId
      },
      include: [
        {
          model: models.Wallet,
          include: [models.User]
        }
      ]
    })
    if (walletOrder?.id) {
      WalletMail.invoiceCreated(invoice, walletOrder, walletOrder.Wallet.User)
      return res.status(200).json(event)
    }
    return res.status(200).json(event)
  } catch (error) {
    console.log('error', error)
    return res.status(200).json(event)
  }
}
