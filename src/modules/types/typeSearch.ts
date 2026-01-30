import models from '../../models'

const currentModels = models as any

export async function typeSearch() {
  try {
    const type = await currentModels.Type.findAll({})
    return type
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
