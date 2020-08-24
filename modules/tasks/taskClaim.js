const Promise = require('bluebird')
const taskUpdate = require('./taskUpdate')
const models = require('../../models')
const SendMail = require('../mail/mail')
const i18n = require('i18n')
const taskFetch = require('./taskFetch')

const sendConfirmationEmail = (task, user, comments) => {
  const approveURL = `${process.env.FRONTEND_HOST}/#/task/${task.id}/claim/${comments}`
  const language = user.language || 'en'
  i18n.setLocale(language)

  const body = `${i18n.__('mail.task.claim.request.body', {
    title: task.title,
    url: task.url,
    approveURL: approveURL
  })}`

  return SendMail.success(
    { email: user.email, language },
    i18n.__('mail.task.claim.request.subject'), body
  )
}

const verifyIssueAndClaim = async (task, user, comments) => {
  const language = user.language || 'en'
  i18n.setLocale(language)

  if (task.provider === 'github' && user.provider === task.provider) {
    if (task.metadata.user === user.provider_username) {
      const taskUser = task.user

      // Update task
      await taskUpdate({ id: task.id, userId: user.id })

      const body = `${i18n.__('mail.task.claim.confirmation.body', {
        title: task.title,
        url: task.url,
        comments: comments
      })}`

      return SendMail.success(
        { email: taskUser.email, language },
        i18n.__('mail.task.claim.confirmation.subject'), body
      )
    }
    else {
      throw new Error('user_is_not_the_owner')
    }
  }
  else {
    throw new Error('invalid_provider')
  }
}

const requestClaim = Promise.method(async ({ taskId, userId, comments, isApproved }) => {
  const task = await taskFetch({ id: taskId })
  const user = await models.User.findOne({
    where: {
      id: userId
    }
  })

  if (isApproved) {
    return verifyIssueAndClaim(task, user, comments)
  }
  else {
    return sendConfirmationEmail(task, user, comments)
  }
})

module.exports = {
  requestClaim
}
