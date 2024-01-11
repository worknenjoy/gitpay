const Promise = require('bluebird')
const TransferMail = require('../mail/transfer')
const Transfer = require('../../models').Transfer
const Task = require('../../models').Task

module.exports = Promise.method(async function transferSearch(params = {}) {

  const tasks = await Task.findAll({
    where: {},
    include: [Transfer]
  })
  return tasks.filter(task => task.dataValues.userId === params.userId ).map(task => task.dataValues.Transfer)
})
