const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function userTasks(id) {
  // finds all accepted assigns for user
  return models.Assign.findAll({
    attributes: ['TaskId'],
    where: {
      userId: id,
      status: 'accepted'
    }
  })
    .then((assigns) => {
      /*
        finds completed tasks for each assigns and returns
        an array of promises to be resolved by .all()
      */
      return assigns.map((a) => {
        return models.Task.findOne({
          attributes: ['value', 'paid'],
          where: {
            id: a.dataValues.TaskId,
            status: 'closed'
          }
        })
          .then((res) => {
            if (res !== null) {
              return res.dataValues
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Error at userTasks', error)
            throw error
          })
      })
    })
    .then((res) => {
      const filteredRes = res.filter((r) => r !== undefined)
      let bounties = 0
      // If the task is paid adds the value to "bounties"
      filteredRes.forEach((t) => {
        if (t.paid === true) {
          bounties += Number(t.value)
        }
      })
      // return object containing number of tasks completed and total bounties collected.
      return {
        tasks: filteredRes.length.toString(),
        bounties: bounties.toString()
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('Error at userTasks', error)
      throw error
    })
})
