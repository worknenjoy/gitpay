const Promise = require('bluebird')

const models = require('../../models')
const AssignMail = require('../mail/assign')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id }, { interested, message }, user) {
  return models.Task
    .findById(id, { include: [models.User, models.Order, { model: models.Assign, include: [models.User] }] })
    .then(task => {
      // eslint-disable-next-line no-console
      const targetInterested = task.dataValues.Assigns.filter(a => a.id === interested)[0]
      const taskUser = task.User.dataValues
      const language = taskUser.language || 'en'
      i18n.setLocale(language)
      AssignMail.messageInterested(
        targetInterested.User.dataValues,
        task.dataValues,
        message,
        user
      )
      return task
    })
})
