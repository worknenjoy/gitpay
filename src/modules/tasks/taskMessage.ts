import models from '../../models'
const AssignMail = require('../mail/assign')
const i18n = require('i18n')

const currentModels = models as any

export async function taskMessage({ id }: any, { interested, message }: any, user: any) {
  try {
    const task = await currentModels.Task.findByPk(id, {
      include: [currentModels.User, currentModels.Order, { model: currentModels.Assign, include: [currentModels.User] }]
    })
    
    const targetInterested = task.dataValues.Assigns.filter((a: any) => a.id === interested)[0]
    const taskUser = task.User.dataValues
    const language = taskUser.language || 'en'
    i18n.setLocale(language)
    AssignMail.messageInterested(targetInterested.User.dataValues, task.dataValues, message, user)
    return task
  } catch (error) {
    throw error
  }
}
