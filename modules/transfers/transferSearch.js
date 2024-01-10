const Promise = require('bluebird')
const Transfer = require('../../models').Transfer
const Task = require('../../models').Task

module.exports = Promise.method(async function transferSearch(params = {}) {
  const transfers = await Transfer.findAll({
    where: params,
    include: [Task]
  })
  console.log('transfer on modulle', transfers)
  return transfers
})
