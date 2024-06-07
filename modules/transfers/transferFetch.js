const Promise = require('bluebird')
const transfer = require('../../models/transfer')
const Transfer = require('../../models').Transfer
const Task = require('../../models').Task
const User = require('../../models').User

module.exports = Promise.method(async function transferFetch (id) {
  if (id) {
    const transfer = await Transfer.findOne({
      where: { id },
      include: [ Task, User ]
    })
    return transfer
  }
})
