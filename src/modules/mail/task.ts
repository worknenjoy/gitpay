import request from './request'
import moment from 'moment'
import ptLocale from 'moment/locale/pt-br'
import enLocale from 'moment/locale/en-gb'
import i18n from 'i18n'
import * as constants from './constants'
import withTemplate from './template'
import models from '../../models'
import emailTemplate from './templates/main-content'
import basicEmailTemplate from './templates/base-content'

function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1)
}

const setMomentLocale = (lang: string) => {
  if (lang === 'br') {
    moment.locale('pt-br', ptLocale)
  } else {
    moment.locale('en-gb', enLocale)
  }
}

const TaskMail = {
  new: async (user: any, task: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    setMomentLocale(language)

    try {
      return await request(
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
                url: constants.taskUrl(task.id)
              }),
              i18n.__('mail.issue.new.callToActionText'),
              constants.taskUrl(task.id),
              i18n.__('mail.issue.new.subtitle2'),
              i18n.__('mail.issue.new.footerMessage')
            )
          }
        ],
        constants.notificationEmail
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  send: async (user: any, data: any) => {
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
        reason: i18n.__('mail.issue.reason')
      }
    }
    try {
      return await withTemplate(to, i18n.__('mail.issue.me.subject'), fullData)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  notify: async (user: any, data: any) => {
    try {
      const allUsers = await models.User.findAll()
      const targetUsers = allUsers.filter((item: any) => item.email !== user.email)
      let mailList: string[] = []
      let subjectData: string[] = []
      let templateData: any[] = []
      targetUsers.map((u: any, i: number) => {
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
            subject: i18n.__('mail.issue.subject')
          }
        })
      })
      return await withTemplate(mailList, subjectData, templateData)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  weeklyBounties: async (data: any) => {
    try {
      const allUsers = await models.User.findAll()
      let mailList: string[] = []
      let subjectData: string[] = []
      let templateData: any[] = []
      allUsers.map((u: any, i: number) => {
        const language = u.language || 'en'
        i18n.setLocale(language)
        mailList.push(u.email)
        subjectData.push(i18n.__('mail.issue.bounties.subject'))
        const tasks = data.tasks.map((d: any) => {
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
            subject: i18n.__('mail.issue.bounties.subject')
          }
        })
      })
      return await withTemplate(mailList, subjectData, templateData, 'bounties')
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  weeklyLatest: async (data: any) => {
    try {
      const allUsers = await models.User.findAll()
      let mailList: string[] = []
      let subjectData: string[] = []
      let templateData: any[] = []
      allUsers.map((u: any, i: number) => {
        const language = u.language || 'en'
        i18n.setLocale(language)
        mailList.push(u.email)
        subjectData.push(i18n.__('mail.issue.latest.subject'))
        const tasks = data.tasks.map((d: any) => {
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
            subject: i18n.__('mail.issue.latest.subject')
          }
        })
      })
      return await withTemplate(mailList, subjectData, templateData, 'latest')
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  notifyPayment: async (user: any, data: any) => {
    try {
      const allUsers = await models.User.findAll()
      const targetUsers = allUsers.filter((item: any) => item.email !== user.email)
      let mailList: string[] = []
      let subjectData: string[] = []
      let templateData: any[] = []
      targetUsers.map((u: any, i: number) => {
        const language = u.language || 'en'
        i18n.setLocale(language)
        mailList.push(u.email)
        subjectData.push(
          i18n.__('mail.issue.payment.subject', { value: data.task.value, title: data.task.title })
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
              title: data.task.title
            })
          }
        })
      })
      return await withTemplate(mailList, subjectData, templateData)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  messageAuthor: async (user: any, task: any, message: string) => {
    const senderName = user.name || user.username
    const senderEmail = user.email
    const to = task.User.email
    const language = user.language || 'en'

    i18n.setLocale(language)
    setMomentLocale(language)

    try {
      return await request(
        to,
        i18n.__('mail.messageAuthor.subject'),
        [
          {
            type: 'text/html',
            value: basicEmailTemplate.baseContentEmailTemplate(`
           <p>${i18n.__('mail.messageAuthor.intro', { name: senderName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
${i18n.__('mail.messageAuthor.message', { message })}`)
          }
        ],
        senderEmail
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default TaskMail

module.exports = TaskMail
