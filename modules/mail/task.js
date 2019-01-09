const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')
const withTemplate = require('./template')

moment.locale('pt-br', ptLocale)

const TaskMail = {
  send: (user, content, data) => {
    return true
  }
}

TaskMail.send = (user, content, data) => {
  const to = user.email
  const language = user.language || 'en'
  const fullData = { ...data,
    content: {
      title: i18n.__('mail.task.me.title'),
      provider_action: i18n.__('mail.task.provider.action'),
      call_to_action: i18n.__('mail.task.calltoaction'),
      instructions: i18n.__('mail.task.instructions'),
      docs: i18n.__('mail.task.docs.title'),
      reason: i18n.__('mail.tasks.reason')
    }
  }
  i18n.setLocale(language)
  return withTemplate(
    to,
    i18n.__('mail.task.me.subject'),
    content,
    fullData
  )
}

module.exports = TaskMail
