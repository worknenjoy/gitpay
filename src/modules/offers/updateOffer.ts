import models from '../../models'

const currentModels = models as any

type UpdateOfferParams = {
  id: number
}

type UpdateOfferData = {
  status: string
}

export async function updateOffer(params: UpdateOfferParams, data: UpdateOfferData) {
  const result = await currentModels.Offer.update(
    { status: data.status },
    { where: { id: params.id } }
  )
  return result
}
