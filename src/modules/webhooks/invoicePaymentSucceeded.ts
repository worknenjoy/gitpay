import Models from '../../models'
import i18n from 'i18n'
import moment from 'moment'
import SendMail from '../mail/mail'
import WalletMail from '../mail/wallet'
import Stripe from '../../client/payment/stripe'
import { FAILED_REASON, CURRENCIES, formatStripeAmount } from './constants'

const models = Models as any
const stripe = Stripe()

export default async function invoicePaymentSucceeded(event: any, req: any, res: any) {
  return models.User.findOne({
    where: { email: event.data.object.customer_email }
  })
    .then((userFound: any) => {
      if (!userFound) {
        return models.User.create({
          email: event.data.object.customer_email,
          name: event.data.object.customer_name,
          country: event.data.object.account_country,
          customer_id: event.data.object.customer[0],
          active: false
        }).then(async (user: any) => {
          await user.addType(await models.Type.find({ name: 'funding' }))
          const source_id = event.data.object.id[0]
          if (source_id) {
            return models.Order.update(
              {
                status: event.data.object.status,
                source: event.data.object.charge[0],
                paid: true,
                userId: user.dataValues.id
              },
              {
                where: {
                  source_id: event.data.object.id[0]
                },
                returning: true
              }
            ).then((order: any) => {
              return res.status(200).json(event)
            })
          }
          return res.status(200).json(event)
        })
      }
    })
    .catch((e: any) => {
      return res.status(400).send(e)
    })
}
