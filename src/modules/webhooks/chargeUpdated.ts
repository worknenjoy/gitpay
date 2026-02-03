import Models from '../../models'
import i18n from 'i18n'
import SendMail from '../mail/mail'

const models = Models as any

export default async function chargeUpdated(
  event: any,
  paid: any,
  status: any,
  req: any,
  res: any
) {
  if (event?.data?.object?.source?.id) {
    try {
      const order = await models.Order.update(
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

      if (order[0]) {
        const user = await models.User.findOne({
          where: {
            id: order[1][0].dataValues.userId
          }
        })

        if (user) {
          if (paid && status === 'succeeded') {
            const language = user.language || 'en'
            i18n.setLocale(language)
            SendMail.success(
              user.dataValues,
              i18n.__('mail.webhook.payment.update.subject'),
              i18n.__('mail.webhook.payment.update.message', {
                amount: String(event.data.object.amount / 100)
              })
            )
          }
        }
        return res.status(200).json(event)
      }
    } catch (e: any) {
      return res.status(400).send(e)
    }
  }
  return res.status(200).json(event)
}
