import Models from '../../../../models'
import i18n from 'i18n'
import SendMail from '../../../mail/mail'
import initStripe from '../../../../client/payment/stripe'

const models = Models as any
const stripe = initStripe()

export async function transferCreatedIssue(event: any, req: any, res: any) {
  const transferId = event?.data?.object?.id
  const destination = event?.data?.object?.destination

  try {
    const existingTransfer = await models.Transfer.findOne({
      where: { transfer_id: transferId }
    })

    if (existingTransfer) {
      if (existingTransfer.transfer_method === 'stripe') existingTransfer.status = 'created'
      if (existingTransfer.transfer_method === 'multiple') existingTransfer.status = 'pending'
      await existingTransfer.save()
    }

    const task = await models.Task.findOne({
      where: { transfer_id: transferId },
      include: [models.User]
    })

    if (task) {
      try {
        const assigned = await models.Assign.findOne({
          where: { id: task.dataValues.assigned },
          include: [models.User]
        })

        const language = assigned.dataValues.User.language || 'en'
        i18n.setLocale(language)

        SendMail.success(
          assigned.dataValues.User.dataValues,
          i18n.__('mail.webhook.payment.transfer.subject'),
          i18n.__('mail.webhook.payment.transfer.message', {
            amount: `${event.data.object.amount / 100}`,
            url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
          })
        )
        return res.status(200).json(event)
      } catch (e) {
        return res.status(400).send(e)
      }
    } else {
      try {
        const account = await stripe.accounts.retrieve(destination)
        if (account || (account as any).email) {
          const user = await models.User.findOne({
            where: { email: (account as any).email }
          })

          if (user) {
            const language = user.language || 'en'
            i18n.setLocale(language)
          }

          SendMail.success(
            (account as any).email,
            i18n.__('mail.webhook.payment.transfer.subject'),
            i18n.__('mail.webhook.payment.transfer.message', {
              amount: `${event.data.object.amount / 100}`,
              url: `${event.data.object.id}`
            })
          )
        }
        return res.status(200).json(event)
      } catch (e) {
        console.log('Error retrieving account:', e)
        return res.status(200).send(event)
      }
    }
  } catch (e) {
    console.log('Error processing transfer created issue event:', e)
    return res.status(200).send(event)
  }
}
