import models from '../../models'

const currentModels = models as any

type OfferExistsParams = {
  userId: number
  taskId: number
}

export async function offerExists(offerAttributes: OfferExistsParams) {
  try {
    const offer = await currentModels.Offer.findOne({
      where: {
        userId: offerAttributes.userId,
        taskId: offerAttributes.taskId
      }
    })
    
    if (!offer) return false
    return offer
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw error
  }
}
