import models from '../../models'
import AssignMail from '../../mail/assign'
import i18n from 'i18n'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any
const publicUserInclude = {
  model: currentModels.User,
  attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
}

type OfferMessageTask = {
  id: number
}

type OfferMessageParams = {
  offerId: number
  message: string
}

export async function offerMessage(task: OfferMessageTask, params: OfferMessageParams, user: any) {
  const taskData = await currentModels.Task.findByPk(task.id, {
    include: [
      publicUserInclude,
      currentModels.Order,
      { model: currentModels.Offer, include: [publicUserInclude] },
      { model: currentModels.Assign, include: [publicUserInclude] }
    ]
  })

  const targetInterested = taskData.dataValues.Offers.filter((o: any) => o.id === params.offerId)[0]
  const taskUser = taskData.User.dataValues
  const language = taskUser.language || 'en'
  i18n.setLocale(language)
  AssignMail.messageInterested(
    targetInterested.User.dataValues,
    taskData.dataValues,
    params.message,
    user
  )
  return taskData
}
