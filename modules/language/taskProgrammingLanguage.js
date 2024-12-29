const Promise = require('bluebird')
const models = require('../../models')
const { Op } = require('sequelize')

module.exports = Promise.method(function taskLanguageSearch (searchParams) {
  return models.TaskProgrammingLanguage
    .findAll(
        {
            
          }
    )
    .then(data => {
      return data
    })
})
