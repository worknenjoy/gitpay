import models from '../../models'
import SendMail from '../../mail/mail'
import i18n from 'i18n'
// @ts-ignore - jsonwebtoken has no type definitions
import jwt from 'jsonwebtoken'
import * as constants from '../../mail/constants'

const currentModels = models as any

export async function taskReport({ id }: any, { reason }: any, user?: any) {
  const taskData = await currentModels.Task.findByPk(id, {
    include: [currentModels.User, currentModels.Order, currentModels.Assign]
  })

  if (!taskData) {
    const err: any = new Error('Task not found')
    err.status = 404
    throw err
  }

  if (!reason) {
    const err: any = new Error('Reason is required')
    err.status = 400
    throw err
  }

  const token = jwt.sign(id, process.env.SECRET_PHRASE as string)
  const title = (taskData.title || '').replace(/\s/g, '-')
  const formattedReason = (reason || '').replace(/\s/g, '-')
  const userId = taskData.User ? taskData.User.id : (taskData.userId || '')
  const trustedBaseUrl = process.env.API_HOST || process.env.FRONTEND_HOST || 'https://gitpay.me'
  const approveURL =
    trustedBaseUrl +
    '/tasks/delete/' +
    id +
    '/' +
    userId +
    '?title=' +
    encodeURIComponent(title) +
    '&reason=' +
    encodeURIComponent(formattedReason) +
    '&token=' +
    token

  const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${taskData.id}`
  i18n.setLocale('en')
  const receiveNotifications = taskData.User ? taskData.User.receiveNotifications : true
  return SendMail.success(
    { email: constants.reportEmail, language: 'en', receiveNotifications },
    i18n.__('mail.report.send.action'),
    `${i18n.__('mail.report.send.message', {
      title: taskData.title,
      url: taskUrl,
      approveURL: approveURL,
      selectedReason: reason
    })}
        `
  )
}
