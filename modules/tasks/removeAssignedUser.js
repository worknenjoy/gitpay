const Promise = require('bluebird')
const models = require('../../loading/loading')

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
        // SendMail.success(assign.User.email, 'It has been removed your assignment of this task on Bitpay', `
        //     <p>You were removed from this task <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> no Gitpay</p>
        //     <p>Isto quer dizer que você já pode começar. Fique de olho no prazo para conclusão, e após a tarefa for integrada você receberá o pagamento na sua conta cadastrada.</p>
        //   `)

          return task.dataValues
        })
    })
})
