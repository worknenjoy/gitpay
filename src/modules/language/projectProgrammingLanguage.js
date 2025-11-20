const Promise = require('bluebird')
const models = require('../../models')
const { Op } = require('sequelize')

module.exports = Promise.method(function projectLanguageSearch(searchParams) {
  return models.ProjectProgrammingLanguage.findAll({}).then((data) => {
    return data
  })
})
