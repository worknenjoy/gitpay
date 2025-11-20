const Promise = require('bluebird')

const models = require('../../models')
const AssignMail = require('../mail/assign')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id }, { status }) {
  return models.Offer.update({ status }, { where: { id } }).then((u) => u)
})
