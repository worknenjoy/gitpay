import models from '../../models'
import AssignMail from '../../mail/assign'
import i18n from 'i18n'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any
const publicUserInclude = {
  model: currentModels.User,
  attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
}

export async function taskMessage({ id }: any, { interested, message }: any, user: any) {
  const task = await currentModels.Task.findByPk(id, {
    include: [
      publicUserInclude,
      currentModels.Order,
      { model: currentModels.Assign, include: [publicUserInclude] }
    ]
  })

  const targetInterested = task.dataValues.Assigns.filter((a: any) => a.id === interested)[0]
  const taskUser = task.User.dataValues
  const language = taskUser.language || 'en'
  i18n.setLocale(language)
  // @ts-ignore - AssignMail.messageInterested accepts 4 params but type definition shows 3
  AssignMail.messageInterested(targetInterested.User.dataValues, task.dataValues, message, user)
  return task
}
