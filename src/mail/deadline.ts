import Signatures from './content'
import request from './request'
import * as constants from './constants'
// @ts-ignore - dateformat has no proper type definitions
import dateFormat from 'dateformat'
// @ts-ignore - moment locale imports
import moment from 'moment'
import i18n from 'i18n'
// @ts-ignore - moment locale imports
import ptLocale from 'moment/locale/pt-br'
// @ts-ignore - moment locale imports
import enLocale from 'moment/locale/en-gb'

const locales: { [key: string]: { label: string; file: any } } = {
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
  update: async (user: any, task: any, name: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(to, i18n.__('mail.deadline.update.subject'), [
        {
          type: 'text/html',
          value: `
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p>
${i18n.__('mail.assigned.update.intro', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}
${i18n.__('mail.assigned.update.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n.__('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
          <p>${Signatures.sign(language)}</p>`
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  daysLeft: async (user: any, task: any, name: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(
        to,
        i18n.__('mail.deadline.daysLeft.subject', { deadline: moment(task.deadline).fromNow() }),
        [
          {
            type: 'text/html',
            value: `
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p> ${i18n.__('mail.assigned.update.intro', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })} ${i18n.__('mail.assigned.update.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n.__('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
          <p>${Signatures.sign(language)}</p>`
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  rememberAssigned: async (user: any, task: any, name: string) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)

    try {
      return await request(
        to,
        i18n.__('mail.deadline.remember.subject', { deadline: moment(task.deadline).fromNow() }),
        [
          {
            type: 'text/html',
            value: `
          <p>Olá ${i18n.__('mail.hello', { name: name })}</p> ${i18n.__('mail.deadline.remember.intro', { title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })} ${i18n.__('mail.deadline.remember.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n.__('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })} <p>${Signatures.sign(language)}</p>`
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  deadlineEndAssigned: async (user: any, task: any, name: string) => {
    const to = user.email
    const language = user.language || 'en'
    const url = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const urlInterested = `${process.env.FRONTEND_HOST}/#/task/${task.id}/interested`
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    moment.locale(locales[language].label, locales[language].file)

    try {
      return await request(
        to,
        i18n.__('mail.deadline.end.subject', { deadline: moment(task.deadline).fromNow() }),
        [
          {
            type: 'text/html',
            value: `
          <p>${i18n.__('mail.deadline.end.hello', { name: name })}</p>
${i18n.__('mail.deadline.end.intro', { url, title: task.title })}
${i18n.__('mail.deadline.end.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n.__('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
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
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  deadlineEndOwner: async (user: any, task: any, name: string) => {
    const to = user.email
    const language = user.language || 'en'
    const url = `${process.env.FRONTEND_HOST}/#/task/${task.id}`
    const urlInterested = `${process.env.FRONTEND_HOST}/#/task/${task.id}/interested`
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    moment.locale(locales[language].label, locales[language].file)

    try {
      return await request(
        to,
        i18n.__('mail.deadline.end.owner.subject', { deadline: moment(task.deadline).fromNow() }),
        [
          {
            type: 'text/html',
            value: `
          <p>${i18n.__('mail.deadline.end.owner.hello', { name: name })}</p>
${i18n.__('mail.deadline.end.owner.intro', { url, title: task.title })}
${i18n.__('mail.deadline.end.owner.message', { deadlineFromNow: task.deadline ? moment(task.deadline).fromNow() : i18n.__('mail.assigned.anytime'), deadline: task.deadline ? dateFormat(task.deadline, constants.dateFormat) : i18n.__('mail.assigned.nodate'), url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}` })}
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
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  error: async (msg: string) => {
    // This sends to notificationEmail for administrative purposes,
    // not to end users, so no user preference check is needed
    i18n.setLocale('en')
    try {
      return await request(constants.notificationEmail, i18n.__('mail.deadline.update.error'), [
        {
          type: 'text/html',
          value: msg
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default DeadlineMail

module.exports = DeadlineMail
