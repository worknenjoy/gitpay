import Models from '../../models'
import i18n from 'i18n'
import SendMail from '../mail/mail'

const models = Models as any

const sendEmailSuccess = async (
  event: any,
  paid: any,
  status: any,
  order: any,
  req: any,
  res: any
) => {
  try {
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
          i18n.__('mail.webhook.payment.approved.message', {
            amount: String(event.data.object.amount / 100)
          })
        )
      }
    }

    return res.json(req.body)
  } catch (e: any) {
    return res.status(400).send(e)
  }
}

const updateOrder = async (event: any, paid: any, status: any, req: any, res: any) => {
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
      return sendEmailSuccess(event, paid, status, order, req, res)
    }
  } catch (e: any) {
    return res.status(400).send(e)
  }
}

const createOrder = async (event: any) => {
  const taskId = event.data.object?.transfer_group?.split('_')[1]
  if (!taskId) return Promise.resolve()

  const task = await models.Task.findOne({
    where: { id: taskId }
  })

  return task.createOrder({
    id: event.data.object.metadata.order_id,
    source_id: event.data.object.source.id,
    currency: event.data.object.currency,
    amount: event.data.object.amount,
    source: event.data.object.id,
    userId: task.dataValues.userId
  })
}

export default async (event: any, paid: any, status: any, req: any, res: any) => {
  const source_id = event?.data?.object?.source?.id
  if (source_id) {
    const order = await models.Order.findOne({
      where: {
        source_id: event?.data?.object?.source?.id,
        source: event?.data?.object?.id
      }
    })

    if (order) {
      return updateOrder(event, paid, status, req, res)
    } else {
      const orderCreated = await createOrder(event)
      if (orderCreated) {
        return updateOrder(event, paid, status, req, res)
      }
    }
  }
  return res.json(req.body)
}
