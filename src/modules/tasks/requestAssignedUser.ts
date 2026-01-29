import models from '../../models'
import { taskUpdate } from './taskUpdate'
const SendMail = require('../mail/mail')
const i18n = require('i18n')
const Signatures = require('../mail/content')

const currentModels = models as any

const sendConfirmationEmail = async (task: any, assign: any) => {
  const user = assign.User
  const URL = (reason: string) =>
    `${process.env.FRONTEND_HOST}/#/task/${task.id}/interested/${assign.id}#${reason}`
  const language = user.language || 'en'
  i18n.setLocale(language)

  const body = `
      ${i18n.__('mail.assigned.request.body', {
        name: user.name || user.username || '',
        title: task.title,
        url: task.url
      })}
    ${Signatures.buttons(language, {
      primary: {
        label: 'mail.assigned.request.button.primary',
        url: URL('accept')
      },
      secondary: {
        label: 'mail.assigned.request.button.secondary',
        url: URL('reject')
      }
    })}
      `

  const res = await currentModels.Assign.update(
    {
      status: 'pending-confirmation'
    },
    {
      where: {
        id: assign.id
      }
    }
  )
  
  return SendMail.success(
    { email: user.email, language },
    i18n.__('mail.assigned.request.subject'),
    body
  )
}

export async function invite({ taskId, assignId }: any) {
  const task = await currentModels.Task.findByPk(taskId)
  const assign = await currentModels.Assign.findOne({
    where: {
      id: assignId
    },
    include: [currentModels.User]
  })

  if (task.status === 'in_progress') {
    return task
  }

  if (assign.status === 'rejected') {
    await currentModels.Assign.update({ status: 'pending' }, { where: { id: assignId } })
  }

  return sendConfirmationEmail(task, assign)
}

const actionAssign = async (data: any) => {
  if (
    typeof data !== 'object' ||
    !['taskId', 'assignId', 'confirm'].every((prop) => prop in data)
  ) {
    return new Error('Bad Token')
  }

  const { taskId, assignId, confirm, message } = data
  const assign = await currentModels.Assign.findOne({
    where: {
      id: assignId
    },
    include: [currentModels.User]
  })

  if (!assign || assign.status === 'in_progress' || assign.status === 'rejected') {
    return { id: taskId }
  }

  // Accept Task
  if (confirm) {
    await assign.update({ status: 'accepted' }, { where: { id: assignId } })
    return taskUpdate({ id: taskId, assigned: assignId })
  }
  // Reject Task
  else {
    await currentModels.Assign.update({ status: 'rejected', message }, { where: { id: assignId } })
    const task = await currentModels.Task.findOne({
      where: {
        id: taskId
      },
      include: [currentModels.User]
    })
    const user = assign.User
    const taskOwner = task.User
    const language = taskOwner.language || 'en'
    i18n.setLocale(language)

    const body = `${i18n.__('mail.assigned.request.deny.body', {
      name: taskOwner.name || taskOwner.username || '',
      user: user.name || user.username || '',
      title: task.title,
      url: task.url,
      message
    })}
      `

    SendMail.success(
      { email: taskOwner.email, language, receiveNotifications: taskOwner.receiveNotifications },
      i18n.__('mail.assigned.request.deny.subject'),
      body
    )

    return task.dataValues
  }
}

export async function confirm(body: any) {
  return actionAssign(body)
}
