const Promise = require('bluebird')
const models = require('../../models')
const SendMail = require('../mail/mail')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id, userId }, { message }) {
  return models.Task
    // we need to accept only the assigned user and the task user, as well members
    .findOne({
      where: {
        id
        // userId
      }
    }, {
      include: [ models.User, models.Order, models.Assign ]
    })
    .then(async task => {
      const assignedId = task.assigned

      if (!assignedId) throw new Error('The Task doesn\'t have an assigned user.')

      const assignedPromise = await models.Assign
        .findById(assignedId, { include: [ models.User ] })

      const author = await models.User
        .findById(task.userId)

      // Unset assigned value,
      const saveTaskPromise = task.set('assigned', null).save()
      const changeStatusPromise = task.set('status', 'open').save()
      const changeStatusAssign = assignedPromise.set('status', 'pending').save()

      return Promise.all([assignedPromise, saveTaskPromise, changeStatusPromise, changeStatusAssign])
        .then(([ assign ]) => {
          const user = assign.User
          const language = user.language || 'en'
          i18n.setLocale(language)
          SendMail.success(
            assign.User,
            i18n.__('mail.assign.remove.subject'),
            i18n.__('mail.assign.remove.message', { message, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`, title: task.title })
          )

          const ownerUser = author
          const ownerlanguage = ownerUser.language || 'en'
          i18n.setLocale(ownerlanguage)
          SendMail.success(
            ownerUser,
            i18n.__('mail.assign.remove.owner.subject'),
            i18n.__('mail.assign.remove.owner.message', { title: task.title, user: user.name || user.username, email: user.email, message: message, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })
          )
          return task.dataValues
        })
    })
})
