import Models from '../../../../models'
import PayoutMail from '../../../mail/payout'

const models = Models as any

export async function payoutCreated(event: any, req: any, res: any) {
  const { data } = event || {}
  const { object } = data || {}
  try {
    const user = await models.User.findOne({
      where: {
        account_id: event.account
      }
    })

    if (user) {
      const existingPayout = await models.Payout.findOne({
        where: {
          source_id: object.id
        }
      })

      if (existingPayout) {
        return res.status(200).json(event)
      }

      const isPayoutRequest = object.metadata.type === 'payout_request'
      if (!isPayoutRequest) {
        const payout = await models.Payout.build({
          userId: user.dataValues.id,
          amount: object.amount,
          currency: object.currency,
          status: object.status,
          source_id: object.id,
          description: object.description,
          method: object.type,
          arrival_date: object.arrival_date
        }).save()

        if (!payout) return res.status(400).send({ error: 'Error to create payout' })

        try {
          PayoutMail.payoutCreated(user, payout)
        } catch (e) {
          console.error('Error sending payout created mail:', e)
        }
      }
      return res.status(200).json(event)
    }
  } catch (e) {
    return res.status(400).send(e)
  }
}
