import models from '../../models'
const AssignMail = require('../mail/assign')
const i18n = require('i18n')

const currentModels = models as any

type OfferMessageTask = {
  id: number
}

type OfferMessageParams = {
  offerId: number
  message: string
}

export async function offerMessage(
  task: OfferMessageTask,
  params: OfferMessageParams,
  user: any
) {
  const taskData = await currentModels.Task.findByPk(task.id, {
    include: [
      currentModels.User,
      currentModels.Order,
      { model: currentModels.Offer, include: [currentModels.User] },
      { model: currentModels.Assign, include: [currentModels.User] }
    ]
  })
  
  const targetInterested = taskData.dataValues.Offers.filter(
    (o: any) => o.id === params.offerId
  )[0]
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
