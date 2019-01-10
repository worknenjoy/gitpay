const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const i18n = require('i18n')
const withTemplate = require('./template')
const models = require('../../loading/loading')

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
      subject: i18n.__('mail.task.me.subject'),
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

TaskMail.notify = async (user, data) => {
  const allUsers = await models.User.findAll()
  const targetUsers = allUsers.filter(item => item.email !== user.email)
  let mailList = []
  let subjectData = []
  let templateData = []
  targetUsers.map((u, i) => {
    const language = u.language || 'en'
    i18n.setLocale(language)
    mailList.push(u.email)
    subjectData.push(i18n.__('mail.task.subject'))
    templateData.push({ ...data,
      content: {
        title: i18n.__('mail.task.title'),
        provider_action: i18n.__('mail.task.provider.action'),
        call_to_action: i18n.__('mail.task.calltoaction'),
        instructions: i18n.__('mail.task.instructions'),
        docs: i18n.__('mail.task.docs.title'),
        reason: i18n.__('mail.task.reason'),
        subject: i18n.__('mail.task.subject')
      } })
  })
  return withTemplate(
    mailList,
    subjectData,
    templateData
  )
}

module.exports = TaskMail
