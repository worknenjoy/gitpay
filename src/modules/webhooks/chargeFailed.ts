import Models from '../../models'
import i18n from 'i18n'
import SendMail from '../mail/mail'
import Stripe from '../../client/payment/stripe'
import { FAILED_REASON } from './constants'

const models = Models as any
const stripe = Stripe()

export default async function chargeFailed(event: any, paid: any, status: any, req: any, res: any) {
  return models.Order.update(
    {
      paid: paid,
      status: status
    },
    {
      where: {
        source_id: event.data.object.source.id,
        source: event.data.object.id
      },
      returning: true
    }
  )
    .then((order: any) => {
      if (order[0]) {
        models.User.findOne({
          where: {
            id: order[1][0].dataValues.userId
          }
        }).then((user: any) => {
          if (user) {
            if (status === 'failed') {
              const language = user.language || 'en'
              i18n.setLocale(language)
              SendMail.error(
                user.dataValues,
                i18n.__('mail.webhook.payment.unapproved.subject'),
                i18n.__('mail.webhook.payment.unapproved.message', {
                  reason: FAILED_REASON[event.data.object.outcome.network_status]
                })
              )
              return res.status(200).json(event)
            }
          }
        })
      }
    })
    .catch((e: any) => {
      return res.status(400).send(e)
    })
}
