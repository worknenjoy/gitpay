const Promise = require('bluebird')
const models = require('../../loading/loading')
const SendMail = require('../mail/mail')
const i18n = require('i18n')

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
          const user = assign.User
          const language = user.language || 'en'
          i18n.setLocale(language)
          SendMail.success(
            assign.User,
            i18n.__('mail.assign.remove.subject'),
            i18n.__('mail.assign.remove.message', { message: message, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })
          )
          return task.dataValues
        })
    })
})
