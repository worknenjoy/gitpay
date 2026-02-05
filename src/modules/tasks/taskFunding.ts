import models from '../../models'
import SendMail from '../../mail/mail'
import i18n from 'i18n'

const currentModels = models as any

export async function taskFunding(
  { id }: any,
  { comment, email, suggestedValue, suggestedDate, username }: any
) {
  const task = await currentModels.Task.findByPk(id, {
    include: [currentModels.User, currentModels.Order, currentModels.Assign]
  })

  const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
  const user = task.User.dataValues
  const language = user.language || 'en'
  const receiveNotifications = user.receiveNotifications
  i18n.setLocale(language)
  SendMail.success(
    { email, language, receiveNotifications },
    i18n.__('mail.funding.send.action', { username: username }),
    `${i18n.__('mail.funding.send.message', {
      title: task.title,
      url: taskUrl,
      suggestedValue: suggestedValue,
      message: comment,
      username: username,
      suggestedDate: suggestedDate
    })}
        `
  )
}
