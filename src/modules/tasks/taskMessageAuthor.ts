import models from '../../models'
import TaskMail from '../../mail/task'
import i18n from 'i18n'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any

export async function taskMessageAuthor({ id }: any, { message }: any, user: any) {
  const task = await currentModels.Task.findByPk(id, {
    include: [{ model: currentModels.User, attributes: { exclude: USER_SENSITIVE_ATTRIBUTES } }]
  })

  const taskUser = task.User.dataValues
  const language = taskUser.language || 'en'
  i18n.setLocale(language)
  TaskMail.messageAuthor(user.dataValues, task, message)
  return task
}
