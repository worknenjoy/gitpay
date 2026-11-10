import models from '../../models'
import SendMail from '../../mail/mail'
import i18n from 'i18n'

const currentModels = models as any

export async function taskInvite({ id }: any, { message, email, name }: any, user?: any) {
  const task = await currentModels.Task.findByPk(id, {
    include: [currentModels.User, currentModels.Order, currentModels.Assign]
  })

  if (!task) {
    throw new Error('Task not found')
  }

  if (user && task.userId !== user.id) {
    throw new Error('Unauthorized: only task owner can send invitations')
  }

  const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
  const taskUser = task.User?.dataValues || {}
  const language = taskUser.language || 'en'
  const receiveNotifications = taskUser.receiveNotifications
  i18n.setLocale(language)
  const hasBounty = Number(task.value) > 0
  SendMail.success(
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
