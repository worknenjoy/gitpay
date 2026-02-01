import Signatures from './content'
import request from './request'
import * as constants from './constants'
// @ts-ignore - dateformat has no proper type definitions
import dateFormat from 'dateformat'
// @ts-ignore - moment locale imports
import moment from 'moment'
// @ts-ignore - moment locale imports
import ptLocale from 'moment/locale/pt-br'
// @ts-ignore - moment locale imports
import enLocale from 'moment/locale/en-gb'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'

const setMomentLocale = (lang: string) => {
  if (lang === 'br') {
    moment.locale('pt-br', ptLocale)
  } else {
    moment.locale('en-gb', enLocale)
  }
}

const AssignMail = {
  owner: {
    interested: async (user: any, task: any, interested: any, offer: any) => {
      const to = user.email
      const language = user.language || 'en'
      const receiveNotifications = user?.receiveNotifications

      if (!receiveNotifications) {
        return
      }

      i18n.setLocale(language)
      setMomentLocale(language)

      try {
        return await request(to, i18n.__('mail.assign.owner.subject'), [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(
              i18n.__('mail.assign.owner.hello'),
              `<p>${i18n.__('mail.assign.owner.main', { email: interested.email, name: interested.name || interested.username, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.assign.owner.suggest', { value: offer.value, suggestedDate: offer.suggestedDate ? offer.suggestedDate : i18n.__('mail.assigned.nodate'), learn: offer.learn ? i18n.__('mail.statement.yes') : i18n.__('mail.statement.no'), comment: offer.comment ? offer.comment : i18n.__('mail.offer.nocomment') })}</p>
          <p>${i18n.__('mail.assign.owner.sec')}</p>
${Signatures.buttons(language, {
                primary: {
                  label: 'mail.assign.owner.button.offer',
                  title: task.title,
                  url: `${process.env.FRONTEND_HOST}/#/profile/task/${task.id}/offers`
                }
              })}`
            )
          }
        ])
      } catch (error) {
        console.error('Error sending email:', error)
      }
    },

    assigned: async (user: any, task: any, interested: any) => {
      const to = user.email
      const language = user.language || 'en'
      const name = user.name || user.username
      const assignedName = interested.name || interested.username
      const receiveNotifications = user?.receiveNotifications

      if (!receiveNotifications) {
        return
      }

      const deadline = task.deadline
        ? dateFormat(task.deadline, constants.dateFormat)
        : i18n.__('mail.assigned.nodate')
      const deadlineFromNow = task.deadline
        ? moment(task.deadline).fromNow()
        : i18n.__('mail.assigned.anytime')

      i18n.setLocale(language)
      setMomentLocale(language)

      try {
        return await request(to, i18n.__('mail.assign.owner.assigned.subject', { assignedName }), [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(
              i18n.__('mail.hello', { name }),
              `<p>${i18n.__('mail.assign.owner.assigned.main', { assignedName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.assign.owner.assigned.deadline.date', { date: deadline })}</p>
          <p>${i18n.__('mail.assign.owner.assigned.deadline.days', { days: deadlineFromNow })}</p>
          <p>${i18n.__('mail.assign.owner.assigned.instructions')}</p>`
            )
          }
        ])
      } catch (error) {
        console.error('Error sending email:', error)
      }
    }
  },

  interested: async (user: any, task: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    setMomentLocale(language)

    try {
      return await request(to, i18n.__('mail.interested.owner.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            i18n.__('mail.assign.owner.hello'),
            `<p>${i18n.__('mail.interested.main', { email: user.email, name: user.name || user.username, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
          <p>${i18n.__('mail.interested.owner.sec')}</p>
          `
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  assigned: async (user: any, task: any) => {
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    setMomentLocale(language)

    try {
      return await request(to, i18n.__('mail.assigned.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            i18n.__('mail.hello', { name: name }),
            `<p>${i18n.__('mail.assigned.main', { name: name, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p> ${i18n.__(
              'mail.assigned.message',
              {
                deadline: task.deadline
                  ? dateFormat(task.deadline, constants.dateFormat)
                  : i18n.__('mail.assigned.nodate'),
                deadlineFromNow: task.deadline
                  ? moment(task.deadline).fromNow()
                  : i18n.__('mail.assigned.anytime')
              }
            )} ${Signatures.buttons(language, {
              primary: {
                label: 'mail.assigned.end.owner.button.primary',
                url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
              },
              secondary: {
                label: 'mail.assigned.end.owner.button.secondary',
                url: `${task.url}`
              }
            })}`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  notifyInterestedUser: async (user: any, task: any, assignedUser: any) => {
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    const assignedUserName = assignedUser.name || assignedUser.username
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    setMomentLocale(language)

    try {
      return await request(to, i18n.__('mail.interested.user.assigned.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            i18n.__('mail.hello', { name: name }),
            `<p>${i18n.__('mail.interested.user.assigned.main', { username: assignedUserName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  messageInterested: async (user: any, task: any, message: string, sender: any) => {
    const senderName = sender.name
    const senderEmail = sender.email
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    setMomentLocale(language)

    try {
      return await request(
        to,
        i18n.__('mail.messageInterested.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(
              i18n.__('mail.hello', { name: name }),
              `<p>${i18n.__('mail.messageInterested.intro', { name: senderName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>
${i18n.__('mail.messageInterested.message', { message })} <p>${Signatures.sign(language)}</p>`
            )
          }
        ],
        senderEmail
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
      return await request(constants.notificationEmail, i18n.__('mail.assigned.error'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(msg)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default AssignMail

module.exports = AssignMail
