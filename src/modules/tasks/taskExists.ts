import models from '../../models'

const currentModels = models as any

export async function taskExists(taskAttributes: any) {
  try {
    const task = await currentModels.Task.findOne({
      where: {
        id: taskAttributes.id
      }
    })
    if (!task) return false
    return task
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw error
  }
}
