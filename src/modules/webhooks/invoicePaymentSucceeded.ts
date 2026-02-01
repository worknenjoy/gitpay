import Models from '../../models'
import Stripe from '../../client/payment/stripe'

const models = Models as any
const stripe = Stripe()

export default async function invoicePaymentSucceeded(event: any, req: any, res: any) {
  try {
    let userFound = await models.User.findOne({
      where: { email: event.data.object.customer_email }
    })

    if (!userFound) {
      const user = await models.User.create({
        email: event.data.object.customer_email,
        name: event.data.object.customer_name,
        country: event.data.object.account_country,
        customer_id: event.data.object.customer[0],
        active: false
      })

      await user.addType(await models.Type.find({ name: 'funding' }))

      const source_id = event.data.object.id[0]
      if (source_id) {
        await models.Order.update(
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
        )
        return res.status(200).json(event)
      }
      return res.status(200).json(event)
    }
  } catch (e: any) {
    return res.status(400).send(e)
  }
}
