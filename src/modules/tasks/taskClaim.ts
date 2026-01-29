import models from '../../models'
import { taskUpdate } from './taskUpdate'
import { taskFetch } from './taskFetch'
import SendMail from '../mail/mail'
import i18n from 'i18n'
import jwt from 'jsonwebtoken'

const currentModels = models as any

const sendConfirmationEmail = (task: any, user: any, comments: string) => {
  const token = jwt.sign(task.id, process.env.SECRET_PHRASE)
  const formattedfComments = comments.replace(/\s/g, '-')
  const approveURL = `${process.env.FRONTEND_HOST}/#/task/${task.id}/claim?comments=${formattedfComments}&token=${token}`
  const language = user.language || 'en'
  i18n.setLocale(language)

  const body = `${i18n.__('mail.issue.claim.request.body', {
    title: task.title,
    url: task.url,
    approveURL: approveURL
  })}`

  return SendMail.success(
    { email: user.email, language, receiveNotifications: user.receiveNotifications },
    i18n.__('mail.issue.claim.request.subject'),
    body
  )
}

const verifyIssueAndClaim = async (task: any, user: any, comments: string, token: string) => {
  const language = user.language || 'en'
  i18n.setLocale(language)

  return jwt.verify(token, process.env.SECRET_PHRASE, async (err: any, decoded: any) => {
    // the 401 code is for unauthorized status
    if (err || parseInt(decoded) !== parseInt(task.id)) {
      throw new Error('invalid_token')
    }

    if (task.provider !== 'github' || user.provider !== task.provider) {
      throw new Error('invalid_provider')
    }

    if (task.metadata.issue.user.login !== user.provider_username) {
      throw new Error('user_is_not_the_owner')
    }

    const taskUser = task.user

    // Update task
    await taskUpdate({ id: task.id, userId: user.id })

    const body = `${i18n.__('mail.issue.claim.confirmation.body', {
      title: task.title,
      url: task.url,
      comments: comments
    })}`

    return SendMail.success(
      { email: taskUser.email, language, receiveNotifications: taskUser.receiveNotifications },
      i18n.__('mail.issue.claim.confirmation.subject'),
      body
    )
  })
}

export async function requestClaim({ taskId, userId, comments, isApproved, token }: any) {
  const task = await taskFetch({ id: taskId })
  const user = await currentModels.User.findOne({
    where: {
      id: userId
    }
  })

  if (isApproved) {
    return verifyIssueAndClaim(task, user, comments, token)
  } else {
    return sendConfirmationEmail(task, user, comments)
  }
}
