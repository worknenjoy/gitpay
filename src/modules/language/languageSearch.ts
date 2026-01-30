import models from '../../models'

const currentModels = models as any

export async function languageSearch(searchParams?: any) {
  const data = await currentModels.ProgrammingLanguage.findAll({
    where: searchParams || {},
    order: [['name', 'ASC']]
  })
  return data
}
