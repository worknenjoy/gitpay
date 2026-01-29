import models from '../../models'
const SendMail = require('../mail/mail')
const i18n = require('i18n')
const jwt = require('jsonwebtoken')
const { reportEmail } = require('../mail/constants')

const currentModels = models as any

export async function taskReport({ id }: any, { task, reason, baseUrl }: any) {
  try {
    const token = jwt.sign(id, process.env.SECRET_PHRASE)
    const title = task.title.replace(/\s/g, '-')
    const formattedReason = reason.replace(/\s/g, '-')
    const userId = task.User ? task.User.id : ''
    const approveURL =
      baseUrl +
      '/tasks/delete/' +
      id +
      '/' +
      userId +
      '?title=' +
      title +
      '&reason=' +
      formattedReason +
      '&token=' +
      token
    
    const taskData = await currentModels.Task.findByPk(id, { include: [currentModels.User, currentModels.Order, currentModels.Assign] })
    
    const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`
    i18n.setLocale('en')
    const receiveNotifications = taskData.User.receiveNotifications
    SendMail.success(
      { email: reportEmail, language: 'en', receiveNotifications },
      i18n.__('mail.report.send.action'),
      `${i18n.__('mail.report.send.message', {
        title: taskData.title,
        url: taskUrl,
        approveURL: approveURL,
        selectedReason: reason
      })}
        `
    )
  } catch (error) {
    throw error
  }
}
