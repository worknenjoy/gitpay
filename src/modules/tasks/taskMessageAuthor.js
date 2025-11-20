const Promise = require('bluebird')
const models = require('../../models')
const TaskMail = require('../mail/task')
const i18n = require('i18n')

module.exports = Promise.method(function ({ id }, { message }, user) {
  return models.Task.findByPk(id, { include: [models.User] }).then((task) => {
    const taskUser = task.User.dataValues
    const language = taskUser.language || 'en'
    i18n.setLocale(language)
    TaskMail.messageAuthor(user.dataValues, task, message)
    return task
  })
})
