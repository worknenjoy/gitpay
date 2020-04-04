const Promise = require('bluebird')

const models = require('../../models')
const AssignMail = require('../mail/assign')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id }, { interested, message, sender }) {
  // eslint-disable-next-line no-console
  return models.Task
    .findById(id, { include: [models.User, models.Order, { model: models.Assign, include: [models.User] }] })
    .then(task => {
      // eslint-disable-next-line no-console
      const targetInterested = task.dataValues.Assigns.filter(a => a.id === interested)[0]
      const user = task.User.dataValues
      const language = user.language || 'en'
      i18n.setLocale(language)
      AssignMail.messageInterested(
        targetInterested.User.dataValues,
        task.dataValues,
        message,
        sender
      )
      return task
    })
})
