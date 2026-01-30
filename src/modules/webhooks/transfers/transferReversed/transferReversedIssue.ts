import models from '../../../../models'
import i18n from 'i18n'

const currentModels = models as any
import moment from 'moment'
import SendMail from '../../../mail/mail'

export async function transferReversedIssue(event: any, req: any, res: any): Promise<boolean> {
  const transferId = event?.data?.object?.id

  try {
    const existingTransfer = await currentModels.Transfer.findOne({
      where: {
        transfer_id: transferId
      }
    })

    if (existingTransfer) {
      if (existingTransfer.transfer_method === 'stripe') existingTransfer.status = 'reversed'
      if (existingTransfer.transfer_method === 'multiple') existingTransfer.status = 'failed'
      await existingTransfer.save()
    }

    const task = await currentModels.Task.findOne({
      where: {
        transfer_id: transferId
      },
      include: [currentModels.User]
    })

    if (task) {
      try {
        const assigned = await currentModels.Assign.findOne({
          where: {
            id: task.dataValues.assigned
          },
          include: [currentModels.User]
        })

        const language = assigned.dataValues.User.language || 'en'
        i18n.setLocale(language)
        SendMail.error(
          assigned.dataValues.User,
          i18n.__('mail.webhook.payment.transfer.reversed.subject'),
          i18n.__('mail.webhook.payment.transfer.reversed.message', {
            currency: event.data.object.currency.toUpperCase(),
            amount: (event.data.object.amount / 100).toFixed(2),
            date: moment(new Date()).format('LLL'),
            url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
          })
        )
        res.status(200).json(event)
        return true
      } catch (e) {
        console.error('Error sending transfer reversed email:', e)
        res.status(200).json(event)
        return true
      }
    }

    // No task associated, still respond OK to the webhook
    res.status(200).json(event)
    return true
  } catch (e) {
    console.error('Error processing transfer reversed webhook:', e)
    res.status(400).send(e)
    return true
  }
}
