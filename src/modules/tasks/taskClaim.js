const Promise = require('bluebird')
const taskUpdate = require('./taskUpdate')
const models = require('../../models')
const SendMail = require('../mail/mail')
const i18n = require('i18n')
const taskFetch = require('./taskFetch')
const jwt = require('jsonwebtoken')

const sendConfirmationEmail = (task, user, comments) => {
  const token = jwt.sign(task.id, process.env.SECRET_PHRASE)
  const formattedfComments = comments.replace(/\s/g, '-')
  const approveURL = `${process.env.FRONTEND_HOST}/#/task/${task.id}/claim?comments=${formattedfComments}&token=${token}`
  const language = user.language || 'en'
  i18n.setLocale(language)

  const body = `${i18n.__('mail.issue.claim.request.body', {
    title: task.title,
    url: task.url,
    approveURL: approveURL,
  })}`

  return SendMail.success(
    { email: user.email, language, receiveNotifications: user.receiveNotifications },
    i18n.__('mail.issue.claim.request.subject'),
    body,
  )
}

const verifyIssueAndClaim = async (task, user, comments, token) => {
  const language = user.language || 'en'
  i18n.setLocale(language)

  return jwt.verify(token, process.env.SECRET_PHRASE, async (err, decoded) => {
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
      comments: comments,
    })}`

    return SendMail.success(
      { email: taskUser.email, language, receiveNotifications: taskUser.receiveNotifications },
      i18n.__('mail.issue.claim.confirmation.subject'),
      body,
    )
  })
}

const requestClaim = Promise.method(async ({ taskId, userId, comments, isApproved, token }) => {
  const task = await taskFetch({ id: taskId })
  const user = await models.User.findOne({
    where: {
      id: userId,
    },
  })

  if (isApproved) {
    return verifyIssueAndClaim(task, user, comments, token)
  } else {
    return sendConfirmationEmail(task, user, comments)
  }
})

module.exports = {
  requestClaim,
}
