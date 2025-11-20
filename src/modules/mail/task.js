const Signatures = require('./content')
const request = require('./request')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const enLocale = require('moment/locale/en-gb')
const i18n = require('i18n')
const constants = require('./constants')
const withTemplate = require('./template')
const models = require('../../models')
const emailTemplate = require('./templates/main-content')
const basicEmailTemplate = require('./templates/base-content')

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1)
}

// moment.locale('pt-br', ptLocale)

const setMomentLocale = (lang) => {
  if (lang === 'br') {
    moment.locale('pt-br', ptLocale)
  } else {
    moment.locale('en-gb', enLocale)
  }
}

const TaskMail = {
  new: (user, task) => {},
  send: (user, task) => Promise.resolve({}),
  notify: (user, data) => Promise.resolve({}),
  weeklyBounties: (data) => Promise.resolve({}),
  weeklyLatest: () => Promise.resolve({}),
  notifyPayment: () => Promise.resolve({}),
  messageAuthor: (user, task, message) => {},
}

if (constants.canSendEmail) {
  TaskMail.new = (user, task) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    setMomentLocale(language)
    user?.receiveNotifications &&
      request(
        to,
        i18n.__('mail.issue.me.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.mainContentEmailTemplate(
              i18n.__('mail.issue.new.intro'),
              i18n.__('mail.issue.new.subtitle1', {
                provider: capitalizeFirstLetter(task.provider),
                providerUrl: task.url,
                title: task.title,
                url: constants.taskUrl(task.id),
              }),
              i18n.__('mail.issue.new.callToActionText'),
              constants.taskUrl(task.id),
              i18n.__('mail.issue.new.subtitle2'),
              i18n.__('mail.issue.new.footerMessage'),
            ),
          },
        ],
        constants.notificationEmail,
      )
  }

  TaskMail.send = (user, data) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    const fullData = {
      ...data,
      content: {
        title: i18n.__('mail.issue.me.title'),
        subject: i18n.__('mail.issue.me.subject'),
        provider_action: i18n.__('mail.issue.provider.action'),
        call_to_action: i18n.__('mail.issue.me.calltoaction'),
        instructions: i18n.__('mail.issue.me.instructions'),
        docs: i18n.__('mail.issue.docs.title'),
        reason: i18n.__('mail.issue.reason'),
      },
    }
    return withTemplate(to, i18n.__('mail.issue.me.subject'), fullData)
  }

  TaskMail.notify = async (user, data) => {
    const allUsers = await models.User.findAll()
    const targetUsers = allUsers.filter((item) => item.email !== user.email)
    let mailList = []
    let subjectData = []
    let templateData = []
    targetUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(i18n.__('mail.issue.subject'))
      templateData.push({
        ...data,
        content: {
          title: i18n.__('mail.issue.title'),
          provider_action: i18n.__('mail.issue.provider.action'),
          call_to_action: i18n.__('mail.issue.calltoaction'),
          instructions: i18n.__('mail.issue.instructions'),
          docs: i18n.__('mail.issue.docs.title'),
          reason: i18n.__('mail.issue.reason'),
          subject: i18n.__('mail.issue.subject'),
        },
      })
    })
    return withTemplate(mailList, subjectData, templateData)
  }

  TaskMail.weeklyBounties = async (data) => {
    const allUsers = await models.User.findAll()
    let mailList = []
    let subjectData = []
    let templateData = []
    allUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(i18n.__('mail.issue.bounties.subject'))
      const tasks = data.tasks.map((d) => {
        const url = constants.taskUrl(d.id)
        const deadline = d.deadline
          ? `${moment(d.deadline).format('DD/MM/YYYY')} (${moment(d.deadline).fromNow()})`
          : d.deadline
        const title = d.title
        const value = d.value
        return { title, url, value, deadline }
      })
      templateData.push({
        tasks,
        content: {
          title: i18n.__('mail.issue.bounties.title'),
          provider_action: i18n.__('mail.issue.bounties.action'),
          call_to_action: i18n.__('mail.issue.bounties.calltoaction'),
          instructions: i18n.__('mail.issue.instructions'),
          docs: i18n.__('mail.issue.docs.title'),
          reason: i18n.__('mail.issue.reason'),
          subject: i18n.__('mail.issue.bounties.subject'),
        },
      })
    })
    return withTemplate(mailList, subjectData, templateData, 'bounties')
  }

  TaskMail.weeklyLatest = async (data) => {
    const allUsers = await models.User.findAll()
    let mailList = []
    let subjectData = []
    let templateData = []
    allUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(i18n.__('mail.issue.latest.subject'))
      const tasks = data.tasks.map((d) => {
        const url = constants.taskUrl(d.id)
        const deadline = d.deadline
          ? `${moment(d.deadline).format('DD/MM/YYYY')} (${moment(d.deadline).fromNow()})`
          : d.deadline
        const title = d.title
        const value = d.value > 0 ? '$' + d.value : i18n.__('mail.issue.noValue')
        return { title, url, value, deadline }
      })
      templateData.push({
        tasks,
        content: {
          title: i18n.__('mail.issue.latest.title'),
          provider_action: i18n.__('mail.issue.latest.action'),
          call_to_action: i18n.__('mail.issue.latest.calltoaction'),
          instructions: i18n.__('mail.issue.instructions'),
          docs: i18n.__('mail.issue.docs.title'),
          reason: i18n.__('mail.issue.reason'),
          subject: i18n.__('mail.issue.latest.subject'),
        },
      })
    })
    return withTemplate(mailList, subjectData, templateData, 'latest')
  }

  TaskMail.notifyPayment = async (user, data) => {
    const allUsers = await models.User.findAll()
    const targetUsers = allUsers.filter((item) => item.email !== user.email)
    let mailList = []
    let subjectData = []
    let templateData = []
    targetUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(
        i18n.__('mail.issue.payment.subject', { value: data.task.value, title: data.task.title }),
      )
      templateData.push({
        ...data,
        content: {
          title: i18n.__('mail.issue.payment.title', { value: data.task.value }),
          provider_action: i18n.__('mail.issue.provider.action'),
          call_to_action: i18n.__('mail.issue.calltoaction'),
          instructions: i18n.__('mail.issue.payment.instructions'),
          docs: i18n.__('mail.issue.docs.title'),
          reason: i18n.__('mail.issue.reason'),
          subject: i18n.__('mail.issue.payment.subject', {
            value: data.task.value,
            title: data.task.title,
          }),
        },
      })
    })
    return withTemplate(mailList, subjectData, templateData)
  }
  TaskMail.messageAuthor = (user, task, message) => {
    const senderName = user.name || user.username
    const senderEmail = user.email
    const to = task.User.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    setMomentLocale(language)
    request(
      to,
      i18n.__('mail.messageAuthor.subject'),
      [
        {
          type: 'text/html',
          value: basicEmailTemplate.baseContentEmailTemplate(`
           <p>${i18n.__('mail.messageAuthor.intro', { name: senderName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
${i18n.__('mail.messageAuthor.message', { message })}`),
        },
      ],
      senderEmail,
    )
  }
}

module.exports = TaskMail
