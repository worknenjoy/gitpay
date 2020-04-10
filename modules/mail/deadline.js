const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const dateFormat = require('dateformat')
const moment = require('moment')
const i18n = require('i18n')
const ptLocale = require('moment/locale/pt-br')
const enLocale = require('moment/locale/en-gb')

const locales = {
  en: {
    label: 'en-gb',
    file: enLocale
  },
  br: {
    label: 'pt-br',
    file: ptLocale
  }
}

const DeadlineMail = {
  update: (to, task, name) => {},
  daysLeft: (to, task, name) => {},
  rememberAssigned: (to, task, name) => {},
  deadlineEndAssigned: (to, task, name) => {},
  deadlineEndOwner: (to, task, name) => {},
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
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p>
${i18n.__('mail.assigned.update.intro', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}
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
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p> ${i18n.__('mail.assigned.update.intro', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })} ${i18n.__('mail.assigned.update.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
          <p>${Signatures.sign(language)}</p>`
        }
      ]
    )
  }

  DeadlineMail.rememberAssigned = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.deadline.remember.subject', { deadline: moment(task.deadline).fromNow() }),
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p> ${i18n.__('mail.deadline.remember.intro', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })} ${i18n.__('mail.deadline.remember.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })} <p>${Signatures.sign(language)}</p>` }
      ]
    )
  }

  DeadlineMail.deadlineEndAssigned = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    const url = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const urlInterested = `${process.env.FRONTEND_HOST}/#/task/${task.id}/interested`
    // const urlExtend = `${process.env.FRONTEND_HOST}/task/${task.id}/interested/extend`
    i18n.setLocale(language)
    moment.locale(locales[language].label, locales[language].file)
    request(
      to,
      i18n.__('mail.deadline.end.subject', { deadline: moment(task.deadline).fromNow() }),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.deadline.end.hello', { name: name })}</p>
${i18n.__('mail.deadline.end.intro', { url, title: task.title })}
${i18n.__('mail.deadline.end.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
${Signatures.buttons(language, {
    primary: {
      label: 'mail.deadline.end.button.primary',
      url: urlInterested
    },
    secondary: {
      label: 'mail.deadline.end.button.secondary',
      url: task.url
    }
  })}
          <p>${Signatures.sign(language)}</p>`
        }
      ]
    )
  }

  DeadlineMail.deadlineEndOwner = (user, task, name) => {
    const to = user.email
    const language = user.language || 'en'
    const url = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const urlInterested = `${process.env.FRONTEND_HOST}/#/task/${task.id}/interested`
    // const urlExtend = `${process.env.FRONTEND_HOST}/task/${task.id}/interested/extend`
    i18n.setLocale(language)
    moment.locale(locales[language].label, locales[language].file)
    request(
      to,
      i18n.__('mail.deadline.end.owner.subject', { deadline: moment(task.deadline).fromNow() }),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.deadline.end.owner.hello', { name: name })}</p>
${i18n.__('mail.deadline.end.owner.intro', { url, title: task.title })}
${i18n.__('mail.deadline.end.owner.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
${Signatures.buttons(language, {
    primary: {
      label: 'mail.deadline.end.owner.button.primary',
      url: urlInterested
    },
    secondary: {
      label: 'mail.deadline.end.owner.button.secondary',
      url: task.url
    }
  })}
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
