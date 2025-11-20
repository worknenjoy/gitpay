const Promise = require('bluebird')

const models = require('../../models')
const AssignMail = require('../mail/assign')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id }, { offerId, message }, user) {
  return models.Task.findByPk(id, {
    include: [
      models.User,
      models.Order,
      { model: models.Offer, include: [models.User] },
      { model: models.Assign, include: [models.User] },
    ],
  }).then((task) => {
    const targetInterested = task.dataValues.Offers.filter((o) => o.id === offerId)[0]
    const taskUser = task.User.dataValues
    const language = taskUser.language || 'en'
    i18n.setLocale(language)
    AssignMail.messageInterested(targetInterested.User.dataValues, task.dataValues, message, user)
    return task
  })
})
