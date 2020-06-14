const Signatures = require('./content')
const request = require('./request')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const enLocale = require('moment/locale/en-gb')
const i18n = require('i18n')
const constants = require('./constants')
const withTemplate = require('./template')
const models = require('../../models')

// moment.locale('pt-br', ptLocale)

const setMomentLocale = (lang) => {
  if (lang === 'br') {
    moment.locale('pt-br', ptLocale)
  }
  else {
    moment.locale('en-gb', enLocale)
  }
}

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

const TaskMail = {
  send: (user, data) => Promise.resolve({}),
  notify: (user, data) => Promise.resolve({}),
  weeklyBounties: (data) => Promise.resolve({}),
  weeklyLatest: () => Promise.resolve({}),
  notifyPayment: () => Promise.resolve({}),
  weeklyDigest: (data) => Promise.resolve({}),
  messageAuthor: (user, task, message) => Promise.resolve({})
}

if (constants.canSendEmail) {
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

  TaskMail.weeklyBounties = async (data) => {
    const allUsers = await models.User.findAll()
    let mailList = []
    let subjectData = []
    let templateData = []
    allUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(i18n.__('mail.task.bounties.subject'))
      const tasks = data.tasks.map(d => {
        const url = constants.taskUrl(d.id)
        const deadline = d.deadline ? `${moment(d.deadline).format('DD/MM/YYYY')} (${moment(d.deadline).fromNow()})` : d.deadline
        const title = d.title
        const value = d.value
        return { title, url, value, deadline }
      })
      templateData.push({
        tasks,
        content: {
          title: i18n.__('mail.task.bounties.title'),
          provider_action: i18n.__('mail.task.bounties.action'),
          call_to_action: i18n.__('mail.task.bounties.calltoaction'),
          instructions: i18n.__('mail.task.instructions'),
          docs: i18n.__('mail.task.docs.title'),
          reason: i18n.__('mail.task.reason'),
          subject: i18n.__('mail.task.bounties.subject')
        } })
    })
    return withTemplate(
      mailList,
      subjectData,
      templateData,
      'bounties'
    )
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
      subjectData.push(i18n.__('mail.task.latest.subject'))
      const tasks = data.tasks.map(d => {
        const url = constants.taskUrl(d.id)
        const deadline = d.deadline ? `${moment(d.deadline).format('DD/MM/YYYY')} (${moment(d.deadline).fromNow()})` : d.deadline
        const title = d.title
        const value = d.value > 0 ? ('$' + d.value) : i18n.__('mail.task.noValue')
        return { title, url, value, deadline }
      })
      templateData.push({
        tasks,
        content: {
          title: i18n.__('mail.task.latest.title'),
          provider_action: i18n.__('mail.task.latest.action'),
          call_to_action: i18n.__('mail.task.latest.calltoaction'),
          instructions: i18n.__('mail.task.instructions'),
          docs: i18n.__('mail.task.docs.title'),
          reason: i18n.__('mail.task.reason'),
          subject: i18n.__('mail.task.latest.subject')
        } })
    })
    return withTemplate(
      mailList,
      subjectData,
      templateData,
      'latest'
    )
  }

  TaskMail.notifyPayment = async (user, data) => {
    const allUsers = await models.User.findAll()
    const targetUsers = allUsers.filter(item => item.email !== user.email)
    let mailList = []
    let subjectData = []
    let templateData = []
    targetUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(i18n.__('mail.task.payment.subject', { value: data.task.value, title: data.task.title }))
      templateData.push({ ...data,
        content: {
          title: i18n.__('mail.task.payment.title', { value: data.task.value }),
          provider_action: i18n.__('mail.task.provider.action'),
          call_to_action: i18n.__('mail.task.calltoaction'),
          instructions: i18n.__('mail.task.payment.instructions'),
          docs: i18n.__('mail.task.docs.title'),
          reason: i18n.__('mail.task.reason'),
          subject: i18n.__('mail.task.payment.subject', { value: data.task.value, title: data.task.title })
        } })
    })
    return withTemplate(
      mailList,
      subjectData,
      templateData
    )
  }
  TaskMail.messageAuthor = (user, task, message) => {
    const senderName = user.name
    const senderEmail = user.email
    const to = task.User.email
    const language = user.language || 'en'
    const name = user.name || user.username
    i18n.setLocale(language)
    setMomentLocale(language)
    request(
      to,
      i18n.__('mail.messageAuthor.subject'),
      [
        {
          type: 'text/html',
          value: `
           <p>${i18n.__('mail.hello', { name: name })}</p>
           <p>${i18n.__('mail.messageAuthor.intro', { name: senderName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
${i18n.__('mail.messageAuthor.message', { message })} <p>${Signatures.sign(language)}</p>`
        }],
      senderEmail
    )
  }
  TaskMail.weeklyDigest = async (data) => {
    const allUsers = await models.User.findAll()
    let mailList = []
    let subjectData = []
    let templateData = []
    allUsers.map((u, i) => {
      const language = u.language || 'en'
      i18n.setLocale(language)
      mailList.push(u.email)
      subjectData.push(i18n.__('mail.task.digest.subject'))
      const tasks = data.tasks.map(d => {
        const url = constants.taskUrl(d.id)
        const deadline = d.deadline ? `${moment(d.deadline).format('DD/MM/YYYY')} (${moment(d.deadline).fromNow()})` : d.deadline
        const title = d.title
        const value = d.value > 0 ? ('$' + d.value) : i18n.__('mail.task.noValue')
        return { title, url, value, deadline }
      })
      templateData.push({
        tasks,
        content: {
          title: i18n.__('mail.task.digest.title'),
          provider_action: i18n.__('mail.task.latest.action'),
          call_to_action: i18n.__('mail.task.latest.calltoaction'),
          instructions: i18n.__('mail.task.instructions'),
          docs: i18n.__('mail.task.docs.title'),
          reason: i18n.__('mail.task.reason'),
          subject: i18n.__('mail.task.digest.subject')
        } })
    })
    return withTemplate(
      mailList,
      subjectData,
      templateData,
      'latest'
    )
  }
}

module.exports = TaskMail
