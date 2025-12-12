import Models from '../../../../models'
import i18n from 'i18n'
import SendMail from '../../../mail/mail'
import { CURRENCIES } from '../../constants'
import { handleAmount } from '../../../util/handle-amount/handle-amount'
import PayoutMail from '../../../mail/payout'

const models = Models as any

export async function payoutPaid(event: any, req: any, res: any) {
  try {
    const [updatedCount] = await models.Payout.update(
      {
        status: event.data.object.status,
        paid: true
      },
      {
        where: {
          source_id: event.data.object.id
        }
      }
    )

    if (updatedCount === 0) {
      return res.status(400).send({ error: 'Error to update payout' })
    }

    const user = await models.User.findOne({
      where: {
        account_id: event.account
      }
    })

    const payout = await models.Payout.findOne({
      where: {
        source_id: event.data.object.id
      }
    })

    if (user) {
      const date = new Date(event.data.object.arrival_date * 1000)
      const language = user.language || 'en'
      i18n.setLocale(language)
      PayoutMail.payoutPaid(
        user,
        payout
      )
    }

    return res.status(200).json(event)
  } catch (error) {
    console.log('error to handle payout paid', error)
    return res.status(400).send(error)
  }
}
