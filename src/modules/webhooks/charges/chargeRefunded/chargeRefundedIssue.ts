import Models from '../../../../models'
import i18n from 'i18n'
import SendMail from '../../../../mail/mail'
import { updateOrderAsRefunded } from '../../../../mutations/order/updateOrderAsRefunded'

const models = Models as any

export const handleChargeRefundedIssue = async (event: any) => {
  const { paid, status, source, id } = event.data.object

  const order = await updateOrderAsRefunded({ source_id: source.id, source: id })

  const orderStatus = order[0]
  const orderDetails = order[1][0]

  if (orderStatus) {
    const user = await models.User.findOne({
      where: {
        id: orderDetails.userId
      }
    })

    if (user && paid && status === 'succeeded') {
      SendMail.success(
        user.dataValues,
        i18n.__('mail.webhook.payment.refund.subject'),
        i18n.__('mail.webhook.payment.refund.message', {
          amount: (event.data.object.amount_refunded / 100).toString()
        })
      )
    }
  }
}
