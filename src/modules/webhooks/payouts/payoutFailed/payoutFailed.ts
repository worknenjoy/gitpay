import { Request, Response } from 'express'
import i18n from 'i18n'
import Models from '../../../../models'
import SendMail from '../../../mail/mail'
import { CURRENCIES } from '../../constants'

const models = Models as any

export async function payoutFailed(event: any, req: Request, res: Response) {
  try {
    const user: any = await models.User.findOne({
      where: {
        account_id: event.account
      }
    })

    if (user) {
      const language = user.language || 'en'
      i18n.setLocale(language)
      SendMail.success(
        user.dataValues,
        i18n.__('mail.webhook.payment.transfer.intransit.fail.subject'),
        i18n.__('mail.webhook.payment.transfer.intransit.fail.message', {
          currency: CURRENCIES[event.data.object.currency as keyof typeof CURRENCIES] || event.data.object.currency,
          amount: event.data.object.amount / 100
        })
      )
    }

    return res.status(200).json(event)
  } catch (error) {
    return res.status(400).send(error)
  }
}
