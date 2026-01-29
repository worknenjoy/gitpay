import models from '../../models'
import AssignMail from '../mail/assign'
import i18n from 'i18n'

const currentModels = models as any

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
      currentModels.User,
      currentModels.Order,
      { model: currentModels.Offer, include: [currentModels.User] },
      { model: currentModels.Assign, include: [currentModels.User] }
    ]
  })

  const targetInterested = taskData.dataValues.Offers.filter((o: any) => o.id === params.offerId)[0]
  const taskUser = taskData.User.dataValues
  const language = taskUser.language || 'en'
  i18n.setLocale(language)
  // @ts-ignore - AssignMail.messageInterested accepts 4 params but type definition shows 3
  AssignMail.messageInterested(
    targetInterested.User.dataValues,
    taskData.dataValues,
    params.message,
    user
  )
  return taskData
}
