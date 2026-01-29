import models from '../../models'
const SendMail = require('../mail/mail')
const i18n = require('i18n')

const currentModels = models as any

export async function taskInvite({ id }: any, { message, email, name }: any) {
  try {
    const task = await currentModels.Task.findByPk(id, { include: [currentModels.User, currentModels.Order, currentModels.Assign] })
    
    const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const user = task.User.dataValues
    const language = user.language || 'en'
    const receiveNotifications = user.receiveNotifications
    i18n.setLocale(language)
    SendMail.success(
      { email, language, receiveNotifications },
      i18n.__('mail.invite.send.action', { name: name }),
      `${i18n.__('mail.invite.send.message', {
        name: name,
        title: task.title,
        url: taskUrl,
        value: task.value,
        message: message
      })}
        `
    )
  } catch (error) {
    throw error
  }
}
