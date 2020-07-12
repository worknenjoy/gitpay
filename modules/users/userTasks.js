const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function userTasks (id) {
  return models.Assign
    .findAll({
      attributes: ['TaskId'],
      where: {
        userId: id,
        status: 'accepted'
      }
    }).then(assigns => {
      return assigns.map(a => {
        return models.Task
          .findOne({
            attributes: ['value', 'paid'],
            where: {
              id: a.dataValues.TaskId,
              status: 'closed'
            }
          }).then(res => {
            if (res !== null) {
              return res.dataValues
            }
          }).catch(error => {
            // eslint-disable-next-line no-console
            console.log('Error at userTasks', error)
            throw error
          })
      })
    }).all().then(res => {
      let bounties = 0
      res.forEach(t => {
        if (t !== undefined && t.paid === true) {
          bounties += Number(t.value)
        }
      })
      return {
        tasks: res.filter(t => t === null).length.toString(),
        bounties: bounties.toString()
      }
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log('Error at userTasks', error)
      throw error
    })
})
