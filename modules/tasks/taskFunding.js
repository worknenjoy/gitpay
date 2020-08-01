const Promise = require('bluebird')

const models = require('../../models')
const SendMail = require('../mail/mail')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id }, { comment, email, suggestedValue, suggestedDate, username }) {
  return models.Task
    .findById(id, { include: [ models.User, models.Order, models.Assign ] })
    .then(task => {
      const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
      const user = task.User.dataValues
      const language = user.language || 'en'
      i18n.setLocale(language)
      SendMail.success(
        { email, language },
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
    })
})
