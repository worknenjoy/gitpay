const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')
const withTemplate = require('./template')

moment.locale('pt-br', ptLocale)

const TaskMail = {
  send: (user, data) => {
    return true
  }
}

TaskMail.send = (user, data) => {
  const to = user.email
  const language = user.language || 'en'
  i18n.setLocale(language)
  const fullData = { ...data,
    content: {
      title: i18n.__('mail.task.me.title'),
      provider_action: i18n.__('mail.task.provider.action'),
      call_to_action: i18n.__('mail.task.me.calltoaction'),
      instructions: i18n.__('mail.task.me.instructions'),
      docs: i18n.__('mail.task.docs.title'),
      reason: i18n.__('mail.task.reason')
    }
  }
  return withTemplate(
    to,
    i18n.__('mail.task.me.subject'),
    fullData
  )
}

module.exports = TaskMail
