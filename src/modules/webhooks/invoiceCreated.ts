import Models from '../../models'
import i18n from 'i18n'
import SendMail from '../../mail/mail'
import Stripe from '../../client/payment/stripe'
import { formatStripeAmount } from './constants'

const models = Models as any
const stripe = Stripe()

export default async function invoiceCreated(event: any, req: any, res: any) {
  // eslint-disable-next-line no-case-declarations
  const shouldCreateWalletOrder = event.data.object.metadata['create_wallet_order']
  if (shouldCreateWalletOrder === 'true' || shouldCreateWalletOrder === true) {
    const walletId = event.data.object.metadata.wallet_id
    const walletOrderExists = await models.WalletOrder.findOne({
      where: {
        source: event.data.object.id
      }
    })
    if (!walletOrderExists) {
      const walletOrder = await models.WalletOrder.create({
        walletId,
        source_id: event.data.object.id,
        currency: event.data.object.currency,
        amount: formatStripeAmount(event.data.object.amount_due),
        description: `created wallet order from stripe invoice. ${event.data.object.description}`,
        source_type: 'stripe',
        source: event.data.object.id,
        ordered_in: new Date(),
        paid: false,
        status: event.data.object.status
      })
    }
  }

  try {
    const order = await models.Order.update(
      {
        status: event.data.object.status,
        source: event.data.object.charge
      },
      {
        where: {
          source_id: event.data.object.id
        },
        returning: true
      }
    )

    if (order[0] && order[1].length) {
      const orderUpdated = await models.Order.findOne({
        where: {
          id: order[1][0].dataValues.id
        },
        include: [models.Task, models.User]
      })

      const userAssign = await models.Assign.findOne({
        where: {
          id: orderUpdated.Task.dataValues.assigned
        },
        include: [models.Task, models.User]
      })

      const userAssigned = userAssign.dataValues.User.dataValues
      const userTask = orderUpdated.User.dataValues

      if (orderUpdated) {
        const userAssignedLanguage = userAssigned.language || 'en'
        i18n.setLocale(userAssignedLanguage)
        SendMail.success(
          userAssigned,
          i18n.__('mail.webhook.invoice.create.subject'),
          i18n.__('mail.webhook.invoice.create.message', {
            amount: order[1][0].dataValues.amount
          })
        )

        const userTaskLanguage = userTask.language || 'en'
        i18n.setLocale(userTaskLanguage)
        SendMail.success(
          userTask,
          i18n.__('mail.webhook.payment.update.subject'),
          i18n.__('mail.webhook.payment.approved.message', {
            amount: order[1][0].dataValues.amount
          })
        )
      }
      return res.status(200).json(event)
    }
    return res.status(200).json(event)
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log('error on invoice create webhook', e)
    return res.status(400).send(e)
  }
}
