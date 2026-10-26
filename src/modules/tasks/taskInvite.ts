import models from '../../models'
import SendMail from '../../mail/mail'
import i18n from 'i18n'

const currentModels = models as any

export async function taskInvite({ id }: any, { message, email, name }: any, user?: any) {
  const task = await currentModels.Task.findByPk(id, {
    include: [currentModels.User, currentModels.Order, currentModels.Assign]
  })

  if (!task) {
    const err: any = new Error('Task not found')
    err.status = 404
    throw err
  }

  if (user && Number(task.userId) !== Number(user.id)) {
    const err: any = new Error('Unauthorized')
    err.status = 403
    throw err
  }

  if (!email) {
    const err: any = new Error('Recipient email is required')
    err.status = 400
    throw err
  }

  const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
  const taskUser = task.User ? task.User.dataValues : {}
  const language = taskUser.language || 'en'
  const receiveNotifications = taskUser.receiveNotifications
  i18n.setLocale(language)
  const hasBounty = Number(task.value) > 0
  return SendMail.success(
    { email, language, receiveNotifications },
    i18n.__('mail.invite.send.action', { name: name }),
    `${i18n.__(hasBounty ? 'mail.invite.send.message' : 'mail.invite.send.message.noValue', {
      name: name,
      title: task.title,
      url: taskUrl,
      value: task.value,
      message: message
    })}
        `
  )
}
