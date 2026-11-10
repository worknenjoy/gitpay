import models from '../../models'
import SendMail from '../../mail/mail'
import i18n from 'i18n'
// @ts-ignore - jsonwebtoken has no type definitions
import jwt from 'jsonwebtoken'
import * as constants from '../../mail/constants'

const currentModels = models as any

export async function taskReport({ id }: any, { task, reason, baseUrl }: any, user?: any) {
  const token = jwt.sign(id, process.env.SECRET_PHRASE as string)
  const title = (task?.title || '').replace(/\s/g, '-')
  const formattedReason = (reason || '').replace(/\s/g, '-')
  const userId = task?.User ? task.User.id : (task?.userId || '')
  const configuredBaseUrl = process.env.API_URL || process.env.FRONTEND_HOST || baseUrl || ''
  const approveURL =
    configuredBaseUrl +
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

  const taskData = await currentModels.Task.findByPk(id, {
    include: [currentModels.User, currentModels.Order, currentModels.Assign]
  })

  if (!taskData) {
    throw new Error('Task not found')
  }

  const taskUrl = ${process.env.FRONTEND_HOST}/#/task/
  i18n.setLocale('en')
  const receiveNotifications = taskData.User?.receiveNotifications ?? true
  SendMail.success(
    { email: constants.reportEmail, language: 'en', receiveNotifications },
    i18n.__('mail.report.send.action'),
    ${i18n.__('mail.report.send.message', {
      title: taskData.title,
      url: taskUrl,
      approveURL: approveURL,
      selectedReason: reason
    })}
        
  )
}
