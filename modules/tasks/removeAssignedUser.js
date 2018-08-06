const Promise = require('bluebird')

const models = require('../../loading/loading')
const SendMail = require('../mail/mail')

module.exports = Promise.method(function ({ id }, { message }) {
  return models.Task
    .findById(id, { include: [ models.User, models.Order, models.Assign ] })
    .then(task => {
      const assignedId = task.assigned

      if (!assignedId) throw new Error('The Task doesn\'t have an assigned user.')

      const assignedPromise = models.Assign
        .findById(assignedId, { include: [ models.User ] })

      // Unset assigned value,
      const saveTaskPromise = task.set('assigned', null).save()

      return Promise.all([assignedPromise, saveTaskPromise])
        .then(([ assign ]) => {
          SendMail.success(
            assign.User.email,
            'Você foi removido de uma tarefa no Gitpay',
            `<p>Você foi removido da tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> no Gitpay</p>
            <p>O dono da tarefa deixou o seguinte mensagem para você:</p>
            <p>${message}</p>`
          )

          return task.dataValues
        })
    })
})
