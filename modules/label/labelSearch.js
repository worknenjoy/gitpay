const Promise = require('bluebird')
const models = require('../../models')
const { Op } = require('sequelize')

module.exports = Promise.method(function labelSearch (searchParams) {
  return models.Label
    .findAll(
      {
        where: searchParams || {},
        order: [
          ['id', 'DESC']
        ]
      }
    )
    .then(data => {
      console.log('data', data)
      return data
    })
})
