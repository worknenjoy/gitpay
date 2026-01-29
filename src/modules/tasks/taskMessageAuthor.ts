import models from '../../models'
const TaskMail = require('../mail/task')
const i18n = require('i18n')

const currentModels = models as any

export async function taskMessageAuthor({ id }: any, { message }: any, user: any) {
  try {
    const task = await currentModels.Task.findByPk(id, { include: [currentModels.User] })
    
    const taskUser = task.User.dataValues
    const language = taskUser.language || 'en'
    i18n.setLocale(language)
    TaskMail.messageAuthor(user.dataValues, task, message)
    return task
  } catch (error) {
    throw error
  }
}
