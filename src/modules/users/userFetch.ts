import models from '../../models'

const currentModels = models as any

export async function userFetch(id: number) {
  const data = await currentModels.User.findOne({
    where: { id },
    include: [currentModels.Type]
  })
  return data
}
