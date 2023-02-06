const Promise = require('bluebird')

const models = require('../../models')
const SendMail = require('../mail/mail')
const i18n = require('i18n')
const jwt = require('jsonwebtoken')
const { reportEmail } = require('../mail/constants')

module.exports = Promise.method(function ({ id }, { task, reason, baseUrl }) {
  const token = jwt.sign(id, process.env.SECRET_PHRASE)
  const title = task.title.replace(/\s/g, '-')
  const formattedReason = reason.replace(/\s/g, '-')
  const userId = task.user ? task.user.id : ''
  const approveURL = baseUrl + '/tasks/delete/' + id + '/' + userId + '?title=' + title + '&reason=' + formattedReason + '&token=' + token
  return models.Task
    .findById(id, { include: [ models.User, models.Order, models.Assign ] })
    .then(task => {
      const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
      i18n.setLocale('en')
      SendMail.success(
        { email: reportEmail, language: 'en' },
        i18n.__('mail.report.send.action'),
        `${i18n.__('mail.report.send.message', {
          title: task.title,
          url: taskUrl,
          approveURL: approveURL,
          selectedReason: reason
        })}
        `
      )
    })
})
