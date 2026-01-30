import models from '../../models'

const currentModels = models as any

export async function projectProgrammingLanguage() {
  const data = await currentModels.ProjectProgrammingLanguage.findAll({})
  return data
}
