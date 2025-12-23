import { Request, Response } from 'express'
import i18n from 'i18n'
import Models from '../../../../models'
import PayoutMail from '../../../mail/payout'

const models = Models as any

export async function payoutFailed(event: any, req: Request, res: Response) {
  const { data } = event || {}
  const { object } = data || {}

  try {
    const user: any = await models.User.findOne({
      where: {
        account_id: event.account
      }
    })

    const payout: any = await models.Payout.findOne({
      where: {
        source_id: event.data.object.id
      }
    })

    if (payout) {
      const updatedPayout = await payout.update({
        status: object.status
      })

      if (!updatedPayout) return res.status(400).send({ error: 'Error to update payout' })

      if (user) {
        const language = user.language || 'en'
        i18n.setLocale(language)
        PayoutMail.payoutFailed(user, updatedPayout)
      }
    }

    return res.status(200).json(event)
  } catch (error) {
    return res.status(400).send(error)
  }
}
