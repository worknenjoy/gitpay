const Promise = require('bluebird')
const transfer = require('../../models/transfer')
const Transfer = require('../../models').Transfer
const Task = require('../../models').Task
const User = require('../../models').User

module.exports = Promise.method(async function transferSearch(params = {}) {
  let transfers = []
  if (params.userId) {
    transfers = await Transfer.findAll({
      where: { userId: params.userId },
      include: [
        Task,
        {
          model: User,
          as: 'User',
        },
      ],
    })
  }
  if (params.to) {
    transfers = await Transfer.findAll({
      where: { to: params.to },
      include: [
        Task,
        {
          model: User,
          as: 'User',
        },
      ],
    })
  }
  return transfers
})
