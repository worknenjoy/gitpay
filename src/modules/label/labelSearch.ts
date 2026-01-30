import models from '../../models'

const currentModels = models as any

export async function labelSearch(searchParams?: any) {
  const data = await currentModels.Label.findAll({
    where: searchParams || {},
    order: [['name', 'ASC']]
  })
  return data
}
