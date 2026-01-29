import models from '../../models'
import PaymentMail from '../mail/payment'
import * as slackModule from '../shared/slack'

const currentModels = models as any
const { notifyBounty } = slackModule as any

type OrderUpdateAfterStripeParams = {
  plan?: string
  amount?: number
  currency?: string
}

export async function orderUpdateAfterStripe(order: any, charge: any, card: any, orderParameters: OrderUpdateAfterStripeParams, user: any, task: any, couponFull: boolean) {
  try {
    const orderPayload = couponFull
      ? {
          paid: true,
          status: 'succeeded'
        }
      : {
          source: charge.id,
          source_id: card.id,
          paid: charge.paid,
          status: charge.status
        }

    await currentModels.Order.update(orderPayload, {
      where: {
        id: order.dataValues.id
      }
    })
    
    if (orderParameters.plan === 'full') {
      PaymentMail.support(user, task, order)
    }
    PaymentMail.success(user, task, order.amount)

    // Send Slack notification for new bounty payment
    if (orderPayload.paid && orderPayload.status === 'succeeded') {
      const orderData = {
        amount: order.amount || orderParameters.amount,
        currency: order.currency || orderParameters.currency || 'USD'
      }
      await notifyBounty(task, orderData, user, 'Stripe payment')
    }

    if (task.dataValues.assigned) {
      const assignedId = task.dataValues.assigned
      const assign = await currentModels.Assign.findByPk(assignedId, {
        include: [currentModels.User]
      })
      PaymentMail.assigned(assign.dataValues.User.dataValues.email, task, order.amount)
      return task
    }
    return task
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    throw err
  }
}
