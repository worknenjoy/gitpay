const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const dateFormat = require('dateformat')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')

moment.locale('pt-br', ptLocale)

const DeadlineMail = {
  update: (to, task, name) => {},
  daysLeft: (to, task, name) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  DeadlineMail.update = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.deadline.update.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${i18n.__('mail.assigned.hello', { name: name })}</p>
          ${i18n.__('mail.assigned.update.intro', { url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}
          ${i18n.__('mail.assigned.update.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  DeadlineMail.daysLeft = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.deadline.daysLeft.subject', { deadline: moment(task.deadline).fromNow() }),
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${i18n.__('mail.assigned.hello', { name: name })}</p>
          ${i18n.__('mail.assigned.update.intro', { url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}
          ${i18n.__('mail.assigned.update.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
          <p>${Signatures.sign(language)}</p>`
        }
      ]
    )
  }

  DeadlineMail.error = (msg) => {
    request(
      constants.notificationEmail,
      i18n.__('mail.deadline.update.error'),
      [
        {
          type: 'text/html',
          value: msg
        },
      ]
    )
  }
}

module.exports = DeadlineMail
