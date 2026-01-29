import models from '../../models'
const SendMail = require('../mail/mail')
const i18n = require('i18n')

const currentModels = models as any

export async function taskDeleteConfirmation(taskParameters: any) {
  try {
    const user = await currentModels.User.findOne({
      where: {
        id: taskParameters.userId
      }
    })
    
    const userEmail = user.dataValues.email
    const language = user.language || 'en'
    const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskParameters.id}`
    i18n.setLocale(language)
    SendMail.success(
      { email: userEmail, language: 'en' },
      i18n.__('mail.report.delete.send.action'),
      `${i18n.__('mail.report.delete.send.message', {
        title: taskParameters.title.replace(/-/g, ' '),
        url: taskUrl,
        selectedReason: taskParameters.reason.replace(/-/g, ' ')
      })}
        `
    )
  } catch (error) {
    throw error
  }
}
