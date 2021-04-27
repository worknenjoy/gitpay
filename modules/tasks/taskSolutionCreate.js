const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSolutionCreate (taskSolutionParams) {
  return models.TaskSolution.create(taskSolutionParams)
})
