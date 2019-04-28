const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const dateFormat = require('dateformat')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const enLocale = require('moment/locale/en-gb')
const i18n = require('i18n')

const setMomentLocale = (lang) => {
  if (lang === 'br') {
    moment.locale('pt-br', ptLocale)
  }
  else {
    moment.locale('en-gb', enLocale)
  }
}

const AssignMail = {
  owner: (to, task, name, offer) => {},
  interested: (to, task, name) => {},
  assigned: (to, task) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  AssignMail.owner = (user, task, interested, offer) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    setMomentLocale(language)
    request(
      to,
      i18n.__('mail.assign.owner.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.assign.owner.hello')},</p>
          <p>${i18n.__('mail.assign.owner.main', { email: interested.email, name: interested.name || interested.username, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.assign.owner.suggest', { value: offer.value, suggestedDate: offer.suggestedDate ? offer.suggestedDate : i18n.__('mail.assigned.nodate'), learn: offer.learn ? i18n.__('mail.statement.yes') : i18n.__('mail.statement.no'), comment: offer.comment ? offer.comment : i18n.__('mail.offer.nocomment') })}</p>
          <p>${i18n.__('mail.assign.owner.sec')}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  AssignMail.interested = (user, task) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    setMomentLocale(language)
    request(
      to,
      i18n.__('mail.interested.owner.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.assign.owner.hello')},</p>
          <p>${i18n.__('mail.interested.main', { email: user.email, name: user.name || user.username, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.interested.owner.sec')}</p>
          <p>${Signatures.sign(language)}</p>`
        },
      ]
    )
  }

  AssignMail.assigned = (user, task) => {
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    i18n.setLocale(language)
    setMomentLocale(language)
    request(
      to,
      i18n.__('mail.assigned.subject'),
      [
        {
          type: 'text/html',
          value: `
           <p>${i18n.__('mail.assigned.hello', { name: name })}</p>
           <p>${i18n.__('mail.assigned.main', { name: name, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
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
