import Models from '../../models'
import i18n from 'i18n'
import SendMail from '../mail/mail'
import Stripe from '../../client/payment/stripe'

const models = Models as any
const stripe = Stripe()

export default async function customerSourceCreated(event: any, req: any, res: any) {
  try {
    const user = await models.User.findOne({
      where: {
        customer_id: event.data.object.customer
      }
    })

    if (!user) {
      return res.status(400).send({ errors: ['User not found'] })
    }

    const language = user.language || 'en'
    i18n.setLocale(language)

    if (event.data.object.name && event.data.object.last4) {
      SendMail.success(
        user.dataValues,
        i18n.__('mail.webhook.payment.success.subject'),
        i18n.__('mail.webhook.payment.success.message', {
          name: event.data.object.name,
          number: event.data.object.last4
        })
      )
    }

    return res.status(200).json(event)
  } catch (error: any) {
    return res.status(400).send(error)
  }
}
