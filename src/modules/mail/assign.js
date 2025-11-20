const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const dateFormat = require('dateformat')
const moment = require('moment')
const ptLocale = require('moment/locale/pt-br')
const enLocale = require('moment/locale/en-gb')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')

const setMomentLocale = (lang) => {
  if (lang === 'br') {
    moment.locale('pt-br', ptLocale)
  } else {
    moment.locale('en-gb', enLocale)
  }
}

const AssignMail = {
  owner: {
    interested: (to, task, name, offer) => {},
    assigned: (to, task, name) => {}
  },
  messageInterested: (user, task, message) => {},
  notifyInterestedUser: (user, task) => {},
  interested: (to, task, name) => {},
  assigned: (to, task) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  AssignMail.owner.interested = (user, task, interested, offer) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    setMomentLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.assign.owner.subject'), [
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
  }

  AssignMail.owner.assigned = (user, task, interested) => {
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    const assignedName = interested.name || interested.username
    const deadline = task.deadline
      ? dateFormat(task.deadline, constants.dateFormat)
      : i18n.__('mail.assigned.nodate')
    const deadlineFromNow = task.deadline
      ? moment(task.deadline).fromNow()
      : i18n.__('mail.assigned.anytime')
    i18n.setLocale(language)
    setMomentLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.assign.owner.assigned.subject', { assignedName }), [
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
  }

  AssignMail.interested = (user, task) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    setMomentLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.interested.owner.subject'), [
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
  }

  AssignMail.assigned = (user, task) => {
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username

    i18n.setLocale(language)
    setMomentLocale(language)

    user?.receiveNotifications &&
      request(to, i18n.__('mail.assigned.subject'), [
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
  }

  AssignMail.notifyInterestedUser = (user, task, assignedUser) => {
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    const assignedUserName = assignedUser.name || assignedUser.username
    i18n.setLocale(language)
    setMomentLocale(language)
    user?.receiveNotifications &&
      request(to, i18n.__('mail.interested.user.assigned.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(
            i18n.__('mail.hello', { name: name }),
            `<p>${i18n.__('mail.interested.user.assigned.main', { username: assignedUserName, title: task.title, url: `${process.env.FRONTEND_HOST}/#/task/${task.id}` })}</p>`
          )
        }
      ])
  }

  AssignMail.messageInterested = (user, task, message, sender) => {
    const senderName = sender.name
    const senderEmail = sender.email
    const to = user.email
    const language = user.language || 'en'
    const name = user.name || user.username
    i18n.setLocale(language)
    setMomentLocale(language)
    user?.receiveNotifications &&
      request(
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
  }

  AssignMail.error = (msg) => {
    request(constants.notificationEmail, i18n.__('mail.assigned.error'), [
      {
        type: 'text/html',
        value: emailTemplate.baseContentEmailTemplate(msg)
      }
    ])
  }
}

module.exports = AssignMail
