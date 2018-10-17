const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const dateFormat = require('dateformat')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')

moment.locale('pt-br', ptLocale)

const AssignMail = {
  owner: (to, task, name) => {},
  interested: (to, task, name) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  AssignMail.owner = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.assign.owner.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.assign.owner.hello')},</p>
          <p>${i18n.__('mail.assign.owner.main', {name: name, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}`})}</p>
          <p>${i18n.__('mail.assign.owner.sec')}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  AssignMail.interested = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.interested.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.assign.owner.hello')},</p>
          <p>${i18n.__('mail.interested.main', {name: name, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}`})}</p>
          <p>${i18n.__('mail.interested.owner.sec')}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  AssignMail.assigned = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.assigned.subject'),
      [
        {
          type: 'text/html',
          value: `
           <p>Olá ${i18n.__('mail.assigned.hello', {name: name})}</p>
           <p>Olá ${i18n.__('mail.assigned.main', {name: name, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`})}</p>
           ${i18n.__('mail.assigned.message', {
             deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'),
             deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n.__('mail.assigned.anytime')
            })}
           <p>${Signatures.sign(language)}</p>`

        }
      ]
    )
  }

  AssignMail.error = (msg) => {
    request(
      constants.notificationEmail,
      i18n.__('mail.assigned.error'),
      [
        {
          type: 'text/html',
          value: msg
        },
      ]
    )
  }
}

module.exports = AssignMail
