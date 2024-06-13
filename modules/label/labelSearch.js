const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function labelSearch (searchParams) {
  return models.Label
    .findAll(
      {
        where: searchParams || {},
        order: [
          ['name', 'ASC']
        ]
      }
    )
    .then(data => {
      return data
    })
})
